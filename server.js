//setup express server
const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");

var usersBTC = [];
var usersETH = [];

//setup web3
const Web3 = require("web3");
const web3Provider = new Web3.providers.HttpProvider(
  "https://ropsten.infura.io/v3/3836675eabdb47ac9308311f31a93117"
);
const web3 = new Web3(web3Provider);

//Mnemonic safe words
const bip39 = require("bip39");
const crypto = require("crypto");
const m2p = require("mnemonic-to-key-pair");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");

//setup bitcoin networks
var bitcoin = require("bitcoinjs-lib");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sending homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//Sending wallet image to homepage request
app.get("/walletImage", (req, res) => {
  res.sendFile(path.join(__dirname + "/wallet.png"));
});

//Sending all of front-end client code from server
app.get("/client", (req, res) => {
  res.sendFile(path.join(__dirname + "/client.js"));
});

//Create new account request
app.post("/create", async (req, res) => {
  var words = createEthAccount();
  res.send(words);
});

//login to wallet via seed words
app.post("/login", async (req, res) => {
  var jsonBody = req.body;
  var seedWords = jsonBody.seedWords;
  var privateKey = getPrivateKey(seedWords);
  var account = web3.eth.accounts.privateKeyToAccount(privateKey);
  var addressETH = account.address;
  var ECPair = ecfacory.ECPairFactory(secp);
  const keyBuffer = Buffer.from(privateKey, "hex");
  const keyPair = ECPair.fromPrivateKey(keyBuffer);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: bitcoin.networks.testnet,
  });
  addressBTC = address;
  usersETH.push(account);
  usersBTC.push({ address: addressBTC, privateKey: privateKey });
  web3.eth.getBalance(addressETH, function (error, wei) {
    res.send({
      addressETH: addressETH,
      addressBTC: addressBTC,
      eth: web3.utils.fromWei(wei, "ether"),
      btc: 0.0,
    });
  });
});

app.post("/send", (req, res) => {
  var amount = req.body.amount;
  var from = req.body.from;
  var to = req.body.to;
  usersETH.forEach(function (account) {
    if (account.address == from) {
      var privateKey = account.privateKey;
      ethTransaction(privateKey, to, amount, res);
      res.send("Successfuly sended");
    }
  });
});

app.post("/newTransaction", (req, res) => {
  var from = req.body.from;
  var to = req.body.to;
  var amount = req.body.amount;

  // axios POST request
  const newTransaction = {
    url: "https://api.blockcypher.com/v1/btc/test3/txs/new?token=af7c9d054f5243c09ca670b8e327c2e2",
    method: "POST",
    data: {
      inputs: [
        {
          addresses: [from],
        },
      ],
      outputs: [
        {
          addresses: [to],
          value: amount * 10000000,
        },
      ],
    },
  };

  axios(newTransaction)
    .then((response) => {
      var tosign = response.data.tosign[0];
      var tx = response.data.tx;

      usersBTC.forEach(function (account) {
        if (account.address == from) {
          var privateKey = account.privateKey;
          var ECPair = ecfacory.ECPairFactory(secp);
          const keyBuffer = Buffer.from(privateKey, "hex");
          var keys = ECPair.fromPrivateKey(keyBuffer);
          var publicKey = keys.publicKey.toString("hex");
          var sign = bitcoin.script.signature
            .encode(keys.sign(Buffer.from(tosign, "hex")), 0x01)
            .toString("hex")
            .slice(0, -2);

          const sendTransaction = {
            url: "https://api.blockcypher.com/v1/btc/test3/txs/send?token=af7c9d054f5243c09ca670b8e327c2e2",
            method: "POST",
            data: {
              tx,
              tosign: [tosign],
              signatures: [sign],
              pubkeys: [publicKey],
            },
          };
          axios(sendTransaction)
            .then((response) => {
              res.send(response.data);
            })
            .catch((error) => console.log(error));
        }
      });
    })
    .catch((error) => console.log(error));
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

function createEthAccount() {
  const account = web3.eth.accounts.create();
  console.log("New account has been created: ", account);
  const privateKey = account.privateKey;
  const words = getSeedWords(privateKey);
  return words;
}

function getSeedWords(privateKey) {
  privateKeyHex = privateKey.substring(2);
  //12 word phrase
  var mnemonic = bip39.entropyToMnemonic(privateKeyHex);
  return mnemonic;
}

function getPrivateKey(seedWords) {
  var privateKey = bip39.mnemonicToEntropy(seedWords);
  return privateKey;
}

async function getAccounts() {
  const accounts = await web3.eth.getAccounts();
  return accounts;
}

async function ethTransaction(privateKey, to, amount, res) {
  var SigendTransaction = await web3.eth.accounts.signTransaction(
    {
      to: to,
      value: web3.utils.toWei(amount, "ether"),
      gas: 2000000,
    },
    privateKey
  );
  web3.eth
    .sendSignedTransaction(SigendTransaction.rawTransaction)
    .then(function (receipt) {
      console.log(receipt);
    });
}
