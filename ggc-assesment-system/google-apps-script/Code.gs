var SPREADSHEET_ID = "1cflKhrSxQ2W7Vn8sn928BqGwa4QEe9b5wE2Os8V-a3s";

// Buka URL /exec di browser untuk memastikan deployment dapat dijangkau.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "GGC tester form" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    // FormData submissions are exposed as e.parameter by Apps Script.
    // Keep JSON support for compatibility with older deployed pages.
    var data = e && e.parameter ? e.parameter : {};
    if (!data.name && e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents || "{}");
    }
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim().toLowerCase();
    var phone = String(data.phone || "").trim();
    var education = String(data.education || "").trim();
    if (name.length < 2 || name.length > 100) throw new Error("Nama tidak valid");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email tidak valid");
    if (phone.length < 6 || phone.length > 30) throw new Error("Nomor telepon tidak valid");
    if (!education || education.length > 60) throw new Error("Jenjang pendidikan tidak valid");

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName("Tester") || spreadsheet.insertSheet("Tester");
    if (sheet.getLastRow() === 0) sheet.appendRow(["Waktu daftar", "Nama", "Email", "Nomor telepon", "Jenjang pendidikan"]);
    sheet.appendRow([new Date(), safeCell(name), safeCell(email), safeCell(phone), safeCell(education)]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function safeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
