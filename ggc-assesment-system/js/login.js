const TESTER_PROFILE_KEY = "ggc_tester_profile_v1";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const message = document.getElementById("auth-message");
  const submit = document.getElementById("auth-submit");

  try {
    const saved = JSON.parse(localStorage.getItem(TESTER_PROFILE_KEY) || "null");
    if (saved?.email) {
      window.location.replace("/index.html");
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
      if (sheetUrl) {
        // Apps Script accepts this simple request without a CORS preflight.
        await fetch(sheetUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(profile) });
      }
      localStorage.setItem(TESTER_PROFILE_KEY, JSON.stringify(profile));
      window.location.replace("/index.html");
    } catch {
      message.textContent = "Data belum terkirim. Coba lagi atau hubungi pengelola tester.";
      submit.disabled = false;
      submit.querySelector("span").textContent = "Lanjut ke asesmen";
    }
  });
});
