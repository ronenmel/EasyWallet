var currency;
var addressBTC;
var addressETH;

$(document).ready(function () {
  //hiding not nesseccery elements
  $("#btnEnter").hide();
  $("#accountContainer").hide();
  $("#inputWordsContainer").hide();
  $("#inputAmountContainer").hide();
  $("#inputToContainer").hide();
  $("#btnContinue").hide();
  $("#btnSendTransaction").hide();
  $("#btnSend").hide();
  $("#btnCoinSelect").hide();

  $("#btnCreate").click(function () {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/create",
      headers: new Headers({ "content-type": "application/json" }),
      data: {
        name: "arik zagdon",
        words:
          "arik zagdon meow hatula inbar rachuch aziz fgffgfg hghghgh hghghgh hghghgh hghghg",
      },
    }).done(function (words) {
      var warrning =
        "Write down the secret phrase on a piece of paper or print them out using a secure network printer. It is always advised to have multiple copies of your secret phrase and store it in multiple locations to prevent loss from calamities like floods, earthquakes, fires, etc.";
      $("#pDescription").text(warrning);
      $("#inputWords").val(words);
      $("#btnRestore").hide();
      $("#btnCreate").hide();
      $("#btnContinue").show();
      $("#inputWordsContainer").show();
    });
  });

  $("#btnRestore").click(function () {
    var description =
      "Enter your 12 secert words(with spaces) and press enter to login to your wallet ";
    $("#pDescription").text(description);
    $("#inputWords").attr("readonly", false);
    $("#btnRestore").hide();
    $("#btnCreate").hide();
    $("#btnContinue").show();
    $("#inputWordsContainer").show();
  });

  $("#btnContinue").click(function () {
    var seedWords = $("#inputWords").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/login",
      data: { seedWords: seedWords },
      headers: new Headers({ "content-type": "application/json" }),
    }).done(function (data) {
      $("#accountContainer").show();
      $("#addressETH").replaceWith(
        "<strong>Ethereum address:</strong> " + data.addressETH.substring(2)
      );
      $("#addressBTC").replaceWith(
        "<strong>Bitcoin address:</strong> " + data.addressBTC
      );
      $("#balanceETH").replaceWith(
        "<strong>ETH Balance:</strong> " + data.eth + " ETH"
      );
      $("#btnSendTransaction").show();
      $("#pDescription").hide();
      $("#btnContinue").hide();
      $("#inputWordsContainer").hide();

      $.ajax({
        method: "GET",
        url:
          "https://btcbook-testnet.nownodes.io/api/v2/address/" +
          data.addressBTC,
        headers: { "api-key": "c3e25a13-69f2-45d2-a985-ae2e0fb6218d" },
      }).done(function (data) {
        $("#balanceBTC").replaceWith(
          "<strong>BTC Balance:</strong> " + data.balance / 10000000 + " BTC"
        );
      });

      addressBTC = data.addressBTC;
      addressETH = data.addressETH;
    });
  });

  $("#btnSendTransaction").click(function () {
    $("#btnSend").show();
    $("#btnSendTransaction").hide();
    $("#inputAmountContainer").show();
    $("#inputToContainer").show();
    $("#btnCoinSelect").show();
  });

  $("#btnSend").click(function () {
    var currency = $("#amountTag").text();
    var amount = $("#inputAmount").val();
    var to = $("#inputTo").val();
    if (to !== "" && amount > 0) {
      if (currency == "ETH") {
        var from = addressETH;

        $.ajax({
          method: "POST",
          url: "http://localhost:3000/send",
          data: { amount: amount, from: from, to: to },
          headers: new Headers({ "content-type": "application/json" }),
        }).done(function (receipt) {
          alert(receipt);
        });
      }

      if (currency == "BTC") {
        $.ajax({
          method: "POST",
          url: "http://localhost:3000/newTransaction",
          headers: new Headers({ "content-type": "application/json" }),
          data: { from: addressBTC, to: to, amount: amount },
        }).done(function (data) {
          alert(data);
        });
      }
    }

    $("#btnSend").hide();
    $("#btnSendTransaction").show();
    $("#inputAmountContainer").hide();
    $("#inputToContainer").hide();
    $("#btnCoinSelect").hide();
  });

  $("#eth").click(function () {
    $("#amountTag").text("ETH");
    $("#coinDropDown").text("Currency: ETH ");
  });

  $("#btc").click(function () {
    $("#amountTag").text("BTC");
    $("#coinDropDown").text("Currency: BTC ");
  });

  $("#other").click(function () {
    $("#coinDropDown").text("Currency: other ");
  });
});
