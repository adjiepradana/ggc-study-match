/**
 * GGC STUDY FIT ASSESSMENT™ - DATA DEFINITION
 * Copyright © Go Great Career - Career Readiness Platform
 * 84 Items Across 7 Dimensions + 18 Study Clusters Matrix
 */

const ASSESSMENT_DATA = {
  scaleOptions: [
    { value: 1, label: "Sangat Tidak Sesuai", short: "STS" },
    { value: 2, label: "Tidak Sesuai", short: "TS" },
    { value: 3, label: "Cukup Tidak Sesuai", short: "CTS" },
    { value: 4, label: "Cukup Sesuai", short: "CS" },
    { value: 5, label: "Sangat Sesuai", short: "SS" }
  ],

  sections: [
    {
      id: "talent",
      code: "A",
      title: "TALENT — “WHAT AM I GOOD AT?”",
      subtitle: "Bakat alami dan kapasitas kognitif Anda",
      description: "Bagian ini mengukur kecenderungan bakat alamiah dan kekuatan berpikir Anda dalam menyelesaikan berbagai tantangan.",
      subdimensions: [
        { key: "Verbal", name: "Bakat Verbal", desc: "Kemampuan artikulasi ide, pemahaman bahasa, dan komunikasi tertulis/lisan" },
        { key: "Numerical", name: "Bakat Numerik", desc: "Kecermatan pola angka, logika kalkulasi, dan pengambilan keputusan berbasis data" },
        { key: "Analytical", name: "Bakat Analitis", desc: "Ketajaman memecah persoalan kompleks, mencari akar penyebab, dan evaluasi solusi" },
        { key: "Spatial", name: "Bakat Spasial", desc: "Kapasitas visualisasi ruang 2D/3D, pemahaman bentuk, denah, dan diagram struktural" },
        { key: "Creative", name: "Bakat Kreatif", desc: "Kemampuan menghasilkan alternatif solusi orisinal dan melihat peluang baru" },
        { key: "Social", name: "Bakat Sosial", desc: "Kepekaan emosi orang lain, fleksibilitas komunikasi interpersonal, dan mediasi masalah" }
      ],
      items: [
        { id: "T01", sub: "Verbal", text: "Saya dapat menjelaskan ide yang rumit dengan bahasa yang mudah dipahami orang lain." },
        { id: "T02", sub: "Verbal", text: "Saya cukup mudah menemukan kata-kata yang tepat ketika harus berbicara atau menulis." },
        { id: "T03", sub: "Verbal", text: "Saya dapat memahami inti dari bacaan yang panjang." },
        { id: "T04", sub: "Numerical", text: "Saya cukup cepat menemukan pola dalam angka atau data." },
        { id: "T05", sub: "Numerical", text: "Saya dapat menggunakan angka untuk membantu mengambil keputusan." },
        { id: "T06", sub: "Numerical", text: "Saya menikmati menyelesaikan persoalan yang membutuhkan perhitungan atau logika angka." },
        { id: "T07", sub: "Analytical", text: "Ketika menghadapi masalah, saya cenderung mencari penyebabnya terlebih dahulu." },
        { id: "T08", sub: "Analytical", text: "Saya dapat memecah masalah yang besar menjadi bagian-bagian yang lebih mudah ditangani." },
        { id: "T09", sub: "Analytical", text: "Saya suka membandingkan beberapa kemungkinan sebelum menentukan solusi." },
        { id: "T10", sub: "Spatial", text: "Saya mudah membayangkan bentuk atau posisi suatu benda meskipun hanya melihat gambar." },
        { id: "T11", sub: "Spatial", text: "Saya cukup mudah memahami denah, diagram, peta, atau bentuk tiga dimensi." },
        { id: "T12", sub: "Spatial", text: "Saya dapat membayangkan bagaimana suatu benda akan terlihat jika diubah posisi atau bentuknya." },
        { id: "T13", sub: "Creative", text: "Saya sering menemukan lebih dari satu cara untuk menyelesaikan suatu persoalan." },
        { id: "T14", sub: "Creative", text: "Saya dapat menghasilkan ide baru ketika diberi tugas yang terbuka." },
        { id: "T15", sub: "Creative", text: "Saya cenderung melihat kemungkinan yang belum terpikirkan oleh orang lain." },
        { id: "T16", sub: "Social", text: "Saya cukup mudah memahami apa yang sedang dirasakan atau dibutuhkan orang lain." },
        { id: "T17", sub: "Social", text: "Orang lain sering meminta pendapat saya ketika mereka menghadapi masalah." },
        { id: "T18", sub: "Social", text: "Saya dapat menyesuaikan cara berkomunikasi dengan orang yang berbeda-beda." }
      ]
    },
    {
      id: "interest",
      code: "B",
      title: "INTEREST — “WHAT DO I ENJOY?”",
      subtitle: "Aktivitas dan objek yang membuat Anda bersemangat",
      description: "Di bagian ini kita menggali aktivitas autentik yang memberi Anda energi positif dan antusiasme belajar jangka panjang.",
      subdimensions: [
        { key: "People", name: "Minat Manusia (People)", desc: "Dinamika manusia, membantu, mendampingi, dan memahami motivasi perilaku" },
        { key: "Ideas", name: "Minat Gagasan (Ideas)", desc: "Konsep abstrak, filosofi, riset mendalam, dan rasa ingin tahu 'mengapa sesuatu terjadi'" },
        { key: "Data", name: "Minat Data", desc: "Pola angka, statistik, grafik informasi, dan pengambilan keputusan faktual" },
        { key: "Things", name: "Minat Mesin & Sistem (Things)", desc: "Perangkat teknis, mesin, struktur fisik, perbaikan, dan cara kerja alat" },
        { key: "Creative", name: "Minat Kreasi Seni", desc: "Desain, estetika, karya visual, audio, tulisan, dan ekspresi orisinal" },
        { key: "NatureLife", name: "Minat Alam & Hayati (Nature/Life)", desc: "Sains kehidupan, organisme, tubuh manusia, hewan, botani, dan ekosistem" }
      ],
      items: [
        { id: "I01", sub: "People", text: "Saya tertarik memahami mengapa orang berpikir dan bertindak dengan cara tertentu." },
        { id: "I02", sub: "People", text: "Saya menikmati kegiatan yang memungkinkan saya membantu atau mengembangkan orang lain." },
        { id: "I03", sub: "People", text: "Saya tertarik berdiskusi tentang hubungan, perilaku, atau kehidupan manusia." },
        { id: "I04", sub: "Ideas", text: "Saya senang mempelajari konsep atau teori baru hanya karena ingin memahaminya." },
        { id: "I05", sub: "Ideas", text: "Saya menikmati pertanyaan yang tidak memiliki jawaban sederhana." },
        { id: "I06", sub: "Ideas", text: "Saya tertarik mencari tahu “mengapa” sesuatu terjadi." },
        { id: "I07", sub: "Data", text: "Saya tertarik mencari pola dari angka, grafik, atau informasi." },
        { id: "I08", sub: "Data", text: "Saya menikmati kegiatan yang membutuhkan analisis data." },
        { id: "I09", sub: "Data", text: "Saya penasaran bagaimana data dapat digunakan untuk membuat keputusan." },
        { id: "I10", sub: "Things", text: "Saya tertarik memahami bagaimana mesin, alat, atau sistem bekerja." },
        { id: "I11", sub: "Things", text: "Saya menikmati kegiatan membuat, memperbaiki, atau mengutak-atik sesuatu." },
        { id: "I12", sub: "Things", text: "Saya tertarik pada teknologi dan cara kerjanya." },
        { id: "I13", sub: "Creative", text: "Saya menikmati membuat desain, tulisan, video, musik, atau karya visual." },
        { id: "I14", sub: "Creative", text: "Saya tertarik menghasilkan sesuatu yang memiliki unsur keindahan atau keunikan." },
        { id: "I15", sub: "Creative", text: "Saya menikmati kebebasan untuk mengekspresikan ide dengan cara saya sendiri." },
        { id: "I16", sub: "NatureLife", text: "Saya tertarik memahami kehidupan, tubuh manusia, hewan, tumbuhan, atau alam." },
        { id: "I17", sub: "NatureLife", text: "Saya menikmati kegiatan yang berhubungan dengan sains dan kehidupan." },
        { id: "I18", sub: "NatureLife", text: "Saya penasaran bagaimana sesuatu hidup, tumbuh, dan berubah." }
      ]
    },
    {
      id: "personality",
      code: "C",
      title: "PERSONALITY / WORK STYLE — “HOW DO I WORK BEST?”",
      subtitle: "Gaya kerja dan lingkungan belajar preferensial",
      description: "Bukan diagnosis klinis, melainkan kecocokan ritme kerja, kebutuhan kepastian, dan interaksi yang membuat Anda berkembang maksimal.",
      subdimensions: [
        { key: "Structure", name: "Struktur & Keteraturan", desc: "Kenyamanan pada SOP, perencanaan matang, ketelitian, dan langkah kerja yang jelas" },
        { key: "Exploration", name: "Eksplorasi & Fleksibilitas", desc: "Antusiasme pada hal baru, eksperimen terbuka, dan variasi tugas harian" },
        { key: "Social", name: "Kolaborasi Sosial", desc: "Energi dari kerja tim, presentasi di depan umum, dan komunikasi aktif" },
        { key: "Independence", name: "Kemandirian (Autonomi)", desc: "Kenyamanan bekerja mandiri tanpa perlu diawasi terus-menerus" }
      ],
      items: [
        { id: "P01", sub: "Structure", text: "Saya merasa nyaman jika memiliki aturan dan langkah kerja yang jelas." },
        { id: "P02", sub: "Structure", text: "Saya cenderung membuat rencana sebelum mulai mengerjakan sesuatu." },
        { id: "P03", sub: "Structure", text: "Saya menikmati pekerjaan yang membutuhkan ketelitian dan konsistensi." },
        { id: "P04", sub: "Exploration", text: "Saya mudah tertarik mencoba sesuatu yang belum pernah saya lakukan." },
        { id: "P05", sub: "Exploration", text: "Saya menikmati situasi yang memberi ruang untuk bereksperimen." },
        { id: "P06", sub: "Exploration", text: "Saya cepat merasa bosan jika setiap hari harus melakukan hal yang sama persis." },
        { id: "P07", sub: "Social", text: "Saya mendapatkan energi dari berdiskusi dan bekerja bersama orang lain." },
        { id: "P08", sub: "Social", text: "Saya nyaman mempresentasikan ide di depan orang lain." },
        { id: "P09", sub: "Social", text: "Saya menikmati aktivitas yang membutuhkan banyak interaksi manusia." },
        { id: "P10", sub: "Independence", text: "Saya nyaman menentukan cara kerja saya sendiri." },
        { id: "P11", sub: "Independence", text: "Saya dapat tetap bekerja meskipun tidak selalu diarahkan oleh orang lain." },
        { id: "P12", sub: "Independence", text: "Saya menikmati tanggung jawab atas hasil pekerjaan saya sendiri." }
      ]
    },
    {
      id: "values",
      code: "D",
      title: "VALUES — “WHAT MATTERS TO ME?”",
      subtitle: "Kompas nilai dan sumber kepuasan batin karier",
      description: "Nilai personal yang mendasari motivasi intrinsik Anda dalam memilih jalan karier dan mengarungi dunia perkuliahan.",
      subdimensions: [
        { key: "Meaning", name: "Kebermaknaan Hidup", desc: "Keinginan agar karya memberikan dampak bernilai bagi kehidupan orang lain" },
        { key: "Security", name: "Stabilitas & Keamanan", desc: "Prioritas pada kepastian jalur karier, keteraturan, dan proteksi risiko" },
        { key: "Achievement", name: "Pencapaian & Prestasi", desc: "Dorongan menaklukkan tantangan tinggi dan melihat hasil nyata prestasi" },
        { key: "Freedom", name: "Kebebasan & Otonomi", desc: "Ruang mengambil keputusan mandiri dan keleluasaan waktu" },
        { key: "Income", name: "Potensi Finansial", desc: "Pertimbangan peluang return ekonomi tinggi dan pertumbuhan aset finansial" },
        { key: "Contribution", name: "Kontribusi Sosial", desc: "Komitmen menyelesaikan problem nyata masyarakat dan lingkungan sekitar" }
      ],
      items: [
        { id: "V01", sub: "Meaning", text: "Saya ingin pekerjaan saya memiliki makna bagi kehidupan orang lain." },
        { id: "V02", sub: "Meaning", text: "Saya ingin merasa bahwa pekerjaan saya memberikan kontribusi yang berarti." },
        { id: "V03", sub: "Security", text: "Stabilitas pekerjaan penting bagi saya." },
        { id: "V04", sub: "Security", text: "Saya lebih nyaman dengan pilihan karier yang memiliki jalur yang cukup jelas." },
        { id: "V05", sub: "Achievement", text: "Saya ingin memiliki kesempatan untuk mencapai sesuatu yang menantang." },
        { id: "V06", sub: "Achievement", text: "Saya merasa termotivasi ketika dapat melihat hasil nyata dari usaha saya." },
        { id: "V07", sub: "Freedom", text: "Saya ingin memiliki kebebasan menentukan bagaimana saya bekerja." },
        { id: "V08", sub: "Freedom", text: "Saya tertarik pada karier yang memberi ruang untuk mengambil keputusan sendiri." },
        { id: "V09", sub: "Income", text: "Potensi penghasilan merupakan pertimbangan penting bagi saya dalam memilih karier." },
        { id: "V10", sub: "Income", text: "Saya tertarik pada bidang yang memberikan peluang untuk meningkatkan penghasilan secara signifikan." },
        { id: "V11", sub: "Contribution", text: "Saya ingin pekerjaan saya memberikan manfaat nyata bagi masyarakat." },
        { id: "V12", sub: "Contribution", text: "Saya ingin menggunakan kemampuan saya untuk membantu menyelesaikan persoalan di sekitar saya." }
      ]
    },
    {
      id: "academic",
      code: "E",
      title: "ACADEMIC STRENGTH — “WHERE ARE MY ACADEMIC PILLARS?”",
      subtitle: "Evaluasi diri kekuatan akademis & rumpun ilmu",
      description: "Self-report kepercayaan diri dan kemudahan Anda dalam menguasai rumpun mata pelajaran tertentu.",
      subdimensions: [
        { key: "Language", name: "Bahasa & Literasi", desc: "Kepercayaan diri dalam teks panjang, tata bahasa, dan analisis wacana" },
        { key: "Math", name: "Matematika", desc: "Kenyamanan dalam aljabar, kalkulasi, persamaan, dan penalaran logis abstrak" },
        { key: "Science", name: "Sains Murni", desc: "Pemahaman konsep fisika, kimia, biologi dan relasinya dengan fenomena nyata" },
        { key: "Social", name: "Ilmu Sosial & Humaniora", desc: "Ketertarikan pada sejarah, sosiologi, ekonomi, geografi, dan isu kemasyarakatan" },
        { key: "ArtDesign", name: "Seni & Desain", desc: "Kekuatan kepekaan estetika, visual, dan eksekusi karya rupa/grafis" },
        { key: "Technology", name: "Teknologi & Komputasi", desc: "Kecakapan mengadopsi software, sistem komputasi, dan solusi digital" }
      ],
      items: [
        { id: "A01", sub: "Language", text: "Saya relatif mudah memahami pelajaran yang banyak menggunakan membaca dan menulis." },
        { id: "A02", sub: "Language", text: "Saya cukup percaya diri mengerjakan tugas yang membutuhkan kemampuan bahasa." },
        { id: "A03", sub: "Math", text: "Saya relatif nyaman mengerjakan persoalan matematika." },
        { id: "A04", sub: "Math", text: "Saya dapat memahami konsep matematika setelah mempelajarinya." },
        { id: "A05", sub: "Science", text: "Saya tertarik sekaligus cukup mampu memahami konsep-konsep sains." },
        { id: "A06", sub: "Science", text: "Saya dapat menghubungkan konsep sains dengan kejadian nyata." },
        { id: "A07", sub: "Social", text: "Saya menikmati mempelajari masyarakat, sejarah, ekonomi, atau kehidupan sosial." },
        { id: "A08", sub: "Social", text: "Saya cukup mudah memahami hubungan antara manusia dan lingkungan sosialnya." },
        { id: "A09", sub: "ArtDesign", text: "Saya merasa cukup kuat dalam aktivitas yang membutuhkan kreativitas visual atau estetika." },
        { id: "A10", sub: "ArtDesign", text: "Saya menikmati tugas yang memungkinkan saya menghasilkan karya." },
        { id: "A11", sub: "Technology", text: "Saya cukup cepat memahami aplikasi, teknologi, atau sistem digital baru." },
        { id: "A12", sub: "Technology", text: "Saya menikmati mempelajari cara menggunakan teknologi untuk menyelesaikan masalah." }
      ]
    },
    {
      id: "career",
      code: "F",
      title: "CAREER ORIENTATION — “WHERE DO I SEE MYSELF?”",
      subtitle: "Visi lingkungan profesi masa depan",
      description: "Bayangan skenario pekerjaan dan fokus kontribusi utama yang Anda dambakan di masa depan.",
      subdimensions: [
        { key: "People", name: "Orientasi Manusia", desc: "Pekerjaan padat interaksi dan komunikasi publik" },
        { key: "Information", name: "Orientasi Informasi & Riset", desc: "Pekerjaan kaya analisis wawasan dan riset mendalam" },
        { key: "Business", name: "Orientasi Bisnis", desc: "Pekerjaan tata kelola komersial dan strategi pasar" },
        { key: "Technology", name: "Orientasi Rekayasa Teknologi", desc: "Pekerjaan rancang bangun sistem komputasi dan teknik" },
        { key: "Helping", name: "Orientasi Pelayanan Sosial", desc: "Pekerjaan pendampingan dan penolong langsung" },
        { key: "Creating", name: "Orientasi Kreasi Produk", desc: "Pekerjaan penciptaan produk inovatif dan estetis" }
      ],
      items: [
        { id: "C01", sub: "People", text: "Saya membayangkan diri saya bekerja dalam pekerjaan yang banyak berhubungan dengan manusia." },
        { id: "C02", sub: "Information", text: "Saya tertarik pada pekerjaan yang banyak menggunakan informasi, analisis, atau pengetahuan." },
        { id: "C03", sub: "Business", text: "Saya tertarik memahami bagaimana bisnis dibangun, dijalankan, dan dikembangkan." },
        { id: "C04", sub: "Technology", text: "Saya tertarik membangun atau menggunakan teknologi untuk menyelesaikan masalah." },
        { id: "C05", sub: "Helping", text: "Saya tertarik pada pekerjaan yang secara langsung membantu orang lain." },
        { id: "C06", sub: "Creating", text: "Saya tertarik pada pekerjaan yang memungkinkan saya menciptakan sesuatu yang baru." }
      ]
    },
    {
      id: "readiness",
      code: "G",
      title: "READINESS — “AM I READY TO CHOOSE?”",
      subtitle: "Tingkat kesiapan pengambilan keputusan jurusan",
      description: "Skor fit yang tinggi memerlukan kesiapan eksplorasi matang agar keputusan perkuliahan mantap dan minim keraguan.",
      subdimensions: [
        { key: "SelfAwareness", name: "Self-awareness", desc: "Pemahaman jujur atas kekuatan dan limitasi diri" },
        { key: "Exploration", name: "Eksplorasi Opsi", desc: "Aktivitas aktif mencari opsi alternatif program studi" },
        { key: "Information", name: "Informasi Kurikulum", desc: "Kejelasan mata kuliah dan silabus perkuliahan yang dituju" },
        { key: "CareerAwareness", name: "Pemahaman Karier", desc: "Pengetahuan ragam profesi lulusan program studi" },
        { key: "DecisionConfidence", name: "Keyakinan Memilih", desc: "Keberanian memantapkan satu arah pilihan" },
        { key: "Commitment", name: "Komitmen Konsekuensi", desc: "Kesiapan menanggung proses studi dan tantangannya" }
      ],
      items: [
        { id: "R01", sub: "SelfAwareness", text: "Saya sudah cukup memahami kekuatan dan kelemahan diri saya." },
        { id: "R02", sub: "Exploration", text: "Saya sudah mencari informasi tentang beberapa pilihan jurusan yang menarik bagi saya." },
        { id: "R03", sub: "Information", text: "Saya mengetahui mata kuliah dan gambaran perkuliahan dari jurusan yang sedang saya pertimbangkan." },
        { id: "R04", sub: "CareerAwareness", text: "Saya sudah mencari tahu kemungkinan pekerjaan yang berkaitan dengan jurusan yang saya minati." },
        { id: "R05", sub: "DecisionConfidence", text: "Saya cukup yakin dapat menentukan pilihan jurusan setelah mendapatkan informasi yang saya perlukan." },
        { id: "R06", sub: "Commitment", text: "Saya siap mempertimbangkan konsekuensi dari pilihan jurusan yang saya ambil." }
      ]
    }
  ],

  // 18 Study Clusters Matrix (Expected Profile & Weights)
  studyClusters: [
    {
      id: "psychology",
      name: "Psikologi & Ilmu Perilaku",
      englishName: "Psychology & Behavioral Sciences",
      category: "Humaniora & Sosial",
      icon: "fa-brain",
      color: "#059669",
      expectedWeights: {
        "interest.People": 1.4,
        "talent.Analytical": 1.2,
        "talent.Verbal": 1.0,
        "talent.Social": 1.1,
        "interest.Ideas": 1.0,
        "values.Meaning": 1.1,
        "academic.Social": 1.0,
        "career.Helping": 1.3,
        "career.People": 1.0
      },
      watchOutRequirements: {
        "talent.Numerical": 3.4,
        "academic.Math": 3.2
      },
      whyFit: "Profil Anda menunjukkan ketertarikan mendalam pada dinamika perilaku manusia, empati interpersonal yang kuat, serta kemampuan analitis dalam memahami motivasi dan dinamika sosial.",
      watchOut: "Jurusan Psikologi sarat dengan metodologi penelitian kuantitatif, statistika eksperimen, dan penulisan laporan ilmiah. Jika kemampuan numerik/data Anda belum optimal, siapkan diri untuk mata kuliah psikometri dan statistik eksperimen.",
      exploreFurther: "Kurikulum riset, syarat sertifikasi psikolog (S2 Magister Psikologi Profesi), variasi peminatan (Klinis, Industri Organisasi, Perkembangan, Pendidikan), dan kesiapan empati tanpa lelah emosional.",
      careers: ["Psikolog / Konselor", "HR Specialist & Talent Acquisition", "User Experience (UX) Researcher", "Behavioral Analyst", "Trainer & People Development"],
      coreCourses: ["Statistika Psikologi & Psikometri", "Biopsikologi & Neurosains Perilaku", "Psikologi Sosial & Kepribadian", "Psikologi Perkembangan", "Metodologi Riset Kualitatif & Kuantitatif"]
    },
    {
      id: "cs_software",
      name: "Teknik Informatika & Software Engineering",
      englishName: "Computer Science & Software Engineering",
      category: "Teknologi & Komputasi",
      icon: "fa-laptop-code",
      color: "#0284c7",
      expectedWeights: {
        "talent.Analytical": 1.4,
        "talent.Numerical": 1.2,
        "interest.Things": 1.2,
        "interest.Data": 1.2,
        "academic.Technology": 1.3,
        "academic.Math": 1.1,
        "career.Technology": 1.4,
        "personality.Independence": 1.1
      },
      watchOutRequirements: {
        "personality.Structure": 3.6,
        "personality.Independence": 3.5
      },
      whyFit: "Logika analitis yang tajam, ketertarikan tinggi pada sistem teknologi, serta pola pikir pemecahan masalah algoritmis sangat selaras dengan rekayasa perangkat lunak modern.",
      watchOut: "Bidang ini menuntut ketekunan 'debugging' berjam-jam di depan layar dan adaptasi cepat terhadap bahasa pemrograman yang terus berganti secara berkala. Pastikan work style Anda mendukung kemandirian dan fokus mendalam tanpa cepat frustrasi.",
      exploreFurther: "Portofolio GitHub proyek coding, pemahaman konsep struktur data dan algoritma, serta pilihan spesialisasi (Full-stack, Cyber Security, Cloud, atau Mobile Architecture).",
      careers: ["Software Engineer / Full-stack Developer", "Cloud Solutions Architect", "Cyber Security Engineer", "System Architect", "DevOps Engineer"],
      coreCourses: ["Algoritma & Pemrograman", "Struktur Data & Basis Data", "Arsitektur Komputer & Jaringan", "Rekayasa Perangkat Lunak", "Teori Komputasi"]
    },
    {
      id: "data_ai",
      name: "Data Science & Artificial Intelligence",
      englishName: "Data Science & AI",
      category: "Teknologi & Komputasi",
      icon: "fa-chart-network",
      color: "#4f46e5",
      expectedWeights: {
        "interest.Data": 1.5,
        "talent.Analytical": 1.3,
        "talent.Numerical": 1.3,
        "academic.Math": 1.3,
        "academic.Technology": 1.2,
        "career.Information": 1.3,
        "interest.Ideas": 1.0
      },
      watchOutRequirements: {
        "academic.Math": 3.8,
        "talent.Numerical": 3.6
      },
      whyFit: "Gairah menggali insight dari kumpulan data kompleks, kekuatan logika matematika-statistika, dan minat tinggi pada otomatisasi komputasi cerdas.",
      watchOut: "Kebutuhan matematika teoritis (aljabar linier, kalkulus multivariat, probabilitas mendalam) sangat intensif. Selain coding, fondasi matematika murni harus benar-benar Anda nikmati.",
      exploreFurther: "Penerapan machine learning di industri, pemahaman etika kecerdasan buatan, serta perbedaan jalur akademisi riset AI vs praktisi data analyst.",
      careers: ["Machine Learning Engineer", "Data Scientist", "AI Research Specialist", "Business Intelligence Architect", "Quantitative Analyst"],
      coreCourses: ["Aljabar Linier Terapan & Kalkulus", "Statistika Inferensial & Bayesian", "Machine Learning & Deep Learning", "Big Data Analytics", "Natural Language Processing"]
    },
    {
      id: "engineering_tech",
      name: "Teknik Rekayasa Fisik & Manufaktur",
      englishName: "Mechanical, Civil & Electrical Engineering",
      category: "Sains & Teknik",
      icon: "fa-cogs",
      color: "#d97706",
      expectedWeights: {
        "talent.Spatial": 1.3,
        "talent.Numerical": 1.2,
        "talent.Analytical": 1.2,
        "interest.Things": 1.4,
        "academic.Science": 1.2,
        "academic.Math": 1.2,
        "career.Technology": 1.2
      },
      watchOutRequirements: {
        "academic.Science": 3.7,
        "academic.Math": 3.7
      },
      whyFit: "Kombinasi penalaran spasial yang unggul, minat mengutak-atik mesin/sistem fisik, dan kekuatan kalkulasi fisika-matematika untuk mewujudkan infrastruktur nyata.",
      watchOut: "Beban praktikum laboratorium, kalkulus teknik multi-tahap, dan gambar teknik menuntut ketelitian tinggi. Perkuat ketahanan akademik di sains dan kalkulus sebelum perkuliahan.",
      exploreFurther: "Perbedaan fokus antara Teknik Mesin (mekanika/termodinamika), Teknik Sipil (struktur/infrastruktur), dan Teknik Elektro (kelistrikan/kontrol).",
      careers: ["Mechanical Engineer", "Civil Project Engineer", "Electrical Systems Specialist", "Production & Plant Manager", "Structural Consultant"],
      coreCourses: ["Kalkulus Teknik & Fisika Dasar", "Termodinamika & Mekanika Fluida", "Gambar Teknik & CAD/BIM", "Analisis Struktur & Material", "Otomasi & Kontrol Industri"]
    },
    {
      id: "medicine_health",
      name: "Kedokteran & Sains Biomedis",
      englishName: "Medicine & Biomedical Sciences",
      category: "Kesehatan & Hayati",
      icon: "fa-stethoscope",
      color: "#e11d48",
      expectedWeights: {
        "interest.NatureLife": 1.4,
        "academic.Science": 1.4,
        "values.Meaning": 1.2,
        "career.Helping": 1.3,
        "talent.Analytical": 1.1,
        "personality.Structure": 1.1,
        "values.Contribution": 1.1
      },
      watchOutRequirements: {
        "values.Contribution": 3.8,
        "personality.Structure": 3.6,
        "academic.Science": 4.0
      },
      whyFit: "Panggilan kuat untuk menolong kesembuhan sesama, ketertarikan mendalam pada sains biologis dan tubuh manusia, serta kemampuan berpikir terstruktur di bawah tekanan klinis.",
      watchOut: "Jalur profesi dokter sangat panjang (Sarjana Kedokteran, Koas, Ujian Profesi, Internship, Spesialisasi) dan membutuhkan komitmen belajar seumur hidup serta daya tahan fisik-mental menghadapi jam dinas intensif.",
      exploreFurther: "Tuntutan kurikulum Problem-Based Learning (PBL), biaya dan durasi studi total hingga izin praktik, serta kesehatan mental dalam menghadapi kasus emergensi.",
      careers: ["Dokter Umum / Spesialis", "Biomedical Scientist", "Clinical Consultant", "Medical Director", "Pakar Kesehatan Masyarakat"],
      coreCourses: ["Anatomi & Histologi Manusia", "Fisiologi Kedokteran", "Patologi Klinis & Farmakologi", "Keterampilan Medik (OSCE)", "Etika & Hukum Kedokteran"]
    },
    {
      id: "pharmacy",
      name: "Farmasi & Sains Klinis",
      englishName: "Pharmacy & Clinical Sciences",
      category: "Kesehatan & Hayati",
      icon: "fa-prescription-bottle-alt",
      color: "#0d9488",
      expectedWeights: {
        "academic.Science": 1.4,
        "interest.NatureLife": 1.2,
        "talent.Analytical": 1.2,
        "personality.Structure": 1.3,
        "talent.Numerical": 1.0,
        "career.Helping": 1.1
      },
      watchOutRequirements: {
        "personality.Structure": 3.8,
        "academic.Science": 3.8
      },
      whyFit: "Presisi tinggi dalam reaksi kimia farmasi, ketertarikan pada formulasi senyawa obat, dan dedikasi menjaga keselamatan pasien.",
      watchOut: "Kurikulum kimia organik dan farmakologi sangat padat dengan hafalan struktur molekul, interaksi obat, dan praktikum laboratorium kimia bertahap. Diperlukan ketelitian absolut tanpa kompromi.",
      exploreFurther: "Dua cabang besar: Farmasi Klinis/Komunitas (rumah sakit/apotek) vs Farmasi Industri (R&D formulasi dan registrasi BPOM).",
      careers: ["Apoteker Rumah Sakit & Komunitas", "Formulation Scientist (R&D)", "Regulatory Affairs Specialist", "Quality Control/Assurance Manager", "Medical Representative Lead"],
      coreCourses: ["Kimia Organik & Farmakognosi", "Farmakologi & Toksikologi", "Teknologi Sediaan Obat", "Biofarmasetika & Farmakokinetika", "Farmasi Klinis Komprehensif"]
    },
    {
      id: "business_management",
      name: "Bisnis, Manajemen & Kewirausahaan",
      englishName: "Business & Entrepreneurship",
      category: "Bisnis & Manajemen",
      icon: "fa-briefcase",
      color: "#b45309",
      expectedWeights: {
        "career.Business": 1.4,
        "talent.Social": 1.1,
        "talent.Verbal": 1.1,
        "values.Achievement": 1.2,
        "values.Income": 1.2,
        "interest.People": 1.0,
        "personality.Social": 1.1
      },
      watchOutRequirements: {
        "talent.Analytical": 3.5,
        "talent.Numerical": 3.2
      },
      whyFit: "Orientasi bisnis yang tajam, motivasi pencapaian hasil yang tinggi, serta naluri memimpin, bernegosiasi, dan menggerakkan sumber daya organisasi.",
      watchOut: "Dunia bisnis penuh dinamika risiko dan ketidakpastian. Keberhasilan menuntut ketahanan mental terhadap kegagalan, kemampuan membaca tren pasar, dan kepemimpinan tim.",
      exploreFurther: "Pengalaman organisasi riil, simulasi startup bisnis semasa kuliah, dan penguasaan fondasi literasi keuangan korporasi.",
      careers: ["Business Development Executive", "Management Consultant", "Startup Founder / Entrepreneur", "Operations Manager", "Product Manager"],
      coreCourses: ["Prinsip Manajemen & Kepemimpinan", "Pemasaran Strategis", "Manajemen Operasi & Rantai Pasok", "Perilaku Organisasi", "Kewirausahaan & Inovasi Bisnis"]
    },
    {
      id: "accounting_finance",
      name: "Akuntansi & Analisis Finansial",
      englishName: "Accounting & Finance",
      category: "Bisnis & Manajemen",
      icon: "fa-calculator",
      color: "#1e3a8a",
      expectedWeights: {
        "interest.Data": 1.4,
        "talent.Numerical": 1.3,
        "personality.Structure": 1.4,
        "talent.Analytical": 1.2,
        "values.Security": 1.2,
        "academic.Math": 1.1,
        "career.Business": 1.0
      },
      watchOutRequirements: {
        "personality.Structure": 3.8,
        "talent.Numerical": 3.5
      },
      whyFit: "Kecermatan angka yang presisi, kepatuhan pada regulasi dan standar terstruktur, serta keahlian mendiagnosis kesehatan arus keuangan korporasi.",
      watchOut: "Rutinitas audit dan pelaporan keuangan menuntut konsentrasi detail tinggi tanpa toleransi kelalaian data. Pastikan Anda menyukai kepastian aturan standar akuntansi (IFRS/PSAK).",
      exploreFurther: "Sertifikasi profesi bereputasi internasional (CPA, CA, CFA), dinamika peak season audit kantor akuntan publik, dan digital audit automation.",
      careers: ["Auditor Senior (Big 4)", "Financial Analyst / Controller", "Tax Consultant", "Investment Banker", "Corporate Treasurer"],
      coreCourses: ["Akuntansi Keuangan Menengah & Lanjutan", "Pengauditan & Assurance", "Akuntansi Manajemen & Biaya", "Hukum Pajak & Perencanaan Pajak", "Pasar Modal & Manajemen Portofolio"]
    },
    {
      id: "digital_marketing",
      name: "Pemasaran Digital & Manajemen Merek",
      englishName: "Digital Marketing & Brand Strategy",
      category: "Bisnis & Manajemen",
      icon: "fa-bullhorn",
      color: "#ea580c",
      expectedWeights: {
        "interest.Creative": 1.2,
        "career.Business": 1.3,
        "career.Creating": 1.2,
        "talent.Creative": 1.2,
        "interest.Data": 1.1,
        "talent.Social": 1.1,
        "personality.Exploration": 1.2
      },
      watchOutRequirements: {
        "interest.Data": 3.3,
        "personality.Exploration": 3.5
      },
      whyFit: "Sinergi antara kreativitas konten persuasif dengan pemahaman analitik metrik performa kampanye dan psikologi konsumen modern.",
      watchOut: "Algoritma media sosial dan tren perilaku audiens bertransformasi sangat cepat. Anda harus terbiasa dengan tekanan target KPI ROI penjualan dan adaptasi konstan.",
      exploreFurther: "Keahlian tools performa iklan (Meta Ads, Google Ads), analitik web, SEO strategi, dan riset sentimen konsumen.",
      careers: ["Brand Manager", "Growth Marketing Lead", "Digital Campaign Specialist", "Content Strategy Director", "Consumer Insights Analyst"],
      coreCourses: ["Manajemen Merek & Brand Equity", "Digital Advertising & SEO", "Consumer Behavior Analytics", "Social Media & Community Strategy", "Integrated Marketing Communications"]
    },
    {
      id: "design_creative",
      name: "Desain Komunikasi Visual & Seni Kreatif",
      englishName: "Visual Communication & Creative Arts",
      category: "Desain & Seni",
      icon: "fa-palette",
      color: "#c026d3",
      expectedWeights: {
        "talent.Creative": 1.4,
        "interest.Creative": 1.4,
        "academic.ArtDesign": 1.4,
        "talent.Spatial": 1.2,
        "career.Creating": 1.4,
        "values.Freedom": 1.2,
        "personality.Exploration": 1.1
      },
      watchOutRequirements: {
        "personality.Structure": 3.0,
        "academic.ArtDesign": 3.8
      },
      whyFit: "Imajinasi visual yang subur, kepekaan estetika tingkat tinggi, dan dorongan spontan mengekspresikan gagasan konseptual ke dalam bentuk karya rupa nyata.",
      watchOut: "Karier desain profesional menuntut penerimaan umpan balik revisi klien yang kritis serta disiplin deadline yang ketat. Kunci keberhasilan terletak pada konsistensi eksekusi, bukan sekadar inspirasi sesaat.",
      exploreFurther: "Penyusunan portofolio karya profesional (Behance/Dribbble), keahlian software grafis standar industri (Adobe Suite, Figma, 3D Render), dan pemahaman hak cipta.",
      careers: ["Art Director / Creative Director", "UI/UX Visual Designer", "Motion Graphic Artist", "Brand Identity Designer", "Illustrator & Concept Artist"],
      coreCourses: ["Tipografi & Nirmana Dwimatra/Trimatra", "Desain Identitas Merek", "Ilustrasi Digital & Komposisi", "Desain Interaktif & UI", "Sejarah & Teori Seni Desain"]
    },
    {
      id: "architecture",
      name: "Arsitektur & Desain Lingkungan",
      englishName: "Architecture & Built Environment",
      category: "Desain & Sains",
      icon: "fa-drafting-compass",
      color: "#0891b2",
      expectedWeights: {
        "talent.Spatial": 1.4,
        "talent.Creative": 1.2,
        "academic.ArtDesign": 1.2,
        "interest.Things": 1.2,
        "career.Creating": 1.2,
        "personality.Structure": 1.1,
        "academic.Math": 1.0
      },
      watchOutRequirements: {
        "talent.Spatial": 3.8,
        "personality.Structure": 3.4
      },
      whyFit: "Perpaduan ideal antara cita rasa seni estetika ruang dan ketepatan perhitungan teknis konstruksi fungsional ramah lingkungan.",
      watchOut: "Sistem studio arsitektur menuntut waktu pengerjaan maket dan asistensi desain yang intensif hingga malam hari. Perlu keseimbangan antara idealisme estetika dan kepatuhan anggaran/regulasi bangunan.",
      exploreFurther: "Program Pendidikan Profesi Arsitek (PPAr), sertifikasi IAI (Ikatan Arsitek Indonesia), dan tren Green Building Sustainable Architecture.",
      careers: ["Principal Architect", "Urban Designer / Perencana Kota", "Interior Architect", "BIM Specialist", "Heritage Conservationist"],
      coreCourses: ["Studio Desain Arsitektur (Tingkat I - VI)", "Struktur & Konstruksi Bangunan", "Fisika Bangunan & Efisiensi Energi", "Sejarah & Teori Arsitektur", "Etika Profesi & Manajemen Proyek"]
    },
    {
      id: "law_policy",
      name: "Hukum & Kebijakan Publik",
      englishName: "Law & Public Policy",
      category: "Humaniora & Sosial",
      icon: "fa-balance-scale",
      color: "#831843",
      expectedWeights: {
        "talent.Verbal": 1.4,
        "talent.Analytical": 1.3,
        "academic.Language": 1.2,
        "academic.Social": 1.1,
        "interest.Ideas": 1.1,
        "career.Information": 1.1,
        "values.Meaning": 1.0
      },
      watchOutRequirements: {
        "academic.Language": 3.7,
        "talent.Verbal": 3.7
      },
      whyFit: "Ketajaman logika argumentatif, kemampuan menelaah peraturan perundang-undangan rumit, serta kepedulian tinggi terhadap penegakan keadilan sosial.",
      watchOut: "Menuntut volume literasi pasal, analisis yurisprudensi putusan hakim yang sangat tebal, dan ketelitian bahasa hukum tingkat tinggi. Latih daya tahan membaca teks padat dan retorika debat.",
      exploreFurther: "Spesialisasi hukum (Hukum Bisnis Korporasi, Pidana, Hukum Pajak, atau Arbitrase Internasional) serta tahapan ujian profesi advokat (PKPA).",
      careers: ["Corporate Lawyer / Legal Counsel", "Jaksa / Hakim", "Public Policy Analyst", "Diplomat Regulasi", "Konsultan Kepatuhan Hukum (Compliance)"],
      coreCourses: ["Hukum Perdata & Hukum Dagang", "Hukum Pidana & Acara Pidana", "Hukum Tata Negara & Administrasi", "Hukum Internasional & Perjanjian", "Penyusunan Peraturan (Legal Drafting)"]
    },
    {
      id: "communication_pr",
      name: "Ilmu Komunikasi & Hubungan Masyarakat",
      englishName: "Communication & Public Relations",
      category: "Humaniora & Sosial",
      icon: "fa-comments",
      color: "#be185d",
      expectedWeights: {
        "talent.Verbal": 1.4,
        "talent.Social": 1.3,
        "interest.People": 1.3,
        "career.People": 1.3,
        "personality.Social": 1.2,
        "career.Creating": 1.0,
        "academic.Language": 1.1
      },
      watchOutRequirements: {
        "talent.Social": 3.6,
        "personality.Social": 3.5
      },
      whyFit: "Kemahiran artikulasi gagasan persuasif, intuisi kuat membangun hubungan interpersonal yang hangat, serta talenta merancang narasi publik yang berdampak.",
      watchOut: "Industri media dan relasi publik sarat dengan manajemen krisis reputasi mendadak dan tuntutan kerja networking yang tiada henti. Dibutuhkan ketahanan emosional dan diplomasi tinggi.",
      exploreFurther: "Peminatan Komunikasi Korporasi (PR), Jurnalisme Multimedia, atau Manajemen Komunikasi Strategis; portofolio berbicara publik dan media sosial branding.",
      careers: ["Corporate PR Specialist", "Media Relations Manager", "Spokesperson / Juru Bicara", "Crisis Communication Consultant", "Broadcaster / Podcaster"],
      coreCourses: ["Teori Komunikasi Massa", "Strategi Public Relations & Krisis", "Komunikasi Antarpribadi & Lintas Budaya", "Riset Opini Publik", "Produksi Konten Berita Multimedia"]
    },
    {
      id: "intl_relations",
      name: "Hubungan Internasional & Diplomasi",
      englishName: "International Relations & Global Affairs",
      category: "Humaniora & Sosial",
      icon: "fa-globe-americas",
      color: "#1d4ed8",
      expectedWeights: {
        "talent.Verbal": 1.3,
        "interest.Ideas": 1.3,
        "academic.Social": 1.3,
        "academic.Language": 1.3,
        "career.Information": 1.2,
        "interest.People": 1.0,
        "values.Meaning": 1.1
      },
      watchOutRequirements: {
        "academic.Language": 3.8,
        "talent.Verbal": 3.5
      },
      whyFit: "Wawasan geopolitik luas, kemahiran diplomasi lintas budaya, dan ketertarikan tinggi pada peta negosiasi perdamaian, kerja sama global, dan ekonomi politik dunia.",
      watchOut: "Jumlah kursi formasi diplomat di Kementerian Luar Negeri sangat terbatas dan selektif. Lulusan harus cerdas membangun diferensiasi (keahlian analisis risiko politik korporasi multinasional atau kemahiran bahasa asing ganda).",
      exploreFurther: "Aktivitas Model United Nations (MUN), penguasaan bahasa resmi PBB (Inggris, Mandarin, Prancis, dsb.), dan pemahaman hukum perjanjian internasional.",
      careers: ["Diplomat / Foreign Service Officer", "International NGO Program Lead", "Global Risk Analyst", "Trade Negotiator", "Foreign Affairs Journalist"],
      coreCourses: ["Teori Hubungan Internasional", "Ekonomi Politik Internasional", "Hukum & Organisasi Internasional", "Diplomasi & Negosiasi Strategis", "Politik Keamanan Global"]
    },
    {
      id: "education",
      name: "Pendidikan & Manajemen Keguruan",
      englishName: "Education & Pedagogy",
      category: "Pendidikan & Sosial",
      icon: "fa-chalkboard-teacher",
      color: "#15803d",
      expectedWeights: {
        "interest.People": 1.4,
        "career.Helping": 1.4,
        "values.Meaning": 1.3,
        "values.Contribution": 1.3,
        "talent.Verbal": 1.2,
        "talent.Social": 1.2,
        "personality.Structure": 1.0
      },
      watchOutRequirements: {
        "values.Meaning": 3.8,
        "career.Helping": 3.8
      },
      whyFit: "Hasrat tulus mendampingi dan memberdayakan generasi baru, kesabaran komunikasi mendidik, dan dedikasi pada kemajuan peradaban melalui pendidikan berkualitas.",
      watchOut: "Pendidik modern tidak hanya mengajar di kelas, tetapi juga mengelola kurikulum terpersonalisasi, administrasi sekolah, dan interaksi psikologis beragam karakter anak. Butuh panggilan jiwa yang kokoh.",
      exploreFurther: "Pendidikan Profesi Guru (PPG), tren EdTech learning designer, kurikulum diferensiasi, dan peluang kepemimpinan yayasan sekolah.",
      careers: ["Pendidik / Dosen Spesialis", "Learning Experience Designer (EdTech)", "Kurator Kurikulum Pendidikan", "Konsultan Manajemen Sekolah", "Child Education Advocate"],
      coreCourses: ["Landasan Ilmu Pendidikan & Pedagogi", "Psikologi Belajar & Perkembangan", "Desain Kurikulum & Evaluasi Belajar", "Teknologi Pembelajaran Interaktif", "Manajemen Kelas & Bimbingan"]
    },
    {
      id: "biotech_lifesci",
      name: "Bioteknologi & Ilmu Hayati",
      englishName: "Biotechnology & Life Sciences",
      category: "Sains & Teknik",
      icon: "fa-dna",
      color: "#047857",
      expectedWeights: {
        "interest.NatureLife": 1.5,
        "academic.Science": 1.4,
        "talent.Analytical": 1.2,
        "interest.Ideas": 1.2,
        "career.Technology": 1.1,
        "personality.Independence": 1.1
      },
      watchOutRequirements: {
        "academic.Science": 3.8,
        "personality.Structure": 3.4
      },
      whyFit: "Rasa takjub ilmiah pada rekayasa genetika, biomolekuler, mikroorganisme, dan inovasi sains mutakhir demi kemandirian pangan, energi hayati, dan terapi biologis.",
      watchOut: "Sebagian besar karier periset bioteknologi menuntut studi lanjutan (S2/S3) untuk memimpin laboratorium riset. Nikmati kultur eksperimen laboratorium yang membutuhkan kesabaran observasi.",
      exploreFurther: "Perbedaan fokus antara Bioteknologi Medis (vaksin/sel punca), Bioteknologi Pangan (ketahanan pangan transgenik), dan Bioinformatika komputasi genomik.",
      careers: ["Biotechnologist Researcher", "Genomics Data Analyst", "Bioprocess Development Engineer", "Quality Assurance Lab Specialist", "Clinical Research Associate"],
      coreCourses: ["Biologi Molekuler & Genetika Lanjutan", "Rekayasa Genetika & Kloning", "Mikrobiologi Terapan & Bioproses", "Bioinformatika", "Kultur Jaringan & Enzimologi"]
    },
    {
      id: "environmental_sci",
      name: "Ilmu Lingkungan & Keberlanjutan",
      englishName: "Environmental Science & Sustainability",
      category: "Sains & Sosial",
      icon: "fa-leaf",
      color: "#166534",
      expectedWeights: {
        "interest.NatureLife": 1.4,
        "values.Contribution": 1.4,
        "values.Meaning": 1.3,
        "academic.Science": 1.2,
        "talent.Analytical": 1.1,
        "career.Information": 1.1
      },
      watchOutRequirements: {
        "values.Contribution": 3.8,
        "academic.Science": 3.4
      },
      whyFit: "Komitmen moral tinggi menjaga ekosistem bumi, transisi energi hijau terbarukan, dan mitigasi krisis iklim melalui pendekatan sains lingkungan lintas disiplin.",
      watchOut: "Penyelesaian persoalan lingkungan sering berbenturan dengan kepentingan korporasi industri dan tarik ulur regulasi politis. Selain pemahaman ekologi, butuh pemahaman audit AMDAL dan advokasi.",
      exploreFurther: "Keahlian audit jejak karbon (carbon accounting), sertifikasi ESG (Environmental, Social, Governance) korporat, dan perencanaan konservasi terpadu.",
      careers: ["ESG & Sustainability Specialist", "Auditor AMDAL & Lingkungan", "Environmental Consultant", "Climate Policy Researcher", "Conservation Project Officer"],
      coreCourses: ["Ekologi Terapan & Biosfer", "AMDAL & Manajemen Limbah B3", "Hukum & Tata Kelola Lingkungan", "Sistem Informasi Geografis (GIS)", "Energi Terbarukan & Perubahan Iklim"]
    },
    {
      id: "hospitality_tourism",
      name: "Pariwisata & Manajemen Perhotelan",
      englishName: "Hospitality & Tourism Management",
      category: "Bisnis & Pelayanan",
      icon: "fa-concierge-bell",
      color: "#0f766e",
      expectedWeights: {
        "interest.People": 1.3,
        "talent.Social": 1.3,
        "career.People": 1.3,
        "career.Business": 1.2,
        "personality.Social": 1.2,
        "personality.Exploration": 1.2,
        "talent.Verbal": 1.1
      },
      watchOutRequirements: {
        "talent.Social": 3.7,
        "personality.Social": 3.6
      },
      whyFit: "Kecerdasan emosional yang hangat, insting keramahan alami (hospitality mindset), serta gairah menciptakan pengalaman berkesan bagi wisatawan dan pelancong global.",
      watchOut: "Industri perhotelan dan event bekerja dengan ritme 24/7 termasuk saat akhir pekan dan libur nasional. Dibutuhkan ketahanan fisik prima dan kemampuan mengelola komplain pelanggan dengan tenang.",
      exploreFurther: "Peluang karier hospitality internasional (jaringan hotel bintang lima dunia, kapal pesiar internasional, MICE exhibition event), dan sertifikasi perhotelan global.",
      careers: ["Hotel General Manager", "MICE & Event Director", "Destination Development Specialist", "Guest Experience Lead", "Tourism Marketing Consultant"],
      coreCourses: ["Manajemen Operasional Perhotelan", "Hospitality Service Quality", "Perencanaan Destinasi Wisata", "Manajemen MICE & Acara Khusus", "Strategi Pemasaran Pariwisata Global"]
    }
  ],

  // Readiness Diagnostic Matrix
  readinessThresholds: [
    {
      min: 85,
      level: "High Readiness (Sangat Siap Memilih)",
      tag: "READY TO DECIDE",
      color: "#059669",
      summary: "Siswa telah memiliki pemahaman diri yang matang, informasi jurusan yang mendalam, serta kesiapan komitmen tinggi untuk mengeksekusi pilihan.",
      actionAdvice: "Fokuskan pada penajaman target universitas terbaik, simulasi seleksi masuk (SNBP/SNBT/Mandiri/IUP Luar Negeri), dan penyusunan strategi alternatif (Plan A & B)."
    },
    {
      min: 70,
      level: "Moderate Readiness (Cukup Siap — Perlu Penguatan)",
      tag: "VALIDATION NEEDED",
      color: "#d97706",
      summary: "Siswa memiliki arah minat yang mulai mengerucut, namun masih membutuhkan penguatan data kurikulum perkuliahan dan konfirmasi prospek karier riil.",
      actionAdvice: "Jadwalkan sesi konsultasi mendalam dengan praktisi/alumni jurusan terkait, ikuti open house kampus, dan lakukan verifikasi mata kuliah yang akan dipelajari."
    },
    {
      min: 0,
      level: "Exploratory Stage (Fase Eksplorasi Awal)",
      tag: "EXPLORATION REQUIRED",
      color: "#dc2626",
      summary: "Siswa masih berada dalam tahap eksplorasi awal. Pemahaman diri dan pengetahuan tentang dunia perkuliahan masih butuh bimbingan intensif dari orang tua dan konselor.",
      actionAdvice: "Gunakan hasil Top 3 Jurusan pada laporan ini sebagai pintu masuk diskusi keluarga yang konstruktif. Hindari memaksakan keputusan terburu-buru sebelum anak memahami apa yang disukainya."
    }
  ],

  // Potential Signature archetypes dictionary
  signatureArchetypes: {
    "Analytical + Verbal + Social": {
      title: "The Strategic Counselor & Jurist",
      desc: "Anda memiliki kombinasi langka antara ketajaman analisis logis, kefasihan mengolah bahasa, dan kepekaan memahami interaksi manusia. Sangat unggul dalam memecahkan problem sosial-legal dan merumuskan strategi berbasis wawasan mendalam."
    },
    "Analytical + Numerical + Spatial": {
      title: "The Systems Architect & Engineer",
      desc: "Kekuatan analisis terukur, kalkulasi kuantitatif, dan imajinasi visual struktural menjadikan Anda arsitek solusi teknis yang tangguh. Anda mampu merancang sistem rumit dari cetak biru menjadi realitas fungsional."
    },
    "Creative + Verbal + Social": {
      title: "The Inspiring Storyteller & Brand Visionary",
      desc: "Kreativitas tak terbatas berpadu dengan artikulasi bahasa memukau dan kehangatan interpersonal. Anda terlahir untuk menggerakkan audiens, merancang narasi merek, dan menghidupkan ide-ide yang mengubah cara pandang publik."
    },
    "Creative + Spatial + Analytical": {
      title: "The Innovative Design Strategist",
      desc: "Anda mampu mengawinkan nilai estetika visual ruang dengan pemikiran analitis yang kritis. Karya Anda tidak hanya indah dipandang, tetapi juga memecahkan persoalan fungsional pengguna secara cerdas."
    },
    "Social + Verbal + Analytical": {
      title: "The Empathetic Diagnostic Lead",
      desc: "Kepekaan emosional tinggi ditopang oleh kemampuan mendengar aktif, artikulasi verbal yang menenangkan, serta ketajaman membaca pola psikologis perilaku manusia."
    },
    "Numerical + Analytical + Creative": {
      title: "The Insightful Data Alchemist",
      desc: "Anda melihat angka dan data bukan sekadar tumpukan statistik, melainkan cerita berharga. Anda piawai menemukan anomali tersembunyi dan merumuskan model prediktif yang solutif."
    }
  }
};
