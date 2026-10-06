/**
 * GGC STUDY FIT ASSESSMENT™ - APPLICATION CONTROLLER
 * Copyright © Go Great Career - Career Readiness Platform
 */

let STORAGE_KEY = "ggc_assessment_v1";

const AppState = {
  student: {
    name: "",
    grade: "Kelas 12 SMA",
    contact: "",
    initialGoal: ""
  },
  currentSectionIndex: 0,
  questionOrder: [],
  answers: {},
  reportData: null,
  accountUser: null,
  activeFilter: "all",
  encouragementReturnFocus: null,
  pendingAssessmentContinue: null
};

// Initialize application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  const accountUser = loadTesterProfile();
  if (!accountUser) return;
  AppState.accountUser = accountUser;
  AppState.student = {
    ...AppState.student,
    name: accountUser.name,
    grade: accountUser.education,
    contact: accountUser.phone
  };
  STORAGE_KEY = `ggc_assessment_v1_${encodeURIComponent(accountUser.email)}`;
  loadSavedState();
  ensureQuestionOrder();
  initializeTheme();
  bindGlobalEvents();
  setupLandingMotion();
  renderSection();
  updateProgressUI();

  // Rebuild reports saved by earlier versions that stored answers only.
  if (Object.keys(AppState.answers).length === 84 && !AppState.reportData) {
    const personProfile = AssessmentEngine.calculatePersonProfile(AppState.answers);
    AppState.reportData = {
      personProfile,
      studyFitResults: AssessmentEngine.calculateStudyFit(personProfile),
      student: AppState.student,
      generatedAt: new Date().toISOString()
    };
    saveState();
  }

  // If there's an existing completed report, allow viewing it directly
  if (AppState.reportData && Object.keys(AppState.answers).length === 84) {
    renderReportView(AppState.reportData);
    const resumeBtn = document.getElementById("btn-resume-report");
    if (resumeBtn) resumeBtn.style.display = "inline-flex";
    const resumeBtnMobile = document.getElementById("btn-resume-report-mobile");
    if (resumeBtnMobile) resumeBtnMobile.style.display = "inline-flex";
  }
  renderDashboard();
  showView("dashboard-view");
}

function setupLandingMotion() {
  const landing = document.getElementById("landing-view");
  if (!landing) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = landing.querySelectorAll(
    ".hero-content, .hero-visual, .section-header-center, .dimension-card, .matrix-box, .plan-step-card, .faq-item"
  );

  if (!reducedMotion && "IntersectionObserver" in window) {
    landing.classList.add("motion-ready");
    revealTargets.forEach((element, index) => {
      element.dataset.reveal = "up";
      if (element.classList.contains("hero-content")) element.dataset.reveal = "left";
      if (element.classList.contains("hero-visual")) element.dataset.reveal = "right";
      if (element.matches(".dimension-card, .matrix-box, .plan-step-card, .faq-item")) {
        const position = Array.from(element.parentElement.children).indexOf(element) % 4;
        element.style.setProperty("--reveal-delay", `${position * 85}ms`);
      } else {
        element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 140)}ms`);
      }
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -36px 0px" });
    revealTargets.forEach(element => revealObserver.observe(element));
  }

  const header = document.querySelector(".site-header");
  let scrollFrame = 0;
  const updateScrollEffects = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
      if (header) header.style.setProperty("--page-scroll-progress", `${progress}%`);
    });
  };
  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  updateScrollEffects();

  if (!reducedMotion && "IntersectionObserver" in window) {
    const sections = landing.querySelectorAll("#about, #dimensions, #matrix-system, #why-parents, #faq");
    const navLinks = document.querySelectorAll(".nav-links .nav-link");
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        const active = link.hash === `#${visible.target.id}`;
        link.classList.toggle("is-current", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: "-18% 0px -58% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }
}

/**
 * Load saved answers & student info from LocalStorage
 */
function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.answers) AppState.answers = parsed.answers;
      if (parsed.reportData) AppState.reportData = parsed.reportData;
      if (parsed.student) AppState.student = { ...AppState.student, ...parsed.student };
      if (parsed.currentSectionIndex !== undefined) AppState.currentSectionIndex = parsed.currentSectionIndex;
      if (Array.isArray(parsed.questionOrder)) AppState.questionOrder = parsed.questionOrder;
    }
  } catch (e) {
    console.warn("Storage load error:", e);
  }
}

const QUESTIONS_PER_PAGE = 12;

function ensureQuestionOrder() {
  const allItems = ASSESSMENT_DATA.sections.flatMap(section => section.items);
  const validSavedOrder = AppState.questionOrder.length === allItems.length &&
    new Set(AppState.questionOrder).size === allItems.length &&
    allItems.every(item => AppState.questionOrder.includes(item.id));

  if (!validSavedOrder) {
    AppState.questionOrder = allItems.map(item => item.id);
    for (let i = AppState.questionOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [AppState.questionOrder[i], AppState.questionOrder[j]] = [AppState.questionOrder[j], AppState.questionOrder[i]];
    }
    saveState();
  }
}

function getAssessmentPages() {
  const itemsById = new Map(ASSESSMENT_DATA.sections.flatMap(section => section.items).map(item => [item.id, item]));
  const orderedItems = AppState.questionOrder.map(id => itemsById.get(id)).filter(Boolean);
  const pages = [];
  for (let i = 0; i < orderedItems.length; i += QUESTIONS_PER_PAGE) {
    pages.push(orderedItems.slice(i, i + QUESTIONS_PER_PAGE));
  }
  return pages;
}

/**
 * Save current state
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      student: AppState.student,
      answers: AppState.answers,
      currentSectionIndex: AppState.currentSectionIndex,
      questionOrder: AppState.questionOrder,
      reportData: AppState.reportData
    }));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

/**
 * Bind DOM events
 */
function bindGlobalEvents() {
  document.querySelectorAll(".theme-toggle").forEach(button => {
    button.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  });

  document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".faq-item[open]").forEach(openItem => {
        if (openItem !== item) openItem.open = false;
      });
    });
  });

  // Expandable examples for the seven assessment dimensions
  document.querySelectorAll(".dimension-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const details = document.getElementById(button.getAttribute("aria-controls"));
      if (!details) return;

      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      details.hidden = expanded;
      const label = button.querySelector("span");
      if (label) label.textContent = expanded ? "Lihat contoh aspek" : "Sembunyikan aspek";
    });
  });

  // Start Assessment Buttons
  const startBtns = document.querySelectorAll(".btn-start-assessment");
  startBtns.forEach(btn => {
    btn.addEventListener("click", () => openStudentModal());
  });

  const logoutButtons = document.querySelectorAll("#btn-logout, #btn-logout-mobile");
  logoutButtons.forEach(logoutButton => {
    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;
      localStorage.removeItem("ggc_tester_profile_v1");
      window.location.replace("login.html");
    });
  });

  // Modal Student Form
  const formModal = document.getElementById("student-onboarding-form");
  if (formModal) {
    formModal.addEventListener("submit", (e) => {
      e.preventDefault();
      handleStudentOnboardingSubmit();
    });
  }

  // Navigation Buttons
  const btnPrev = document.getElementById("btn-nav-prev");
  const btnNext = document.getElementById("btn-nav-next");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (AppState.currentSectionIndex > 0) {
        AppState.currentSectionIndex--;
        saveState();
        renderSection();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      handleNextSection();
    });
  }

  const encouragementContinue = document.getElementById("btn-encouragement-continue");
  if (encouragementContinue) encouragementContinue.addEventListener("click", continueAfterEncouragement);
  const encouragementReview = document.getElementById("btn-encouragement-review");
  if (encouragementReview) encouragementReview.addEventListener("click", closeAssessmentEncouragement);
  window.addEventListener("keydown", event => {
    const encouragement = document.getElementById("assessment-encouragement");
    if (event.key === "Escape" && encouragement?.classList.contains("open")) closeAssessmentEncouragement();
  });

  // Reset Button
  const btnReset = document.getElementById("btn-reset-assessment");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mereset seluruh jawaban dan memulai dari awal?")) {
        AppState.answers = {};
        AppState.currentSectionIndex = 0;
        AppState.reportData = null;
        localStorage.removeItem(STORAGE_KEY);
        renderSection();
        updateProgressUI();
        showNotification("Jawaban berhasil direset.");
      }
    });
  }

  // Print Report Button
  const btnPrint = document.getElementById("btn-print-report");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Retake Assessment Button
  const btnRetake = document.getElementById("btn-retake-assessment");
  if (btnRetake) {
    btnRetake.addEventListener("click", () => {
      if (confirm("Ingin mengubah jawaban atau memulai tes ulang?")) {
        showView("assessment-view");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Share / Copy Report Summary
  const btnShare = document.getElementById("btn-share-report");
  if (btnShare) {
    btnShare.addEventListener("click", () => {
      copyReportSummary();
    });
  }

  // Mobile Menu Drawer Triggers
  const btnMobileMenu = document.getElementById("btn-mobile-menu");
  if (btnMobileMenu) {
    btnMobileMenu.addEventListener("click", () => {
      const drawer = document.getElementById("mobile-nav-drawer");
      if (drawer && drawer.classList.contains("open")) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  const btnDrawerClose = document.getElementById("btn-drawer-close");
  if (btnDrawerClose) {
    btnDrawerClose.addEventListener("click", () => closeMobileDrawer());
  }

  // Keyboard navigation for 1-5 keys
  window.addEventListener("keydown", (e) => {
    // If inside input, don't trigger
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    
    if (["1", "2", "3", "4", "5"].includes(e.key)) {
      // Find the first unanswered item in current view or focused item
      const currentItems = getAssessmentPages()[AppState.currentSectionIndex] || [];
      const unanswered = currentItems.find(it => !AppState.answers[it.id]);
      if (unanswered) {
        selectOption(unanswered.id, parseInt(e.key, 10));
      }
    }
  });
}

function loadTesterProfile() {
  let user;
  try { user = JSON.parse(localStorage.getItem("ggc_tester_profile_v1") || "null"); }
  catch { user = null; }
  if (!user?.email) {
    window.location.replace("login.html");
    return null;
  }
  const accountLabel = document.getElementById("auth-user-label");
  const accountName = document.getElementById("auth-user-name");
  const logoutButton = document.getElementById("btn-logout");
  const mobileLogoutButton = document.getElementById("btn-logout-mobile");
  if (accountLabel && accountName) {
    accountName.textContent = user.name;
    accountLabel.style.display = "inline-flex";
  }
  if (logoutButton) logoutButton.style.display = "inline-flex";
  if (mobileLogoutButton) mobileLogoutButton.style.display = "inline-flex";
  return user;
}

/**
 * Mobile Navigation Drawer Controls
 */
function openMobileDrawer() {
  const drawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const btn = document.getElementById("btn-mobile-menu");
  if (drawer) drawer.classList.add("open");
  if (backdrop) backdrop.classList.add("active");
  if (btn) btn.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileDrawer() {
  const drawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const btn = document.getElementById("btn-mobile-menu");
  if (drawer) drawer.classList.remove("open");
  if (backdrop) backdrop.classList.remove("active");
  if (btn) btn.classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Open Student Onboarding Modal
 */
function openStudentModal() {
  closeMobileDrawer();
  const modal = document.getElementById("modal-onboarding");
  if (modal) {
    // Pre-populate if exists
    document.getElementById("input-student-name").value = AppState.student.name || AppState.accountUser?.name || "";
    document.getElementById("input-student-grade").value = AppState.student.grade || "Kelas 12 SMA";
    document.getElementById("input-student-contact").value = AppState.student.contact || "";
    document.getElementById("input-student-goal").value = AppState.student.initialGoal || "";
    modal.classList.add("active");
  }
}

function closeStudentModal() {
  const modal = document.getElementById("modal-onboarding");
  if (modal) modal.classList.remove("active");
}

function handleStudentOnboardingSubmit() {
  const name = document.getElementById("input-student-name").value.trim();
  const grade = document.getElementById("input-student-grade").value;
  const contact = document.getElementById("input-student-contact").value.trim();
  const goal = document.getElementById("input-student-goal").value.trim();

  if (!name) {
    alert("Silakan masukkan nama lengkap siswa.");
    return;
  }

  AppState.student = {
    name,
    grade,
    contact,
    initialGoal: goal,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    codeId: "GGC-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  };

  saveState();
  closeStudentModal();
  showView("assessment-view");
  renderSection();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Render a neutral page of shuffled assessment questions
 */
function renderSection() {
  const pages = getAssessmentPages();
  const items = pages[AppState.currentSectionIndex];
  if (!items) return;

  // Update Section Header Info
  const secTitle = document.getElementById("section-title");
  const secSubtitle = document.getElementById("section-subtitle");
  const secDesc = document.getElementById("section-description");

  if (secTitle) secTitle.textContent = "Pernyataan tentang diri Anda";
  if (secSubtitle) secSubtitle.textContent = "Jawab sesuai dengan pengalaman dan diri Anda";
  if (secDesc) secDesc.textContent = "Pilih jawaban yang paling menggambarkan diri Anda. Soal disajikan dalam urutan campuran.";

  // Render Subdimension Tags Info
  const tagsContainer = document.getElementById("section-subdims-tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = "";
  }

  // Render Items List
  const itemsContainer = document.getElementById("assessment-items-container");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";

  items.forEach((item, idx) => {
    const currentVal = AppState.answers[item.id] || null;
    const itemCard = document.createElement("div");
    itemCard.className = `assessment-item-card ${currentVal ? "answered" : ""}`;
    itemCard.id = `item-card-${item.id}`;

    itemCard.innerHTML = `
      <div class="item-card-header">
        <span class="item-prompt-label"><i class="fas fa-sparkles"></i> PERTANYAAN</span>
        <span class="item-number-seq">Pernyataan ${AppState.currentSectionIndex * QUESTIONS_PER_PAGE + idx + 1} dari ${AppState.questionOrder.length}</span>
        <span class="item-complete-check" aria-label="Sudah dijawab"><i class="fas fa-check"></i></span>
      </div>
      <p class="item-statement">${escapeHtml(item.text)}</p>
      <div class="item-likert-scale" role="radiogroup" aria-label="Jawaban untuk pernyataan ${AppState.currentSectionIndex * QUESTIONS_PER_PAGE + idx + 1}">
        ${ASSESSMENT_DATA.scaleOptions.map(opt => `
          <button type="button" 
                  class="likert-btn ${currentVal === opt.value ? "selected" : ""}"
                  data-item-id="${item.id}"
                  data-value="${opt.value}"
                  aria-checked="${currentVal === opt.value}"
                  title="${opt.value} - ${opt.label}">
            <span class="likert-number">${opt.value}</span>
            <span class="likert-text likert-text-full">${opt.label}</span>
            <span class="likert-text-short">${opt.short}</span>
          </button>
        `).join("")}
      </div>
    `;

    itemsContainer.appendChild(itemCard);
  });

  // Attach event listeners to likert buttons
  const likertButtons = itemsContainer.querySelectorAll(".likert-btn");
  likertButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.getAttribute("data-item-id");
      const val = parseInt(btn.getAttribute("data-value"), 10);
      selectOption(itemId, val);
    });
  });

  // Render Step Nav Pills
  renderStepTabs();

  // Update navigation button states
  const btnPrev = document.getElementById("btn-nav-prev");
  const btnNext = document.getElementById("btn-nav-next");

  if (btnPrev) {
    btnPrev.disabled = AppState.currentSectionIndex === 0;
  }

  if (btnNext) {
    if (AppState.currentSectionIndex === pages.length - 1) {
      btnNext.innerHTML = `<span>Hitung & Lihat Hasil Asesmen</span> <i class="fas fa-chart-pie"></i>`;
      btnNext.classList.add("btn-finish");
    } else {
      btnNext.innerHTML = `<span>Lanjut</span> <i class="fas fa-arrow-right"></i>`;
      btnNext.classList.remove("btn-finish");
    }
  }

  updateProgressUI();
}

/**
 * Handle Option Selection
 */
function selectOption(itemId, value) {
  AppState.answers[itemId] = value;
  saveState();

  const card = document.getElementById(`item-card-${itemId}`);
  if (card) {
    card.classList.add("answered");
    const btns = card.querySelectorAll(".likert-btn");
    btns.forEach(btn => {
      const btnVal = parseInt(btn.getAttribute("data-value"), 10);
      if (btnVal === value) {
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
      } else {
        btn.classList.remove("selected");
        btn.setAttribute("aria-checked", "false");
      }
    });
  }

  updateProgressUI();
}

/**
 * Handle Next Section Button
 */
function handleNextSection() {
  const pages = getAssessmentPages();
  const currentItems = pages[AppState.currentSectionIndex] || [];
  const unanswered = currentItems.filter(it => !AppState.answers[it.id]);

  if (unanswered.length > 0) {
    // Scroll to the first unanswered item
    const firstMissing = unanswered[0];
    const missingCard = document.getElementById(`item-card-${firstMissing.id}`);
    if (missingCard) {
      missingCard.scrollIntoView({ behavior: "smooth", block: "center" });
      missingCard.classList.add("highlight-pulse");
      setTimeout(() => missingCard.classList.remove("highlight-pulse"), 2500);
    }
    showNotification(`Masih ada ${unanswered.length} pernyataan di halaman ini yang belum dijawab.`, "warning");
    return;
  }

  // If on last section, finish assessment
  if (AppState.currentSectionIndex === pages.length - 1) {
    // Check if ALL 84 items are answered
    const totalAnswered = Object.keys(AppState.answers).length;
    if (totalAnswered < 84) {
      showNotification(`Harap lengkapi semua 84 pernyataan (saat ini ${totalAnswered}/84).`, "warning");
      return;
    }
    showAssessmentEncouragement(true, pages);
  } else {
    showAssessmentEncouragement(false, pages);
  }
}

function initializeTheme() {
  let preference = "light";
  try { preference = localStorage.getItem("ggc_display_theme_v1") === "dark" ? "dark" : "light"; }
  catch { preference = document.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
  setTheme(preference, false);
}

function setTheme(theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  if (persist) {
    try { localStorage.setItem("ggc_display_theme_v1", isDark ? "dark" : "light"); }
    catch (error) { console.warn("Preferensi tema belum tersimpan:", error); }
  }
  document.querySelectorAll(".theme-toggle").forEach(button => {
    const icon = button.querySelector("i");
    const label = button.querySelector(".theme-toggle-label");
    const action = isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
    button.setAttribute("aria-label", action);
    button.setAttribute("aria-pressed", String(isDark));
    if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    if (label) label.textContent = button.classList.contains("theme-toggle-drawer") ? (isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap") : (isDark ? "Terang" : "Gelap");
  });
  if (AppState.reportData) renderRadarAndDimensionBars(AppState.reportData.personProfile);
}

function showAssessmentEncouragement(isFinal, pages) {
  const overlay = document.getElementById("assessment-encouragement");
  if (!overlay) {
    advanceAssessment(isFinal);
    return;
  }

  const currentSession = AppState.currentSectionIndex + 1;
  const totalAnswered = Object.values(AppState.answers).filter(value => Number(value) >= 1 && Number(value) <= 5).length;
  const remaining = Math.max(0, 84 - totalAnswered);
  const messages = [
    "Jawaban jujurmu sedang membentuk gambaran diri yang makin jelas. Kamu sudah melakukan bagian penting: berani mulai.",
    "Keren, kamu konsisten meluangkan waktu untuk mengenali potensimu. Teruskan dengan ritme yang nyaman.",
    "Satu sesi lagi selesai! Setiap jawaban membantumu menemukan arah yang terasa lebih cocok untuk dirimu."
  ];

  document.getElementById("assessment-encouragement-kicker").textContent = isFinal ? "MISI ASESMEN TUNTAS" : `SESI ${currentSession} SELESAI`;
  document.getElementById("assessment-encouragement-title").textContent = isFinal ? "Kamu berhasil menuntaskan semuanya!" : "Kamu hebat, teruskan!";
  document.getElementById("assessment-encouragement-message").textContent = isFinal
    ? "Kamu sudah menyelesaikan 84 pernyataan. Sekarang waktunya melihat peta potensi dan rekomendasi studi yang sudah kamu bangun."
    : messages[(currentSession - 1) % messages.length];
  document.getElementById("assessment-encouragement-progress").innerHTML = isFinal
    ? '<i class="fas fa-check-circle"></i> 84 pernyataan selesai • Kamu sampai di garis akhir'
    : `<i class="fas fa-check-circle"></i> ${totalAnswered} dari 84 terjawab <span>• ${remaining} lagi menuju hasilmu</span>`;
  document.getElementById("btn-encouragement-continue").innerHTML = isFinal
    ? '<span>Lihat hasil asesmen</span><i class="fas fa-chart-pie"></i>'
    : `<span>Lanjut ke sesi ${currentSession + 1} dari ${pages.length}</span><i class="fas fa-arrow-right"></i>`;

  AppState.encouragementReturnFocus = document.activeElement;
  AppState.pendingAssessmentContinue = () => advanceAssessment(isFinal);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("btn-encouragement-continue").focus();
}

function closeAssessmentEncouragement() {
  const overlay = document.getElementById("assessment-encouragement");
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  AppState.pendingAssessmentContinue = null;
  if (AppState.encouragementReturnFocus?.isConnected) AppState.encouragementReturnFocus.focus();
}

function continueAfterEncouragement() {
  const action = AppState.pendingAssessmentContinue;
  closeAssessmentEncouragement();
  if (typeof action === "function") action();
}

function advanceAssessment(isFinal) {
  if (isFinal) {
    processAndShowReport();
    return;
  }
  AppState.currentSectionIndex++;
  saveState();
  renderSection();
  window.scrollTo({ top: 0, behavior: "smooth" });
  scrollToFirstQuestion();
}

function scrollToFirstQuestion() {
  requestAnimationFrame(() => {
    const firstQuestion = document.querySelector("#assessment-items-container .assessment-item-card");
    if (!firstQuestion) return;
    firstQuestion.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/**
 * Update Progress Bar and Counter
 */
function updateProgressUI() {
  const totalItems = 84;
  const answeredCount = Object.keys(AppState.answers).length;
  const percent = Math.round((answeredCount / totalItems) * 100);

  const bar = document.getElementById("assessment-progress-fill");
  const textPercent = document.getElementById("progress-percentage-text");
  const countText = document.getElementById("progress-count-text");

  if (bar) bar.style.width = `${percent}%`;
  if (textPercent) textPercent.textContent = `${percent}%`;
  if (countText) countText.textContent = `${answeredCount} dari ${totalItems} Terjawab`;
  renderStepTabs();
  renderDashboard();
}

function renderStepTabs() {
  const container = document.getElementById("assessment-stepper");
  if (!container) return;
  const pages = getAssessmentPages();
  const page = pages[AppState.currentSectionIndex] || [];
  const sessionAnswered = page.filter(item => Number(AppState.answers[item.id]) >= 1 && Number(AppState.answers[item.id]) <= 5).length;
  container.innerHTML = `
    <div class="stepper-heading"><span><i class="fas fa-route"></i> PERJALANAN ASESMEN</span><strong>Sesi ${AppState.currentSectionIndex + 1} <small>dari ${pages.length}</small></strong></div>
    <div class="stepper-track" role="list" aria-label="${pages.length} sesi, sesi ${AppState.currentSectionIndex + 1} aktif">
      ${pages.map((items, index) => {
        const count = items.filter(item => Number(AppState.answers[item.id]) >= 1 && Number(AppState.answers[item.id]) <= 5).length;
        const complete = count === items.length;
        const current = index === AppState.currentSectionIndex;
        const state = complete ? "complete" : current ? "current" : "upcoming";
        return `<span class="stepper-step ${state}" role="listitem" ${current ? 'aria-current="step"' : ""} title="Sesi ${index + 1}: ${count} dari ${items.length} dijawab"><i>${complete ? '<span class="fas fa-check"></span>' : index + 1}</i></span>`;
      }).join('<span class="stepper-connector" aria-hidden="true"></span>')}
    </div>
    <div class="stepper-caption"><span>Jawaban di sesi ini</span><strong>${sessionAnswered} <small>/ ${page.length}</small></strong></div>
  `;
}

function renderDashboard() {
  const name = document.getElementById("dashboard-user-name");
  if (!name) return;
  const today = document.getElementById("dashboard-today");
  if (today) today.textContent = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  name.textContent = (AppState.accountUser?.name || AppState.student.name || "Teman").split(" ")[0];

  const answered = Object.values(AppState.answers).filter(value => Number(value) >= 1 && Number(value) <= 5).length;
  const percent = Math.round((Math.min(answered, 84) / 84) * 100);
  const ring = document.getElementById("dashboard-progress-ring");
  if (ring) ring.style.setProperty("--progress", `${percent}%`);
  document.getElementById("dashboard-progress-percent").textContent = `${percent}%`;
  document.getElementById("dashboard-answered-count").textContent = answered;
  document.getElementById("dashboard-progress-bar").style.width = `${percent}%`;

  const kicker = document.getElementById("dashboard-status-kicker");
  const title = document.getElementById("dashboard-progress-title");
  const description = document.getElementById("dashboard-progress-description");
  const action = document.getElementById("dashboard-primary-action");
  const nextTitle = document.getElementById("dashboard-next-title");
  const nextDescription = document.getElementById("dashboard-next-description");
  const isComplete = answered === 84 && !!AppState.reportData;
  if (isComplete) {
    kicker.textContent = "ASESMEN SELESAI";
    title.textContent = "Kamu sudah selangkah lebih dekat.";
    description.textContent = "Profil potensimu sudah dipetakan. Lihat kembali hasil dan rekomendasi studi yang paling selaras denganmu.";
    action.innerHTML = '<i class="fas fa-file-lines"></i> <span>Lihat hasil asesmen</span>';
    action.onclick = () => showView("report-view");
    nextTitle.textContent = "Jelajahi rekomendasi studimu.";
    nextDescription.textContent = "Buka laporan lengkap untuk melihat kekuatan utama, kecocokan rumpun studi, dan panduan tindakan berikutnya.";
  } else if (answered > 0) {
    kicker.textContent = "PROGRES ASESMENMU";
    title.textContent = "Bagus, kamu sudah memulai!";
    description.textContent = `Kamu telah menjawab ${answered} dari 84 pernyataan. Jawabanmu tersimpan otomatis—lanjutkan kapan saja dari perangkat ini.`;
    action.innerHTML = '<i class="fas fa-arrow-right"></i> <span>Lanjutkan asesmen</span>';
    action.onclick = () => showView("assessment-view");
    nextTitle.textContent = "Lanjutkan dari progres terakhirmu.";
    nextDescription.textContent = "Kamu bisa mengubah jawaban kapan saja. Pilih respons yang paling menggambarkan dirimu.";
  } else {
    kicker.textContent = "LANGKAH PERTAMAMU";
    title.textContent = "Kenali potensi, temukan arah.";
    description.textContent = "Mulai asesmen 84 pernyataan untuk mendapatkan pemetaan profil dan rekomendasi rumpun studi yang personal.";
    action.innerHTML = '<i class="fas fa-play"></i> <span>Mulai asesmen</span>';
    action.onclick = () => showView("assessment-view");
  }

  const result = document.getElementById("dashboard-result-card");
  if (result) result.hidden = !isComplete;
  if (isComplete) {
    const { personProfile, studyFitResults } = AppState.reportData;
    document.getElementById("dashboard-signature-code").textContent = personProfile.signature.signatureCode;
    document.getElementById("dashboard-signature-title").textContent = personProfile.signature.title;
    document.getElementById("dashboard-readiness-score").textContent = `${personProfile.readinessAnalysis.scorePercent}%`;
    document.getElementById("dashboard-readiness-level").textContent = personProfile.readinessAnalysis.level;
    document.getElementById("dashboard-top-major").textContent = studyFitResults[0]?.name || "Lihat laporan lengkap";
    document.getElementById("dashboard-top-fit").textContent = studyFitResults[0] ? `${studyFitResults[0].fitScore}% kecocokan` : "";
  }
}

/**
 * Process calculation and render final report
 */
function processAndShowReport() {
  showLoadingScreen(true);

  setTimeout(() => {
    // Calculate Person Profile & Study Fit
    const personProfile = AssessmentEngine.calculatePersonProfile(AppState.answers);
    const studyFitResults = AssessmentEngine.calculateStudyFit(personProfile);

    AppState.reportData = {
      personProfile,
      studyFitResults,
      student: AppState.student,
      generatedAt: new Date().toISOString()
    };
    saveState();

    renderReportView(AppState.reportData);
    renderDashboard();
    showLoadingScreen(false);
    showView("report-view");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 750);
}

/**
 * Render Final Report View
 */
function renderReportView(data) {
  const { personProfile, studyFitResults, student } = data;
  const signature = personProfile.signature;
  const readiness = personProfile.readinessAnalysis;

  // Student Info Header
  const displayName = student.name || "Siswa Teladan";
  document.getElementById("rep-student-name").textContent = displayName;
  const personalizedName = document.getElementById("rep-report-student-name");
  if (personalizedName) personalizedName.textContent = displayName;
  document.getElementById("rep-student-grade").textContent = student.grade || "Kelas 12 SMA";
  document.getElementById("rep-report-date").textContent = student.date || new Date().toLocaleDateString("id-ID");
  document.getElementById("rep-cert-code").textContent = student.codeId || "GGC-STUDYMATCH-2026";

  // Signature Showcase
  document.getElementById("rep-signature-code").textContent = signature.signatureCode;
  document.getElementById("rep-signature-title").textContent = signature.title;
  document.getElementById("rep-signature-desc").textContent = signature.description;

  // Render Top Traits Badges
  const sigBadgesContainer = document.getElementById("rep-signature-badges");
  if (sigBadgesContainer) {
    sigBadgesContainer.innerHTML = signature.topTraits.map(t => `
      <div class="trait-badge">
        <i class="fas fa-star text-gold"></i>
        <span>${t.label}</span>
        <span class="trait-score">${t.score.toFixed(1)} / 5.0</span>
      </div>
    `).join("");
  }

  // Top 5 Recommendations
  const topFive = studyFitResults.slice(0, 5);
  renderTopFiveCards(topFive);
  renderReportAtGlance(studyFitResults, readiness);

  // All 18 Clusters Filterable Grid
  renderAllClustersGrid(studyFitResults);

  // Readiness Diagnostic
  renderReadinessDiagnostic(readiness);

  // Radar & Dimension Charts
  renderRadarAndDimensionBars(personProfile);
}

function renderReportAtGlance(studyFitResults, readiness) {
  const best = studyFitResults[0];
  const score = Math.max(0, Math.min(100, Number(best?.fitScore) || 0));
  const bestScore = document.getElementById("rep-glance-best-score");
  const bestMajor = document.getElementById("rep-glance-best-major");
  const bestCategory = document.getElementById("rep-glance-best-category");
  const scoreRing = document.getElementById("rep-glance-score-ring");
  if (bestScore) bestScore.textContent = `${score}%`;
  if (bestMajor) bestMajor.textContent = best?.name || "Belum ada rekomendasi";
  if (bestCategory) bestCategory.textContent = best?.badgeLabel || "";
  if (scoreRing) {
    scoreRing.style.setProperty("--match-score", `${score}%`);
    scoreRing.setAttribute("aria-label", `Kecocokan teratas ${score} persen`);
  }

  const matches = document.getElementById("rep-glance-top-matches");
  if (matches) {
    matches.innerHTML = studyFitResults.slice(0, 3).map((major, index) => {
      const fitScore = Math.max(0, Math.min(100, Number(major.fitScore) || 0));
      return `<div class="glance-match-row"><span class="glance-rank">0${index + 1}</span><div class="glance-match-info"><strong>${escapeHtml(major.name)}</strong><span class="glance-match-track"><i style="--match-width:${fitScore}%"></i></span></div><b>${fitScore}%</b></div>`;
    }).join("");
  }

  const readinessScore = Math.max(0, Math.min(100, Number(readiness?.scorePercent) || 0));
  const readinessNumber = document.getElementById("rep-glance-readiness-score");
  const readinessLevel = document.getElementById("rep-glance-readiness-level");
  const readinessBar = document.getElementById("rep-glance-readiness-bar");
  if (readinessNumber) readinessNumber.textContent = `${readinessScore}%`;
  if (readinessLevel) readinessLevel.textContent = readiness?.level || "Belum tersedia";
  if (readinessBar) readinessBar.style.width = `${readinessScore}%`;
  const priority = document.getElementById("rep-glance-priority");
  if (priority) priority.textContent = readiness?.priorityFocusName || "Eksplorasi jurusan";
  const nextTitle = document.getElementById("rep-glance-next-title");
  if (nextTitle) nextTitle.textContent = best ? `Mulai eksplorasi ${best.name}` : "Lanjutkan eksplorasi pilihan studi";
  const nextCopy = document.getElementById("rep-glance-next-copy");
  if (nextCopy) nextCopy.textContent = best?.exploreFurther || readiness?.actionAdvice || "Diskusikan hasil ini bersama orang tua atau konselor.";
}

/**
 * Render Top 5 Cards
 */
function renderTopFiveCards(topFive) {
  const container = document.getElementById("rep-top-five-container");
  if (!container) return;

  container.innerHTML = topFive.map((major, index) => {
    const rank = index + 1;
    return `
      <div class="top-major-card ${major.fitLevelClass}">
        <div class="major-card-header">
          <div class="rank-badge">#${rank}</div>
          <div class="major-title-group">
            <h3 class="major-name">${major.name}</h3>
            <span class="major-en">${major.englishName} • <span class="badge-cat">${major.category}</span></span>
          </div>
          <div class="fit-score-box">
            <div class="fit-score-val ${major.fitLevelClass}">${major.fitScore}%</div>
            <div class="fit-score-badge ${major.fitLevelClass}">${major.badgeLabel}</div>
          </div>
        </div>

        <div class="major-card-body">
          <div class="info-block block-why">
            <div class="block-title">
              <i class="fas fa-check-circle text-emerald"></i>
              <h4>WHY THIS FIT? (Mengapa Sangat Sesuai?)</h4>
            </div>
            <p class="block-text">${major.whyFit}</p>
          </div>

          <div class="info-block block-watchout ${major.hasGaps ? 'has-gaps' : ''}">
            <div class="block-title">
              <i class="fas fa-exclamation-triangle text-amber"></i>
              <h4>WHAT TO WATCH OUT FOR? (Aspek yang Perlu Diantisipasi)</h4>
            </div>
            <p class="block-text">${major.watchOut}</p>
          </div>

          <div class="info-block block-explore">
            <div class="block-title">
              <i class="fas fa-search-plus text-sky"></i>
              <h4>EKSPLORASI LANJUTAN YANG DIREKOMENDASIKAN</h4>
            </div>
            <p class="block-text">${major.exploreFurther}</p>
          </div>

          <div class="details-accordion-grid">
            <div class="detail-col">
              <h5><i class="fas fa-user-graduate"></i> Contoh Mata Kuliah Inti:</h5>
              <ul class="detail-list">
                ${major.coreCourses.map(c => `<li><i class="fas fa-caret-right"></i> ${c}</li>`).join("")}
              </ul>
            </div>
            <div class="detail-col">
              <h5><i class="fas fa-briefcase"></i> Prospek Karier Unggulan:</h5>
              <div class="career-tags-wrap">
                ${major.careers.map(car => `<span class="career-tag">${car}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Render All 18 Clusters Grid with Filters
 */
function renderAllClustersGrid(allResults) {
  const container = document.getElementById("rep-all-clusters-grid");
  if (!container) return;

  const filtered = allResults.filter(item => {
    if (AppState.activeFilter === "all") return true;
    if (AppState.activeFilter === "very-strong") return item.fitScore >= 88;
    if (AppState.activeFilter === "strong") return item.fitScore >= 78 && item.fitScore < 88;
    if (AppState.activeFilter === "potential") return item.fitScore >= 68 && item.fitScore < 78;
    if (AppState.activeFilter === "explore") return item.fitScore < 68;
    return true;
  });

  container.innerHTML = filtered.map(item => `
    <div class="cluster-summary-card ${item.fitLevelClass}">
      <div class="cluster-card-top">
        <div class="cluster-icon-box">
          <i class="fas ${item.icon}"></i>
        </div>
        <div class="cluster-info">
          <h4>${item.name}</h4>
          <span class="cluster-en">${item.englishName}</span>
        </div>
        <div class="cluster-score-pill ${item.fitLevelClass}">
          ${item.fitScore}%
        </div>
      </div>
      <div class="cluster-badge-tag ${item.fitLevelClass}">${item.badgeLabel}</div>
      <p class="cluster-mini-desc">${item.whyFit.substring(0, 110)}...</p>
      <div class="cluster-card-footer">
        <button type="button" class="btn-cluster-detail" onclick="showClusterDetailModal('${item.id}')">
          <span>Lihat Analisis Lengkap</span> <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `).join("");

  // Setup filter buttons
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.activeFilter = btn.getAttribute("data-filter");
      renderAllClustersGrid(allResults);
    };
  });
}

/**
 * Show Cluster Detail Modal
 */
function showClusterDetailModal(clusterId) {
  if (!AppState.reportData) return;
  const cluster = AppState.reportData.studyFitResults.find(c => c.id === clusterId);
  if (!cluster) return;

  const modal = document.getElementById("modal-cluster-detail");
  const content = document.getElementById("cluster-modal-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="cluster-modal-header">
      <div class="header-left">
        <span class="badge-cat">${cluster.category}</span>
        <h2>${cluster.name}</h2>
        <span class="modal-en">${cluster.englishName}</span>
      </div>
      <div class="header-right">
        <div class="modal-score-box ${cluster.fitLevelClass}">
          <span class="score-num">${cluster.fitScore}%</span>
          <span class="score-lbl">${cluster.badgeLabel}</span>
        </div>
      </div>
    </div>

    <div class="modal-body-content">
      <div class="modal-sec">
        <h4><i class="fas fa-check-circle text-emerald"></i> Mengapa Sangat Sesuai (Why This Fit?)</h4>
        <p>${cluster.whyFit}</p>
      </div>

      <div class="modal-sec ${cluster.hasGaps ? 'has-gaps' : ''}">
        <h4><i class="fas fa-exclamation-triangle text-amber"></i> Aspek Kesiapan Akademik (What To Watch Out For?)</h4>
        <p>${cluster.watchOut}</p>
      </div>

      <div class="modal-sec">
        <h4><i class="fas fa-compass text-sky"></i> Eksplorasi Lebih Lanjut</h4>
        <p>${cluster.exploreFurther}</p>
      </div>

      <div class="modal-grid-two">
        <div class="modal-box">
          <h5><i class="fas fa-book-open"></i> Mata Kuliah Inti Perkuliahan:</h5>
          <ul>
            ${cluster.coreCourses.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>
        <div class="modal-box">
          <h5><i class="fas fa-briefcase"></i> Ragam Peluang Karier:</h5>
          <div class="career-tags-wrap">
            ${cluster.careers.map(car => `<span class="career-tag">${car}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function closeClusterModal() {
  const modal = document.getElementById("modal-cluster-detail");
  if (modal) modal.classList.remove("active");
}

/**
 * Render Section G: Readiness Analysis
 */
function renderReadinessDiagnostic(readiness) {
  document.getElementById("rep-readiness-percent").textContent = `${readiness.scorePercent}%`;
  document.getElementById("rep-readiness-level").textContent = readiness.level;
  document.getElementById("rep-readiness-summary").textContent = readiness.summary;
  document.getElementById("rep-readiness-advice").textContent = readiness.actionAdvice;
  document.getElementById("rep-priority-focus").textContent = readiness.priorityFocusName;

  const bar = document.getElementById("rep-readiness-gauge-fill");
  if (bar) {
    bar.style.width = `${readiness.scorePercent}%`;
    bar.style.backgroundColor = readiness.color;
  }

  // Breakdown items
  const breakdownContainer = document.getElementById("rep-readiness-breakdown");
  if (breakdownContainer) {
    breakdownContainer.innerHTML = readiness.breakdown.map(item => `
      <div class="readiness-item-row">
        <div class="row-info">
          <span class="factor-name">${item.name}</span>
          <span class="factor-score">${item.score.toFixed(1)} / 5.0 (${item.percent}%)</span>
        </div>
        <div class="row-bar-bg">
          <div class="row-bar-fill" style="width: ${item.percent}%; background-color: ${getScoreColor(item.percent)}"></div>
        </div>
      </div>
    `).join("");
  }
}

function getScoreColor(percent) {
  if (percent >= 80) return "#059669";
  if (percent >= 60) return "#d97706";
  return "#dc2626";
}

/**
 * Render Pure SVG Radar Chart & Dimension Progress Bars
 */
function renderRadarAndDimensionBars(profile) {
  // 1. Radar Chart for Talent & Interest
  const radarSvgContainer = document.getElementById("rep-radar-chart-container");
  if (radarSvgContainer) {
    const radarData = [
      { label: "Verbal", val: profile.talent.Verbal || 3 },
      { label: "Numerical", val: profile.talent.Numerical || 3 },
      { label: "Analytical", val: profile.talent.Analytical || 3 },
      { label: "Spatial", val: profile.talent.Spatial || 3 },
      { label: "Creative", val: profile.talent.Creative || 3 },
      { label: "Social", val: profile.talent.Social || 3 },
      { label: "People", val: profile.interest.People || 3 },
      { label: "Ideas", val: profile.interest.Ideas || 3 },
      { label: "Data", val: profile.interest.Data || 3 },
      { label: "Things", val: profile.interest.Things || 3 },
      { label: "Nature/Life", val: profile.interest.NatureLife || 3 }
    ];

    radarSvgContainer.innerHTML = generateSvgRadar(radarData, 420, 420);

    const stage = document.getElementById("radar-chart-stage");
    const tooltip = document.getElementById("radar-chart-tooltip");
    const points = radarSvgContainer.querySelectorAll(".radar-profile-point");
    if (stage && tooltip) {
      const hideTooltip = () => {
        tooltip.classList.remove("is-visible");
        tooltip.setAttribute("aria-hidden", "true");
      };
      const showTooltip = point => {
        const pointRect = point.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const centerX = pointRect.left + pointRect.width / 2 - stageRect.left;
        const centerY = pointRect.top + pointRect.height / 2 - stageRect.top;
        tooltip.textContent = `${point.dataset.label}: ${point.dataset.score}/5`;
        tooltip.style.left = `${Math.max(70, Math.min(stageRect.width - 70, centerX))}px`;
        tooltip.style.top = `${Math.max(58, centerY)}px`;
        tooltip.classList.add("is-visible");
        tooltip.setAttribute("aria-hidden", "false");
      };

      points.forEach(point => {
        point.addEventListener("pointerenter", event => {
          if (event.pointerType !== "touch") showTooltip(point);
        });
        point.addEventListener("pointerleave", event => {
          if (event.pointerType !== "touch" && document.activeElement !== point) hideTooltip();
        });
        point.addEventListener("focus", () => showTooltip(point));
        point.addEventListener("blur", hideTooltip);
        point.addEventListener("click", () => showTooltip(point));
        point.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showTooltip(point);
          }
        });
      });
    }
  }

  // 2. Dimension Bars for all categories
  renderDimensionScoresList(profile);
}

/**
 * Generate Ultra-Crisp Responsive SVG Radar Chart
 */
function generateSvgRadar(data, width, height) {
  const isDarkTheme = document.documentElement.dataset.theme === "dark";
  const chartGridColor = isDarkTheme ? "#31483a" : "#e2e8f0";
  const chartAxisColor = isDarkTheme ? "#455f4f" : "#cbd5e1";
  const chartLabelColor = isDarkTheme ? "#c2d1c7" : "#0f172a";
  const chartTextMuted = isDarkTheme ? "#83988c" : "#94a3b8";
  const chartGlowInner = isDarkTheme ? "#1a2a20" : "#f8fafc";
  const chartGlowOuter = isDarkTheme ? "#14251c" : "#ffffff";
  const center = width / 2;
  const radius = center - 50;
  const numAxes = data.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Grid levels (1 to 5)
  let gridPolygons = "";
  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    let points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    gridPolygons += `<polygon points="${points.join(" ")}" fill="none" stroke="${chartGridColor}" stroke-width="1.2" stroke-dasharray="${level < 5 ? '3,3' : 'none'}"/>`;
    gridPolygons += `<text x="${center + 4}" y="${center - r + 12}" fill="${chartTextMuted}" font-size="10" font-family="sans-serif">${level}</text>`;
  }

  // Axes lines and labels
  let axesLines = "";
  let axesLabels = "";
  let studentPoints = [];

  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const xEnd = center + radius * Math.cos(angle);
    const yEnd = center + radius * Math.sin(angle);

    axesLines += `<line x1="${center}" y1="${center}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="${chartAxisColor}" stroke-width="1"/>`;

    // Student score point
    const score = Math.max(1, Math.min(5, data[i].val));
    const rScore = (radius / 5) * score;
    const xScore = center + rScore * Math.cos(angle);
    const yScore = center + rScore * Math.sin(angle);
    studentPoints.push(`${xScore.toFixed(1)},${yScore.toFixed(1)}`);

    // Label position
    const xLabel = center + (radius + 24) * Math.cos(angle);
    const yLabel = center + (radius + 24) * Math.sin(angle);
    const textAnchor = Math.abs(xLabel - center) < 10 ? "middle" : (xLabel > center ? "start" : "end");

    axesLabels += `
      <text x="${xLabel.toFixed(1)}" y="${(yLabel + 4).toFixed(1)}" text-anchor="${textAnchor}" fill="${chartLabelColor}" font-size="11" font-weight="600" font-family="sans-serif">
        ${data[i].label} (${score.toFixed(1)})
      </text>
    `;
  }

  const studentPath = studentPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point}`).join(" ") + " Z";
  const studentPolygon = `<path class="radar-profile-area" pathLength="100" d="${studentPath}" fill="rgba(11, 70, 50, 0.35)" fill-opacity="0" stroke="#0B4632" stroke-width="2.5" stroke-dasharray="100" stroke-dashoffset="100"/>`;

  // Draw dots on vertices
  let studentDots = "";
  studentPoints.forEach((pt, index) => {
    const [x, y] = pt.split(",");
    const label = data[index].label;
    const score = Math.max(1, Math.min(5, data[index].val)).toFixed(1);
    studentDots += `<circle class="radar-profile-point" style="--point-delay:${index * 45}ms" cx="${x}" cy="${y}" r="6" fill="#C5A869" stroke="#0B4632" stroke-width="2" data-label="${label}" data-score="${score}" tabindex="0" role="button" aria-label="${label}: ${score} dari 5"/>`;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" class="radar-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${chartGlowInner}" />
          <stop offset="100%" stop-color="${chartGlowOuter}" />
        </radialGradient>
      </defs>
      <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#radarGlow)"/>
      ${gridPolygons}
      ${axesLines}
      ${studentPolygon}
      ${studentDots}
      ${axesLabels}
    </svg>
  `;
}

/**
 * Render Dimension Scores List
 */
function renderDimensionScoresList(profile) {
  const container = document.getElementById("rep-dimension-breakdown-list");
  if (!container) return;

  const sectionsToShow = [
    { title: "Bakat Alami (Talent)", data: profile.talent },
    { title: "Minat Aktivitas (Interest)", data: profile.interest },
    { title: "Gaya Kerja (Personality)", data: profile.personality },
    { title: "Nilai Karier (Values)", data: profile.values },
    { title: "Kekuatan Akademik (Academic)", data: profile.academic },
    { title: "Orientasi Karier (Career)", data: profile.career }
  ];

  container.innerHTML = sectionsToShow.map(sec => `
    <div class="dim-group-box">
      <h5 class="dim-group-title">${sec.title}</h5>
      <div class="dim-items-grid">
        ${Object.entries(sec.data).map(([key, val], index) => {
          const percent = Math.round((val / 5.0) * 100);
          return `
            <div class="dim-score-item">
              <div class="dim-label-row">
                <span class="name">${key}</span>
                <span class="score">${val.toFixed(1)} / 5.0</span>
              </div>
              <div class="dim-progress-bg">
                <div class="dim-progress-fill" style="--score-width: ${percent}%; --score-delay: ${index * 35}ms;"></div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

/**
 * Switch Active View
 */
function showView(viewId) {
  const views = ["dashboard-view", "landing-view", "assessment-view", "report-view"];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.remove("active");
  });

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");
}

function showLoadingScreen(show) {
  const loader = document.getElementById("report-loading-overlay");
  if (loader) {
    if (show) loader.classList.add("active");
    else loader.classList.remove("active");
  }
}

/**
 * Copy Report Summary to Clipboard
 */
function copyReportSummary() {
  if (!AppState.reportData) return;
  const { student, personProfile, studyFitResults } = AppState.reportData;
  const top3 = studyFitResults.slice(0, 3).map((m, i) => `${i + 1}. ${m.name} (${m.fitScore}% - ${m.fitCategory})`).join("\n");

  const summary = `
========================================
HASIL GGC STUDY MATCH ASSESSMENT™
Go Great Career - Career Readiness Platform
========================================
Nama Siswa: ${student.name} (${student.grade})
Kode Verifikasi: ${student.codeId}
Tanggal: ${student.date}

POTENTIAL SIGNATURE:
${personProfile.signature.signatureCode}
"${personProfile.signature.title}"

TOP 3 REKOMENDASI JURUSAN:
${top3}

TINGKAT KESIAPAN MEMILIH:
${personProfile.readinessAnalysis.level} (${personProfile.readinessAnalysis.scorePercent}%)
Rekomendasi Aksi: ${personProfile.readinessAnalysis.actionAdvice}
========================================
Untuk konsultasi komprehensif bersama konselor GGC, kunjungi Go Great Career.
  `.trim();

  navigator.clipboard.writeText(summary).then(() => {
    showNotification("Ringkasan laporan berhasil disalin ke clipboard!");
  }).catch(() => {
    alert("Gagal menyalin ringkasan. Silakan gunakan tombol cetak PDF.");
  });
}

function showNotification(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `ggc-toast toast-${type}`;
  toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${escapeHtml(msg)}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}
