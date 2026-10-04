# GGC STUDY FIT ASSESSMENT™
> **Discover Your Potential. Find Your Direction.**  
> Official Platform by **Go Great Career — Career Readiness Platform**

A modern, responsive, and scientifically grounded web application designed to help high school students, gap-year candidates, and parents find the most accurate college majors through an advanced **Dual-Matrix Matching™** methodology.

---

## 🌟 Key Highlights & Features

1. **Brand Identity & Eye-Catching UI**:
   - Designed around the official **Go Great Career** logo (`assets/logo.jpg`).
   - Elegant color palette: Forest Emerald (`#0B4632`), Champagne Gold (`#C5A869`), Crisp Sage (`#EBF4F0`), and clean luxury typography (`Plus Jakarta Sans` & `Playfair Display`).
   - Tactile 5-point Likert scale buttons (1 = Sangat Tidak Sesuai s/d 5 = Sangat Sesuai) with keyboard shortcuts (keys 1-5).

2. **Full 84-Item Assessment Across 7 Core Dimensions**:
   - **Section A: TALENT** (18 items: Verbal, Numerical, Analytical, Spatial, Creative, Social)
   - **Section B: INTEREST** (18 items: People, Ideas, Data, Things, Creative, Nature/Life)
   - **Section C: PERSONALITY / WORK STYLE** (12 items: Structure, Exploration, Social, Independence)
   - **Section D: VALUES** (12 items: Meaning, Security, Achievement, Freedom, Income, Contribution)
   - **Section E: ACADEMIC STRENGTH** (12 items: Language, Math, Science, Social, Art/Design, Technology)
   - **Section F: CAREER ORIENTATION** (6 items: People, Information, Business, Technology, Helping, Creating)
   - **Section G: READINESS INDEX** (6 items: Self-awareness, Exploration, Information, Career awareness, Decision confidence, Commitment)

3. **Dual-Matrix Matching Algorithm**:
   - **Matrix 1 — Person Profile**:
     - Calculates normalized subdimension averages (1.0 - 5.0).
     - Derives **"YOUR POTENTIAL SIGNATURE"** (e.g., *Analytical + Social + Verbal* or *Creative + Spatial + Analytical*) with tailored archetype titles and descriptions.
     - Performs Section G **Readiness Diagnostic** (0 - 100%) across 6 critical decision factors.
   - **Matrix 2 — Study Profile (18 Major Clusters)**:
     - 18 comprehensive university major clusters calibrated with expected weighted profiles.
     - Categories: Very Strong Fit (88%+), Strong Fit (78-87%), Potential Fit (68-77%), and Explore Further (<68%).

4. **Actionable Parent & Student Diagnostic Report**:
   - **Why This Fit?**: Clear psychological and cognitive rationale connecting the student's strengths to the field.
   - **What To Watch Out For?**: Gap analysis detecting prerequisite blindspots (e.g. math/numerical requirements in psychology or engineering) with concrete preparation advice.
   - **Recommended Exploration**: Practical syllabus research, professional certifications, and field branches.
   - **Core Subjects & Top Career Prospects**: Realistic breakdown of university curriculum and market roles.
   - **Crisp SVG Radar Chart**: 100% offline-ready vector radar chart visualizing strengths across Talent & Interest.
   - **Readiness Diagnostic Gauge**: Evaluates decision maturity and highlights the primary focus area for counseling.
   - **Print & PDF Support**: Dedicated `@media print` CSS formatted for official printouts and parent consultations.

---

## Form tester dan Google Sheets

Halaman awal meminta **nama, email, nomor telepon, dan jenjang pendidikan**. Tidak ada kata sandi maupun autentikasi. Setelah mengisi form, tester masuk ke asesmen; progres asesmen tetap tersimpan di local storage browser.

### Sambungkan ke Google Sheets

1. Buat Google Sheet, lalu pilih **Extensions → Apps Script**.
2. Salin ID spreadsheet dari URL (`https://docs.google.com/spreadsheets/d/ID_SPREADSHEET/edit`). Ganti `PASTE_SPREADSHEET_ID_HERE` di bagian atas file [`google-apps-script/Code.gs`](google-apps-script/Code.gs) dengan ID tersebut. Tempel seluruh isi file itu ke editor Apps Script, lalu simpan.
3. Di Apps Script pilih **Deploy → New deployment → Web app**. Pilih **Execute as: Me** dan **Who has access: Anyone**, lalu deploy dan izinkan akses yang diminta Google. Salin URL Web app yang berakhiran `/exec`.
4. Buka [`js/sheets-config.js`](js/sheets-config.js), tempel URL tersebut sebagai nilai `GGC_SHEETS_WEBHOOK_URL`, lalu simpan.
5. Deploy/import folder ini di Vercel. Atur **Root Directory** ke `ggc-assesment-system` bila mengimpor repository dari folder `D:\GGC`.

### Deploy melalui GitHub Pages

Repository ini menyimpan situs di folder `ggc-assesment-system`, jadi workflow [`../.github/workflows/pages.yml`](../.github/workflows/pages.yml) menerbitkan isi folder tersebut. Di GitHub buka **Settings → Pages**, pilih **GitHub Actions** sebagai Build and deployment source, lalu push perubahan ke branch `main`. Setelah workflow selesai, buka URL Pages yang ditampilkan di **Settings → Pages** atau di hasil workflow.

Data akan masuk ke tab `Tester` dengan kolom waktu daftar, nama, email, nomor telepon, dan jenjang pendidikan. Form tanpa password cocok untuk pengujian sederhana, tetapi siapa pun yang memiliki URL dapat mengirim data ke Sheet. Jangan gunakan untuk data sensitif atau sebagai sistem akun produksi. URL Web app disediakan oleh Google Apps Script dan dipasang langsung pada konfigurasi browser.

Untuk uji lokal, jalankan `node server.js`, isi URL Apps Script di `js/sheets-config.js`, lalu buka `http://localhost:3000`.

---

## 📂 File Structure

```
d:\GGC\
├── index.html            # Main HTML structure (Landing, Assessment, & Report views)
├── login.html            # Login and account registration
├── server.js             # Lightweight zero-dependency static HTTP server
├── README.md             # Documentation and overview
├── assets\
│   └── logo.jpg          # Official Go Great Career logo
├── css\
│   └── style.css         # Styling, brand design, animations, & print rules
└── js\
    ├── data.js           # 84 assessment items & 18 study clusters matrix
    ├── engine.js         # Person Profile, Potential Signature, & Dual-Matrix logic
    └── app.js            # App controller, step navigation, SVG radar, & local storage
```

---

*© 2026 GO GREAT CAREER — All Rights Reserved. GGC STUDY FIT ASSESSMENT™.*
