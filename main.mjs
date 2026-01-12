#!/usr/bin/env node

import fs from "fs";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const PHRASE_FILE = process.argv[2] ?? "./phrase.txt";
const isLedger = process.argv.includes("--ledger");
const showHelp = process.argv.includes("--help") || process.argv.includes("-h");

if (showHelp) {
  console.log(
    "Solana HD Wallet Key Recovery Verification - Derive public keys from BIP39 seed phrases\n",
  );
  console.log("Usage: ./main.mjs <phrase-file> [--ledger] [--help]\n");
  console.log("Description:");
  console.log(
    "  Derives 10 Solana public keys from a 24-word BIP39 recovery seed phrase",
  );
  console.log(
    "  using HD wallet derivation. Supports both Ledger Nano and standard",
  );
  console.log("  software wallets (Solflare, Phantom).\n");
  console.log("Arguments:");
  console.log(
    "  <phrase-file>  Path to text file containing your 24-word BIP39 mnemonic",
  );
  console.log("                 (one line, space-separated words)\n");
  console.log("Options:");
  console.log(
    "  --ledger       Use Ledger Nano derivation path (m/44'/501'/i')",
  );
  console.log(
    "                 Default: Solflare/Phantom path (m/44'/501'/i'/0')\n",
  );
  console.log("  --help, -h     Show this help message\n");
  console.log("Examples:");
  console.log("  ./main.mjs phrase.txt");
  console.log("  ./main.mjs phrase.txt --ledger\n");
  console.log("Phrase File Format:");
  console.log(
    "  Plain text file with a single line containing exactly 12 or 24 BIP39 words",
  );
  console.log("  separated by spaces.\n");
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