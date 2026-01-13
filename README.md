# Dead Drop

A simple page for receiving encrypted messages. Uses [age](https://github.com/FiloSottile/age) encryption in the browser—nothing readable leaves the visitor's device.

## Setup

Requires [Bun](https://bun.sh) and [age](https://github.com/FiloSottile/age#installation).

```bash
bun install
bun run keygen   # generate keypair + build
bun run dev      # start dev server at localhost:3000
```

## Commands

```bash
bun run build    # bundle client (requires keypair)
bun run decrypt  # decrypt a message (interactive, file, or piped)
```

## Decrypting

```bash
bun run decrypt              # paste message, press Enter twice
bun run decrypt message.txt  # from file
cat message.txt | bun run decrypt
```

## Deployment

`public/` is a static site. Deploy to Netlify, Vercel, GitHub Pages, or run `bun run start`.
