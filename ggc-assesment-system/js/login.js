const TESTER_PROFILE_KEY = "ggc_tester_profile_v1";

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("auth-theme-toggle");
  const setLoginTheme = isDark => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
      themeToggle.innerHTML = `<i class="fas fa-${isDark ? "sun" : "moon"}" aria-hidden="true"></i><span class="sr-only">${isDark ? "Terang" : "Gelap"}</span>`;
    }
  };
  let darkTheme = false;
  try { darkTheme = localStorage.getItem("ggc_display_theme_v1") === "dark"; } catch { darkTheme = document.documentElement.dataset.theme === "dark"; }
  setLoginTheme(darkTheme);
  if (themeToggle) themeToggle.addEventListener("click", () => {
    darkTheme = document.documentElement.dataset.theme !== "dark";
    setLoginTheme(darkTheme);
    try { localStorage.setItem("ggc_display_theme_v1", darkTheme ? "dark" : "light"); } catch { /* Theme remains active until this page closes. */ }
  });

  const form = document.getElementById("auth-form");
  const message = document.getElementById("auth-message");
  const submit = document.getElementById("auth-submit");

  try {
    const saved = JSON.parse(localStorage.getItem(TESTER_PROFILE_KEY) || "null");
    if (saved?.email) {
      window.location.replace("index.html");
      return;
    }
  } catch { /* Ignore invalid tester data and ask for the form again. */ }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    message.textContent = "";
    if (!form.reportValidity()) return;

    const profile = {
      name: document.getElementById("auth-name").value.trim(),
      email: document.getElementById("auth-email").value.trim().toLowerCase(),
      phone: document.getElementById("auth-phone").value.trim(),
      education: document.getElementById("auth-education").value,
      submittedAt: new Date().toISOString()
    };
    if (profile.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) || profile.phone.length < 6) {
      message.textContent = "Periksa kembali nama, email, dan nomor telepon.";
      return;
    }

    submit.disabled = true;
    submit.querySelector("span").textContent = "Menyimpan data...";
    try {
      const sheetUrl = window.GGC_SHEETS_WEBHOOK_URL || "";
      if (!sheetUrl || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(sheetUrl)) {
        throw new Error("URL Google Sheets belum dikonfigurasi.");
      }

      // Follow the form-to-google-sheets pattern: send named fields as FormData.
      // Apps Script reads these values from e.parameter (no JSON parsing needed).
      const formData = new FormData(form);
      formData.set("name", profile.name);
      formData.set("email", profile.email);
      formData.set("phone", profile.phone);
      formData.set("education", profile.education);
      await fetch(sheetUrl, { method: "POST", mode: "no-cors", body: formData });

      localStorage.setItem(TESTER_PROFILE_KEY, JSON.stringify(profile));
      window.location.replace("index.html");
    } catch (error) {
      console.error("Gagal mengirim data tester:", error);
      message.textContent = "Data belum terkirim. Coba lagi atau hubungi pengelola tester.";
      submit.disabled = false;
      submit.querySelector("span").textContent = "Lanjut ke asesmen";
    }
  });
});
