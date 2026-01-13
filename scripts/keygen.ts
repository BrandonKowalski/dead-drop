/**
 * Generate an age keypair
 * 
 * Usage: bun run keygen
 * 
 * This will:
 * 1. Generate a new age keypair
 * 2. Save the secret key to keys/secret.key
 * 3. Save the public key to keys/public.key
 * 4. Rebuild the client bundle with the key embedded
 */

import { $ } from "bun";
import { existsSync, mkdirSync } from "fs";

const KEYS_DIR = "./keys";
const SECRET_KEY_PATH = `${KEYS_DIR}/secret.key`;
const PUBLIC_KEY_PATH = `${KEYS_DIR}/public.key`;

async function main() {
  try {
    await $`which age-keygen`.quiet();
  } catch {
    console.error("age is not installed!");
    console.error("");
    console.error("Install it with:");
    console.error("  brew install age     # macOS");
    console.error("  apt install age      # Debian/Ubuntu");
    console.error("  pacman -S age        # Arch");
    console.error("");
    console.error("Or visit: https://github.com/FiloSottile/age#installation");
    process.exit(1);
  }

  if (existsSync(SECRET_KEY_PATH)) {
    console.error(`Secret key already exists at ${SECRET_KEY_PATH}`);
    console.error("   Delete the keys/ folder first if you want to generate new keys.");
    process.exit(1);
  }

  if (!existsSync(KEYS_DIR)) {
    mkdirSync(KEYS_DIR, { recursive: true });
  }

  console.log("Generating age keypair...");
  const result = await $`age-keygen`.text();

  const publicKeyMatch = result.match(/public key: (age1[a-z0-9]+)/);
  if (!publicKeyMatch) {
    console.error("Failed to parse age-keygen output");
    process.exit(1);
  }

  const publicKey = publicKeyMatch[1];

  await Bun.write(SECRET_KEY_PATH, result);
  console.log(`Secret key saved to ${SECRET_KEY_PATH}`);
  console.log("    Keep this safe! Anyone with this key can read your messages.");

  // @ts-ignore
  await Bun.write(PUBLIC_KEY_PATH, publicKey);
  console.log(`Public key saved to ${PUBLIC_KEY_PATH}`);

  console.log("");
  console.log("Building client with embedded key...");
  await $`bun run build`;

  console.log("");
  console.log("Your public key:");
  console.log(`   ${publicKey}`);
  console.log("");
  console.log("You're all set! Run 'bun run dev' to start the server.");
  console.log("");
  console.log("To decrypt messages:");
  console.log("   bun run decrypt");
}

main();

main();
