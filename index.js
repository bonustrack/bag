const Mnemonic = require('bitcore-mnemonic');
const objectHash = require('byteballcore/object_hash');

const generateRandomSeed = () => {
  let mnemonic = new Mnemonic();
  while (!Mnemonic.isValid(mnemonic.toString())) {
    mnemonic = new Mnemonic();
  }
  return mnemonic.phrase;
};

const target = process.env.TARGET || 'FABIEN';
const path = "m/44'/0'/0'/0/0";

const generateAddress = () => {
  const randomSeed = generateRandomSeed();
  const mnemonic = new Mnemonic(randomSeed);
  const xPrivKey = mnemonic.toHDPrivateKey();
  const { privateKey } = xPrivKey.derive(path);
  const pubkey = privateKey.publicKey.toBuffer().toString('base64');
  const definition = ['sig', { pubkey }];
  return {
    seed: randomSeed,
    address: objectHash.getChash160(definition),
  };
};

let address;
let seed;
let i = 0;

const start = () => {
  console.log('BAG starting');
  do {
    i++;
    const generated = generateAddress();
    address = generated.address;
    seed = generated.seed;
    if (address.slice(0, 5) === target.slice(0, 5)) {
      console.log('5', i, address, seed);
    } else if (address.slice(0, 4) === target.slice(0, 4)) {
      console.log('4', i, address, seed);
    } else if (address.slice(0, 3) === target.slice(0, 3)) {
      console.log('3', i, address, seed);
    }
  } while (address.slice(0, target.length) !== target);
  console.log('Bingo!', i, address, seed);
};

start();
