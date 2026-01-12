# Solana HD Wallet Key Recovery

A Node.js command-line tool for deriving Solana public keys from BIP39 recovery seed phrases
using HD wallet derivation paths.

## Purpose

This tool helps to verify recovery phrases usde to import Solana wallet accounts from a 24-word BIP39 mnemonic seed
phrase by deriving the public keys for multiple account indices.

It supports both **Ledger** and **standard wallet software** (Solflare, Phantom) derivation paths, allowing you to
verify recovery for accounts created with different wallet implementations.

## Installation

```bash
npm install -g solana-verify-recovery
```

## Usage

```bash
solana-verify-recovery <phrase-file> [--ledger] [--help]
```

### Arguments

- `<phrase-file>` - Path to a text file containing your 24-word BIP39 mnemonic (default: `./phrase.txt`)
- `--ledger` - Use Ledger Nano derivation path (see below)
- `--help` - Show help message

### Examples

Derive keys using default Solflare/Phantom path:

```bash
solana-verify-recovery phrase.txt
```

Derive keys using Ledger Nano path:
```bash
solana-verify-recovery phrase.txt --ledger
```

Show help:
```bash
solana-verify-recovery --help
```

## Derivation Paths

This tool supports two HD wallet derivation standards:

### Default Mode (Solflare/Phantom Compatible)

**Path**: `m/44'/501'/i'/0'` where `i` is the account index (0-9)

Used by:
- Solflare
- Phantom
- Most standard software wallets

This is the most commonly used derivation path for Solana software wallets.

### Ledger Mode (`--ledger` flag)

**Path**: `m/44'/501'/i'` where `i` is the account index (0-9)

Used by:
- Ledger Nano S/X

Ledger uses a shallower derivation tree without the final `/0'` component. This results in completely different public keys compared to the default mode, even when using the same seed phrase and account index.

## Key Differences

| Feature | Default Mode | Ledger Mode |
|---------|--------------|------------|
| Derivation Path | `m/44'/501'/i'/0'` | `m/44'/501'/i'` |
| Compatible Wallets | Solflare, Phantom, most software wallets | Ledger Nano devices |
| Use Case | Desktop/mobile wallets | Hardware wallets |

**Important**: The same recovery phrase will produce **different public keys** in each mode. Make sure you're using the correct mode for your wallet.

## How It Works

1. Reads the 24-word mnemonic from a text file
2. Validates the mnemonic using BIP39 checksum
3. Generates a 64-byte seed from the mnemonic (BIP39-PBKDF2)
4. Derives public keys for indices 0-9 using the selected derivation path
5. Prints the public key for each index

## Requirements

- Node.js installed
