import * as age from "age-encryption";

// Public key is injected at build time from keys/public.key
const PUBLIC_KEY = process.env.AGE_PUBLIC_KEY || "";

const messageEl = document.getElementById("message") as HTMLTextAreaElement;
const outputSection = document.getElementById("output-section") as HTMLElement;
const outputEl = document.getElementById("output") as HTMLElement;
const encryptBtn = document.getElementById("encrypt-btn") as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;

encryptBtn.addEventListener("click", async () => {
  const message = messageEl.value.trim();

  if (!message) {
    alert("Write something first!");
    return;
  }

  if (!PUBLIC_KEY || PUBLIC_KEY.includes("xxxxxxxx")) {
    alert("Oops! This page isn't set up yet. Run 'bun run keygen' first.");
    return;
  }

  try {
    encryptBtn.textContent = "scrambling...";

    const e = new age.Encrypter();
    e.addRecipient(PUBLIC_KEY);
    const ciphertext = await e.encrypt(message);
    const armored = age.armor.encode(ciphertext);

    outputEl.textContent = armored;
    outputSection.classList.add("visible");
    encryptBtn.textContent = "scramble";
  } catch (err) {
    alert("Something went wrong: " + (err as Error).message);
    encryptBtn.textContent = "scramble";
    console.error(err);
  }
});

copyBtn.addEventListener("click", async () => {
  const text = outputEl.textContent || "";

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "copied";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = "copy";
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    copyBtn.textContent = "copied";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = "copy";
      copyBtn.classList.remove("copied");
    }, 2000);
  }
});
