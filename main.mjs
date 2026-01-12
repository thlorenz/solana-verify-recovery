#!/usr/bin/env node

import fs from "fs";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const PHRASE_FILE = process.argv[2] ?? "./phrase.txt";

if (!fs.existsSync(PHRASE_FILE)) {
  console.error(`${PHRASE_FILE} not found`);
  process.exit(1);
}

const mnemonic = fs.readFileSync(PHRASE_FILE, "utf8").trim();
console.log(mnemonic.toString("utf8"));

if (!bip39.validateMnemonic(mnemonic)) {
  console.error("Invalid mnemonic");
  process.exit(1);
}

const seed = await bip39.mnemonicToSeed(mnemonic);

console.log("Index  Pubkey");
console.log("-----  ------------------------------------------");

for (let i = 0; i < 10; i++) {
  const path = `m/44'/501'/${i}'/0'`;
  const { key } = derivePath(path, seed);
  const kp = Keypair.fromSeed(key);
  console.log(`${i.toString().padEnd(5)}  ${kp.publicKey.toBase58()}`);
}
