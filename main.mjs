#!/usr/bin/env node

import fs from "fs";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const PHRASE_FILE = process.argv[2] ?? "./phrase.txt";
const isLedger = process.argv.includes("--ledger");
const showHelp = process.argv.includes("--help") || process.argv.includes("-h");

if (showHelp) {
  console.log("Usage: ./main.mjs <phrase-file> [--ledger] [--help]");
  console.log("  --ledger   Use Ledger Nano derivation path (m/44'/501'/i')");
  console.log("             Default: Solflare path (m/44'/501'/i'/0')");
  process.exit(0);
}

if (!fs.existsSync(PHRASE_FILE)) {
  console.error(`${PHRASE_FILE} not found`);
  process.exit(1);
}

const mnemonic = fs.readFileSync(PHRASE_FILE, "utf8").trim();

if (!bip39.validateMnemonic(mnemonic)) {
  console.error("Invalid mnemonic");
  process.exit(1);
}

const seed = await bip39.mnemonicToSeed(mnemonic);
const derivationType = isLedger ? "Ledger Nano" : "Solflare";

console.log(`\n${derivationType} Derivation - Index  Pubkey`);
console.log("-----  ------------------------------------------");

for (let i = 0; i < 10; i++) {
  const path = isLedger ? `m/44'/501'/${i}'` : `m/44'/501'/${i}'/0'`;
  const { key } = derivePath(path, seed);
  const kp = Keypair.fromSeed(key);
  console.log(`${i.toString().padEnd(5)}  ${kp.publicKey.toBase58()}`);
}
