#!/usr/bin/env bun

/**
 * Decrypt an age-encrypted message
 * 
 * Usage:
 *   bun run decrypt                    # Interactive mode - paste message
 *   bun run decrypt message.txt        # Decrypt from file
 *   cat message.txt | bun run decrypt  # Pipe in message
 */

import { $ } from "bun";
import { existsSync } from "fs";
import * as readline from "readline";

const SECRET_KEY_PATH = "./keys/secret.key";

async function main() {
  // Check for secret key
  if (!existsSync(SECRET_KEY_PATH)) {
    console.error("No secret key found at", SECRET_KEY_PATH);
    console.error("Run 'bun run keygen' first to generate your keypair.");
    process.exit(1);
  }

  // Check if age is installed
  try {
    await $`which age`.quiet();
  } catch {
    console.error("age is not installed!");
    console.error("");
    console.error("Install it with:");
    console.error("  brew install age     # macOS");
    console.error("  apt install age      # Debian/Ubuntu");
    console.error("  pacman -S age        # Arch");
    process.exit(1);
  }

  let encryptedMessage: string;

  // Check if a file was passed as argument
  const inputFile = process.argv[2];

  if (inputFile) {
    // Read from file
    if (!existsSync(inputFile)) {
      console.error(`File not found: ${inputFile}`);
      process.exit(1);
    }
    encryptedMessage = await Bun.file(inputFile).text();
  } else if (!process.stdin.isTTY) {
    // Read from pipe
    encryptedMessage = await Bun.stdin.text();
  } else {
    // Interactive mode - read until we see END AGE ENCRYPTED FILE
    console.log("📨 Paste the encrypted message (including the BEGIN/END lines):");
    console.log("");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    const lines: string[] = [];

    for await (const line of rl) {
      lines.push(line);
      if (line.includes("-----END AGE ENCRYPTED FILE-----")) {
        break;
      }
    }

    rl.close();
    encryptedMessage = lines.join("\n");
  }

  if (!encryptedMessage?.trim()) {
    console.error("No message provided");
    process.exit(1);
  }

  // Write to temp file and decrypt
  const tempFile = `/tmp/age-decrypt-${Date.now()}.txt`;
  await Bun.write(tempFile, encryptedMessage.trim());

  try {
    console.log("");
    console.log("🔓 Decrypted message:");
    console.log("─".repeat(40));

    const result = await $`age -d -i ${SECRET_KEY_PATH} ${tempFile}`.text();
    console.log(result);

    console.log("─".repeat(40));
  } catch (error) {
    console.error("Decryption failed. Is this a valid age-encrypted message?");
    process.exit(1);
  } finally {
    // Clean up temp file
    await $`rm -f ${tempFile}`.quiet();
  }
}

main();
