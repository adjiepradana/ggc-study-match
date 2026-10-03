/**
 * GGC STUDY FIT ASSESSMENT™ - APPLICATION CONTROLLER
 * Copyright © Go Great Career - Career Readiness Platform
 */

const STORAGE_KEY = "ggc_assessment_v1";

const AppState = {
  student: {
    name: "",
    grade: "Kelas 12 SMA",
    contact: "",
    initialGoal: ""
  },
  currentSectionIndex: 0,
  answers: {},
  reportData: null,
  activeFilter: "all"
};

// Initialize application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  loadSavedState();
  bindGlobalEvents();
  renderSection();
  updateProgressUI();

  // If there's an existing completed report, allow viewing it directly
  if (AppState.reportData && Object.keys(AppState.answers).length === 84) {
    const resumeBtn = document.getElementById("btn-resume-report");
    if (resumeBtn) resumeBtn.style.display = "inline-flex";
    const resumeBtnMobile = document.getElementById("btn-resume-report-mobile");
    if (resumeBtnMobile) resumeBtnMobile.style.display = "inline-flex";
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
      if (parsed.student) AppState.student = { ...AppState.student, ...parsed.student };
      if (parsed.currentSectionIndex !== undefined) AppState.currentSectionIndex = parsed.currentSectionIndex;
    }
  } catch (e) {
    console.warn("Storage load error:", e);
  }
}

/**
 * Save current state
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      student: AppState.student,
      answers: AppState.answers,
      currentSectionIndex: AppState.currentSectionIndex
    }));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

/**
 * Bind DOM events
 */
function bindGlobalEvents() {
  // Start Assessment Buttons
  const startBtns = document.querySelectorAll(".btn-start-assessment");
  startBtns.forEach(btn => {
    btn.addEventListener("click", () => openStudentModal());
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

  // Quick Demo Fill Profiles
  const demoSelector = document.getElementById("demo-profile-select");
  if (demoSelector) {
    demoSelector.addEventListener("change", (e) => {
      if (e.target.value) {
        applyDemoProfile(e.target.value);
        e.target.value = "";
      }
    });
  }

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
      const currentSection = ASSESSMENT_DATA.sections[AppState.currentSectionIndex];
      const unanswered = currentSection.items.find(it => !AppState.answers[it.id]);
      if (unanswered) {
        selectOption(unanswered.id, parseInt(e.key, 10));
      }
    }
  });
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
    document.getElementById("input-student-name").value = AppState.student.name || "";
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
 * Render Current Assessment Section (A - G)
 */
function renderSection() {
  const section = ASSESSMENT_DATA.sections[AppState.currentSectionIndex];
  if (!section) return;

  // Update Section Header Info
  const secBadge = document.getElementById("section-badge");
  const secTitle = document.getElementById("section-title");
  const secSubtitle = document.getElementById("section-subtitle");
  const secDesc = document.getElementById("section-description");

  if (secBadge) secBadge.textContent = `BAGIAN ${section.code} DARI 7`;
  if (secTitle) secTitle.textContent = section.title;
  if (secSubtitle) secSubtitle.textContent = section.subtitle;
  if (secDesc) secDesc.textContent = section.description;

  // Render Subdimension Tags Info
  const tagsContainer = document.getElementById("section-subdims-tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = section.subdimensions.map(sub => `
      <span class="subdim-pill" title="${sub.desc}">
        <strong>${sub.key}</strong>: ${sub.name}
      </span>
    `).join("");
  }

  // Render Items List
  const itemsContainer = document.getElementById("assessment-items-container");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";

  section.items.forEach((item, idx) => {
    const currentVal = AppState.answers[item.id] || null;
    const itemCard = document.createElement("div");
    itemCard.className = `assessment-item-card ${currentVal ? "answered" : ""}`;
    itemCard.id = `item-card-${item.id}`;

    itemCard.innerHTML = `
      <div class="item-card-header">
        <span class="item-id-badge">${item.id}</span>
        <span class="item-sub-badge">${item.sub}</span>
        <span class="item-number-seq">Pertanyaan ${idx + 1} dari ${section.items.length}</span>
      </div>
      <p class="item-statement">${escapeHtml(item.text)}</p>
      
      <div class="item-likert-scale" role="radiogroup" aria-label="${item.id}">
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
    if (AppState.currentSectionIndex === ASSESSMENT_DATA.sections.length - 1) {
      btnNext.innerHTML = `<span>Hitung & Lihat Hasil Asesmen</span> <i class="fas fa-chart-pie"></i>`;
      btnNext.classList.add("btn-finish");
    } else {
      btnNext.innerHTML = `<span>Lanjut ke Bagian ${ASSESSMENT_DATA.sections[AppState.currentSectionIndex + 1].code}</span> <i class="fas fa-arrow-right"></i>`;
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
  updateStepTabsState();
}

/**
 * Render Step Nav Indicator Tabs
 */
function renderStepTabs() {
  const navContainer = document.getElementById("assessment-step-tabs");
  if (!navContainer) return;

  navContainer.innerHTML = ASSESSMENT_DATA.sections.map((sec, idx) => {
    const answeredCount = sec.items.filter(it => AppState.answers[it.id] !== undefined).length;
    const isCompleted = answeredCount === sec.items.length;
    const isCurrent = idx === AppState.currentSectionIndex;

    return `
      <button type="button" 
              class="step-tab-btn ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : ""}"
              onclick="jumpToSection(${idx})">
        <span class="step-num">${sec.code}</span>
        <span class="step-label">${sec.id.toUpperCase()}</span>
        <span class="step-badge">${answeredCount}/${sec.items.length}</span>
      </button>
    `;
  }).join("");
}

function updateStepTabsState() {
  renderStepTabs();
}

function jumpToSection(index) {
  if (index >= 0 && index < ASSESSMENT_DATA.sections.length) {
    AppState.currentSectionIndex = index;
    saveState();
    renderSection();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Handle Next Section Button
 */
function handleNextSection() {
  const currentSection = ASSESSMENT_DATA.sections[AppState.currentSectionIndex];
  const unanswered = currentSection.items.filter(it => !AppState.answers[it.id]);

  if (unanswered.length > 0) {
    // Scroll to the first unanswered item
    const firstMissing = unanswered[0];
    const missingCard = document.getElementById(`item-card-${firstMissing.id}`);
    if (missingCard) {
      missingCard.scrollIntoView({ behavior: "smooth", block: "center" });
      missingCard.classList.add("highlight-pulse");
      setTimeout(() => missingCard.classList.remove("highlight-pulse"), 2500);
    }
    showNotification(`Masih ada ${unanswered.length} pernyataan di bagian ini yang belum dijawab.`, "warning");
    return;
  }

  // If on last section, finish assessment
  if (AppState.currentSectionIndex === ASSESSMENT_DATA.sections.length - 1) {
    // Check if ALL 84 items are answered
    const totalAnswered = Object.keys(AppState.answers).length;
    if (totalAnswered < 84) {
      showNotification(`Harap lengkapi semua 84 pernyataan (saat ini ${totalAnswered}/84).`, "warning");
      return;
    }
    processAndShowReport();
  } else {
    AppState.currentSectionIndex++;
    saveState();
    renderSection();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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

    renderReportView(AppState.reportData);
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
  document.getElementById("rep-student-name").textContent = student.name || "Siswa Teladan";
  document.getElementById("rep-student-grade").textContent = student.grade || "Kelas 12 SMA";
  document.getElementById("rep-report-date").textContent = student.date || new Date().toLocaleDateString("id-ID");
  document.getElementById("rep-cert-code").textContent = student.codeId || "GGC-STUDYFIT-2026";

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

  // All 18 Clusters Filterable Grid
  renderAllClustersGrid(studyFitResults);

  // Readiness Diagnostic
  renderReadinessDiagnostic(readiness);

  // Radar & Dimension Charts
  renderRadarAndDimensionBars(personProfile);
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
            <div class="fit-score-val">${major.fitScore}%</div>
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
      <div class="cluster-badge-tag">${item.badgeLabel}</div>
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
  }

  // 2. Dimension Bars for all categories
  renderDimensionScoresList(profile);
}

/**
 * Generate Ultra-Crisp Responsive SVG Radar Chart
 */
function generateSvgRadar(data, width, height) {
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
    gridPolygons += `<polygon points="${points.join(" ")}" fill="none" stroke="#e2e8f0" stroke-width="1.2" stroke-dasharray="${level < 5 ? '3,3' : 'none'}"/>`;
    gridPolygons += `<text x="${center + 4}" y="${center - r + 12}" fill="#94a3b8" font-size="10" font-family="sans-serif">${level}</text>`;
  }

  // Axes lines and labels
  let axesLines = "";
  let axesLabels = "";
  let studentPoints = [];

  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const xEnd = center + radius * Math.cos(angle);
    const yEnd = center + radius * Math.sin(angle);

    axesLines += `<line x1="${center}" y1="${center}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="#cbd5e1" stroke-width="1"/>`;

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
      <text x="${xLabel.toFixed(1)}" y="${(yLabel + 4).toFixed(1)}" text-anchor="${textAnchor}" fill="#0f172a" font-size="11" font-weight="600" font-family="sans-serif">
        ${data[i].label} (${score.toFixed(1)})
      </text>
    `;
  }

  const studentPolygon = `<polygon points="${studentPoints.join(" ")}" fill="rgba(11, 70, 50, 0.35)" stroke="#0B4632" stroke-width="2.5"/>`;

  // Draw dots on vertices
  let studentDots = "";
  studentPoints.forEach(pt => {
    const [x, y] = pt.split(",");
    studentDots += `<circle cx="${x}" cy="${y}" r="4" fill="#C5A869" stroke="#0B4632" stroke-width="2"/>`;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" class="radar-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#ffffff" />
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
        ${Object.entries(sec.data).map(([key, val]) => {
          const percent = Math.round((val / 5.0) * 100);
          return `
            <div class="dim-score-item">
              <div class="dim-label-row">
                <span class="name">${key}</span>
                <span class="score">${val.toFixed(1)} / 5.0</span>
              </div>
              <div class="dim-progress-bg">
                <div class="dim-progress-fill" style="width: ${percent}%;"></div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

/**
 * Apply Demo Profiles for Quick Testing
 */
function applyDemoProfile(profileType) {
  const answers = {};

  if (profileType === "tech_ai") {
    // IT & Data Science profile
    ASSESSMENT_DATA.sections.forEach(sec => {
      sec.items.forEach(it => {
        if (["Numerical", "Analytical", "Data", "Things", "Math", "Technology", "Information"].includes(it.sub)) {
          answers[it.id] = Math.random() > 0.3 ? 5 : 4;
        } else if (["Verbal", "Social", "People", "Helping", "ArtDesign"].includes(it.sub)) {
          answers[it.id] = Math.random() > 0.5 ? 3 : 2;
        } else {
          answers[it.id] = 4;
        }
      });
    });
    AppState.student.name = "Ahmad Fajar Pratama";
    AppState.student.grade = "Kelas 12 IPA";
    AppState.student.initialGoal = "Teknik Informatika / Data Science";
  } else if (profileType === "psychology") {
    // Psychology & People profile
    ASSESSMENT_DATA.sections.forEach(sec => {
      sec.items.forEach(it => {
        if (["Verbal", "Analytical", "Social", "People", "Ideas", "Meaning", "Helping"].includes(it.sub)) {
          answers[it.id] = Math.random() > 0.2 ? 5 : 4;
        } else if (["Numerical", "Things", "Math"].includes(it.sub)) {
          answers[it.id] = Math.random() > 0.4 ? 3 : 2;
        } else {
          answers[it.id] = 4;
        }
      });
    });
    AppState.student.name = "Nadia Anindita Putri";
    AppState.student.grade = "Kelas 12 IPS";
    AppState.student.initialGoal = "Psikologi / Human Resources";
  } else if (profileType === "medicine") {
    // Medicine & Health profile
    ASSESSMENT_DATA.sections.forEach(sec => {
      sec.items.forEach(it => {
        if (["NatureLife", "Science", "Analytical", "Meaning", "Helping", "Structure"].includes(it.sub)) {
          answers[it.id] = Math.random() > 0.2 ? 5 : 4;
        } else if (["ArtDesign", "Spatial"].includes(it.sub)) {
          answers[it.id] = 3;
        } else {
          answers[it.id] = 4;
        }
      });
    });
    AppState.student.name = "dr. Aris Munandar (Simulasi Siswa)";
    AppState.student.grade = "Kelas 12 IPA Unggulan";
    AppState.student.initialGoal = "Kedokteran Umum";
  } else if (profileType === "creative_arts") {
    // Design & Creative Arts profile
    ASSESSMENT_DATA.sections.forEach(sec => {
      sec.items.forEach(it => {
        if (["Creative", "Spatial", "ArtDesign", "Exploration", "Freedom", "Creating"].includes(it.sub)) {
          answers[it.id] = 5;
        } else if (["Structure", "Numerical", "Math", "Security"].includes(it.sub)) {
          answers[it.id] = 2;
        } else {
          answers[it.id] = 3;
        }
      });
    });
    AppState.student.name = "Kayla Aurelia";
    AppState.student.grade = "Kelas 12 SMA Seni / Umum";
    AppState.student.initialGoal = "Desain Komunikasi Visual";
  }

  AppState.answers = answers;
  saveState();
  updateProgressUI();
  renderSection();
  showNotification(`Profil demo "${profileType}" berhasil diisikan (84/84 item)!`);
}

/**
 * Switch Active View
 */
function showView(viewId) {
  const views = ["landing-view", "assessment-view", "report-view"];
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
HASIL GGC STUDY FIT ASSESSMENT™
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
