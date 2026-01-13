/**
 * Build the client bundle with the public key embedded
 * 
 * Reads the public key from keys/public.key and injects it at build time
 */

import { existsSync } from "fs";

const PUBLIC_KEY_PATH = "./keys/public.key";

async function main() {
  let publicKey = "";

  if (existsSync(PUBLIC_KEY_PATH)) {
    publicKey = (await Bun.file(PUBLIC_KEY_PATH).text()).trim();
    console.log(`Found public key: ${publicKey.slice(0, 20)}...`);
  } else {
    console.warn("No public key found. Run 'bun run keygen' first.");
    console.warn("   Building with empty key (encryption won't work).");
  }

  const result = await Bun.build({
    entrypoints: ["./src/client.ts"],
    outdir: "./public",
    minify: true,
    define: {
      "process.env.AGE_PUBLIC_KEY": JSON.stringify(publicKey),
    },
  });

  if (result.success) {
    // @ts-ignore
    console.log(`Built public/client.js (${(result.outputs[0].size / 1024).toFixed(1)} KB)`);
  } else {
    console.error("Build failed:");
    console.error(result.logs);
    process.exit(1);
  }
}

main();
