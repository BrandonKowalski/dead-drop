import * as age from "age-encryption";

const PUBLIC_KEY = process.env.AGE_PUBLIC_KEY || "";

const messageEl = document.getElementById("message") as HTMLTextAreaElement;
const outputSection = document.getElementById("output-section") as HTMLElement;
const outputEl = document.getElementById("output") as HTMLElement;
const encryptBtn = document.getElementById("encrypt-btn") as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const alertEl = document.getElementById("alert") as HTMLElement;

function showAlert(message: string) {
    alertEl.textContent = message;
    alertEl.classList.add("visible");
}

function hideAlert() {
    alertEl.classList.remove("visible");
}

encryptBtn.addEventListener("click", async () => {
    const message = messageEl.value.trim();

    if (!message) {
        showAlert("Write something first!");
        return;
    }

    if (!PUBLIC_KEY || PUBLIC_KEY.includes("xxxxxxxx")) {
        showAlert("Oops! This page isn't set up yet. Run 'bun run keygen' first.");
        return;
    }

    hideAlert();

    try {
        encryptBtn.textContent = "scrambling...";

        const e = new age.Encrypter();
        e.addRecipient(PUBLIC_KEY);
        const ciphertext = await e.encrypt(message);
        outputEl.textContent = age.armor.encode(ciphertext);
        outputSection.classList.add("visible");
        encryptBtn.textContent = "encrypt";
    } catch (err) {
        showAlert("Something went wrong: " + (err as Error).message);
        encryptBtn.textContent = "encrypt";
        console.error(err);
    }
});

copyBtn.addEventListener("click", async () => {
    const text = outputEl.textContent || "";
    await navigator.clipboard.writeText(text);

    copyBtn.textContent = "copied";
    copyBtn.classList.add("copied");

    setTimeout(() => {
        copyBtn.textContent = "copy";
        copyBtn.classList.remove("copied");
    }, 2000);
});
