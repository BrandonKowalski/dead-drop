# Dead Drop

Uses [age](https://github.com/FiloSottile/age) encryption—messages are encrypted in the browser before they ever leave the visitor's device.

## Setup

### Prerequisites

- [Bun](https://bun.sh) 
- [age](https://github.com/FiloSottile/age#installation)

### Quick start

```bash
# Install dependencies
bun install

# Generate your keypair (saves secret key, updates client, rebuilds)
bun run keygen

# Start the dev server
bun run dev
```

Visit `http://localhost:3000` and you're live.

### Manual key setup

If you already have an age keypair:

1. Create a `keys/` directory
2. Save your public key to `keys/public.key` (just the key, e.g. `age1abc...`)
3. Save your secret key to `keys/secret.key`
4. Run `bun run build` to rebuild with your key embedded

## Scripts

```bash
bun run dev      # Build + start server with watch mode
bun run build    # Bundle src/client.ts → public/client.js
bun run keygen   # Generate keypair + update client + rebuild
bun run decrypt  # Decrypt a message
bun run start    # Start server (production)
```

## Decrypting messages

When someone sends you an encrypted message:

```bash
# Interactive - paste and press Enter twice
bun run decrypt

# From a file
bun run decrypt message.txt

# Piped
cat message.txt | bun run decrypt
```

Or use age directly:

```bash
echo "PASTE_ENCRYPTED_MESSAGE_HERE" | age -d -i keys/secret.key
```

## Deployment

Build creates a static site in `public/`. Deploy however you want:

- **Static hosting**: Deploy the `public/` folder to Netlify, Vercel, GitHub Pages, etc.
- **With Bun**: `bun run build && bun run start` in production
- **Docker**: Build your own image

## Project structure

```
secure-message/
├── src/
│   └── client.ts       # Client-side encryption source
├── public/
│   ├── index.html      # The page
│   ├── favicon.svg     # Lock icon
│   └── client.js       # Built bundle with key embedded (generated)
├── scripts/
│   ├── build.ts        # Build script (embeds key)
│   ├── keygen.ts       # Key generation
│   └── decrypt.ts      # Message decryption
├── keys/               # Your keys (gitignored)
│   ├── public.key      # Public key (read at build time)
│   └── secret.key      # Secret key (for decryption)
└── server.ts           # Bun server
```

## Customization

- **Colors**: Edit CSS variables in `public/index.html`
- **Copy**: Edit text in `public/index.html`
- **Domain**: Update the nav link in `public/index.html`

## Security notes

- Your secret key never leaves your machine
- Encryption happens entirely in the visitor's browser
- No external CDNs—age-encryption is bundled locally
- The server never sees plaintext
- age uses X25519 + ChaCha20-Poly1305 (modern, audited crypto)

## License

MIT
