# mnemonic-to-key-pair

[![Build Status](https://travis-ci.com/bloq/mnemonic-to-key-pair.svg?branch=master)](https://travis-ci.com/bloq/mnemonic-to-key-pair)
[![Code Style](https://img.shields.io/badge/code%20style-bloq-0063a6.svg)](https://github.com/bloq/eslint-config-bloq)

Obtain a key pair from a BIP 39 mnemonic phrase.

## Installation

```shell
npm install mnemonic-to-key-pair
```

## Usage

```js
const mnemonicToKeyPair = require('mnemonic-to-key-pair')

const { publicKey } = mnemonicToKeyPair(
  'maze birth captain runway client pulp vast universe era panda discover access',
  "m/44'/0'/0'/0/0",
  "1234"
)
console.log(publicKey.toString()) // 0238e831638a96248d1a8ee6b6ee16170667b0e0529cdc838d825b135c927aa95d
```

## API

<a name="mnemonicToKeyPair"></a>

### mnemonicToKeyPair(mnemonic, derivationPath, [password]) ⇒ [<code>keyPair</code>](#keyPair)
Obtian a key pair from a BIP39 mnemonic phrase and following the supplied
derivation path. Optinally supply a password.

**Returns**: [<code>keyPair</code>](#keyPair) - The key pair.  

| Param | Type | Description |
| --- | --- | --- |
| mnemonic | <code>string</code> | The 12-words mnemonic phrase. |
| derivationPath | <code>string</code> | The derivation path to use. I.e. "m/44'...". |
| [password] | <code>string</code> | The mnemonic password. |

<a name="keyPair"></a>

### keyPair
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>Buffer</code> | The private key. |
| publicKey | <code>Buffer</code> | The public key. |

## License

MIT
