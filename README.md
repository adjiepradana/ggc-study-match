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
   - **Instant Demo Autofill**: Quick test presets for Tech/AI, Psychology, Medicine, and Creative Arts.

---

## 🚀 How to Run

### Option 1: Direct File Opening
Simply double-click `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Included)
Run the lightweight built-in Node server:
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📂 File Structure

```
d:\GGC\
├── index.html            # Main HTML structure (Landing, Assessment, & Report views)
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
