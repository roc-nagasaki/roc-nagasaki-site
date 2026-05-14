(() => {
  const PASSWORD_HASH = "8d82b9043da9bd52b132ba18a74d97cadc27625c3dffd99fee3b7c8c564426d6";
  const STORAGE_KEY = "roc_site_unlocked";

  const gate = document.getElementById("auth-gate");
  const form = document.getElementById("auth-form");
  const input = document.getElementById("auth-password");
  const message = document.getElementById("auth-message");
  const root = document.getElementById("root");

  const unlock = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    document.body.classList.remove("site-locked");
    root?.removeAttribute("aria-hidden");
    gate?.remove();
  };

  const toHex = (buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

  const sha256 = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return toHex(hash);
  };

  if (sessionStorage.getItem(STORAGE_KEY) === "true") {
    unlock();
    return;
  }

  root?.setAttribute("aria-hidden", "true");
  input?.focus();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    const password = input.value.trim();
    if (!password) {
      message.textContent = "パスワードを入力してください。";
      input.focus();
      return;
    }

    try {
      if ((await sha256(password)) === PASSWORD_HASH) {
        unlock();
      } else {
        message.textContent = "パスワードが違います。";
        input.select();
      }
    } catch {
      message.textContent = "認証処理に失敗しました。ページを再読み込みしてください。";
    }
  });
})();
