'use strict'

require('./typedefs')

const bip39 = require('bip39')
const hdkey = require('hdkey')

/**
 * Obtian a key pair from a BIP39 mnemonic phrase and following the supplied
 * derivation path. Optinally supply a password.
 *
 * @param {string} mnemonic The 12-words mnemonic phrase.
 * @param {string} derivationPath The derivation path to use. I.e. "m/44'...".
 * @param {string} [password] The mnemonic password.
 * @returns {KeyPair} The key pair.
 */
function mnemonicToKeyPair(mnemonic, derivationPath, password) {
  const seed = bip39.mnemonicToSeedSync(mnemonic, password)
  const { privateKey, publicKey } = hdkey
    .fromMasterSeed(seed)
    .derive(derivationPath)
  return { privateKey, publicKey }
}

module.exports = mnemonicToKeyPair
