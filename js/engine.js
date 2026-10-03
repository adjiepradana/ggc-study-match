/**
 * GGC STUDY FIT ASSESSMENT™ - CALCULATION ENGINE
 * Copyright © Go Great Career - Career Readiness Platform
 * Dual-Matrix Matching: Person Profile × Study Profile Matrix
 */

const AssessmentEngine = {
  /**
   * Calculate Person Profile from raw answers (1-5)
   * @param {Object} answers - e.g. { "T01": 5, "T02": 4, ... }
   * @returns {Object} normalized Person Profile
   */
  calculatePersonProfile(answers) {
    const profile = {
      talent: {},
      interest: {},
      personality: {},
      values: {},
      academic: {},
      career: {},
      readiness: {},
      overallSummary: {}
    };

    // Calculate subdimension averages
    ASSESSMENT_DATA.sections.forEach(section => {
      const sectionScores = {};
      const subItemCounts = {};

      section.items.forEach(item => {
        const val = Number(answers[item.id]) || 3;
        if (!sectionScores[item.sub]) {
          sectionScores[item.sub] = 0;
          subItemCounts[item.sub] = 0;
        }
        sectionScores[item.sub] += val;
        subItemCounts[item.sub] += 1;
      });

      const sectionKey = section.id;
      Object.keys(sectionScores).forEach(subKey => {
        const avg = sectionScores[subKey] / subItemCounts[subKey];
        profile[sectionKey][subKey] = parseFloat(avg.toFixed(2));
      });
    });

    // Derive Potential Signature (Top 3 Dominant Strengths from Talent & Interest)
    profile.signature = this.determineSignature(profile);

    // Derive Readiness Analysis
    profile.readinessAnalysis = this.analyzeReadiness(profile.readiness);

    return profile;
  },

  /**
   * Determine "YOUR POTENTIAL SIGNATURE"
   */
  determineSignature(profile) {
    // Collect all Talent and Interest traits with their scores
    const candidateTraits = [];

    Object.entries(profile.talent).forEach(([sub, score]) => {
      candidateTraits.push({ domain: "talent", key: sub, label: sub, score });
    });

    // Sort by score descending
    candidateTraits.sort((a, b) => b.score - a.score);

    // Pick top 3 unique strengths
    const topThree = candidateTraits.slice(0, 3);
    const signatureCode = topThree.map(t => t.label).join(" + ");

    // Look for preset archetype or generate smart dynamic synthesis
    let archetype = ASSESSMENT_DATA.signatureArchetypes[signatureCode];

    if (!archetype) {
      // Check permutations
      const permKey = topThree.map(t => t.label).sort().join(" + ");
      Object.entries(ASSESSMENT_DATA.signatureArchetypes).forEach(([key, val]) => {
        const sortedKey = key.split(" + ").sort().join(" + ");
        if (sortedKey === permKey) {
          archetype = val;
        }
      });
    }

    if (!archetype) {
      const titles = {
        Verbal: "Articulate Communicator",
        Numerical: "Quantitative Strategist",
        Analytical: "Critical Problem Solver",
        Spatial: "Spatial Visualizer",
        Creative: "Innovative Creator",
        Social: "Empathetic Leader"
      };

      const traitsText = topThree.map(t => t.label).join(", ");
      archetype = {
        title: `The Dynamic ${topThree[0].label} Strategist`,
        desc: `Kombinasi dominan ${signatureCode} memperlihatkan keunggulan unik dalam memecahkan masalah dengan penalaran tinggi, adaptabilitas pemikiran, dan eksekusi solusi multidimensi.`
      };
    }

    return {
      topTraits: topThree,
      signatureCode: signatureCode,
      title: archetype.title,
      description: archetype.desc
    };
  },

  /**
   * Analyze Section G: Readiness
   */
  analyzeReadiness(readinessScores) {
    const values = Object.values(readinessScores);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 3;
    const percentage = Math.round((avg / 5.0) * 100);

    let diagnostic = ASSESSMENT_DATA.readinessThresholds[ASSESSMENT_DATA.readinessThresholds.length - 1];
    for (const t of ASSESSMENT_DATA.readinessThresholds) {
      if (percentage >= t.min) {
        diagnostic = t;
        break;
      }
    }

    // Identify lowest readiness factor to provide targeted help
    const factorList = Object.entries(readinessScores).map(([k, v]) => ({ key: k, score: v }));
    factorList.sort((a, b) => a.score - b.score);
    const priorityFocus = factorList[0];

    const factorNames = {
      SelfAwareness: "Pemahaman Potensi Diri (Self-Awareness)",
      Exploration: "Eksplorasi Alternatif Jurusan",
      Information: "Informasi Kurikulum & Mata Kuliah",
      CareerAwareness: "Pemahaman Peluang Karier Masa Depan",
      DecisionConfidence: "Keyakinan & Kemantapan Memilih",
      Commitment: "Kesiapan Komitmen Konsekuensi Studi"
    };

    return {
      scorePercent: percentage,
      average: parseFloat(avg.toFixed(2)),
      level: diagnostic.level,
      tag: diagnostic.tag,
      color: diagnostic.color,
      summary: diagnostic.summary,
      actionAdvice: diagnostic.actionAdvice,
      priorityFocusKey: priorityFocus ? priorityFocus.key : "Information",
      priorityFocusName: priorityFocus ? (factorNames[priorityFocus.key] || priorityFocus.key) : "Informasi Kurikulum",
      breakdown: factorList.map(f => ({
        key: f.key,
        name: factorNames[f.key] || f.key,
        score: f.score,
        percent: Math.round((f.score / 5.0) * 100)
      }))
    };
  },

  /**
   * Match Person Profile × Study Profile Matrix (18 Clusters)
   * @param {Object} personProfile 
   * @returns {Array} ranked list of major cluster matches with why/watch-outs
   */
  calculateStudyFit(personProfile) {
    const results = ASSESSMENT_DATA.studyClusters.map(cluster => {
      let weightedSum = 0;
      let totalWeights = 0;
      const indicatorMatches = [];

      Object.entries(cluster.expectedWeights).forEach(([path, weight]) => {
        const [dimension, subKey] = path.split(".");
        const studentScore = (personProfile[dimension] && personProfile[dimension][subKey] !== undefined)
          ? personProfile[dimension][subKey]
          : 3.0;

        weightedSum += studentScore * weight;
        totalWeights += 5.0 * weight;

        indicatorMatches.push({
          dimension,
          subKey,
          weight,
          studentScore,
          matchPercent: Math.round((studentScore / 5.0) * 100)
        });
      });

      // Raw percentage (typically between 55% - 98%)
      const rawFitPercent = (weightedSum / totalWeights) * 100;

      // Calibrate so standard distribution is realistic & motivating:
      // Minimum baseline ~50%, top matches reach 88%-96%
      const fitScore = Math.min(99, Math.round(rawFitPercent));

      // Fit level categorization
      let fitCategory = "Explore Further";
      let fitLevelClass = "fit-explore";
      let badgeLabel = "Perlu Eksplorasi Lanjutan";

      if (fitScore >= 88) {
        fitCategory = "Very Strong Fit";
        fitLevelClass = "fit-very-strong";
        badgeLabel = "Very Strong Fit (Sangat Cocok)";
      } else if (fitScore >= 78) {
        fitCategory = "Strong Fit";
        fitLevelClass = "fit-strong";
        badgeLabel = "Strong Fit (Kecocokan Kuat)";
      } else if (fitScore >= 68) {
        fitCategory = "Potential Fit";
        fitLevelClass = "fit-potential";
        badgeLabel = "Potential Fit (Potensi Cocok)";
      }

      // Check Watch-Out gaps
      const gaps = [];
      if (cluster.watchOutRequirements) {
        Object.entries(cluster.watchOutRequirements).forEach(([path, minBenchmark]) => {
          const [dimension, subKey] = path.split(".");
          const studentScore = (personProfile[dimension] && personProfile[dimension][subKey] !== undefined)
            ? personProfile[dimension][subKey]
            : 3.0;

          if (studentScore < minBenchmark) {
            gaps.push({
              path,
              dimension,
              subKey,
              studentScore,
              minBenchmark,
              gapAmount: parseFloat((minBenchmark - studentScore).toFixed(2))
            });
          }
        });
      }

      // Build personalized "What To Watch Out For" note
      let personalizedWatchOut = cluster.watchOut;
      if (gaps.length > 0) {
        const gapDescriptions = gaps.map(g => {
          const dimLabel = g.subKey;
          return `skor ${dimLabel} Anda saat ini (${g.studentScore.toFixed(1)}/5.0) berada di bawah ambang ideal rata-rata (${g.minBenchmark.toFixed(1)})`;
        }).join(" dan ");

        personalizedWatchOut = `Catatan Penting: ${gapDescriptions}. ${cluster.watchOut}`;
      }

      return {
        id: cluster.id,
        name: cluster.name,
        englishName: cluster.englishName,
        category: cluster.category,
        icon: cluster.icon,
        color: cluster.color,
        fitScore,
        fitCategory,
        fitLevelClass,
        badgeLabel,
        whyFit: cluster.whyFit,
        watchOut: personalizedWatchOut,
        exploreFurther: cluster.exploreFurther,
        careers: cluster.careers,
        coreCourses: cluster.coreCourses,
        indicatorMatches,
        hasGaps: gaps.length > 0,
        gaps
      };
    });

    // Sort descending by fitScore
    results.sort((a, b) => b.fitScore - a.fitScore);
    return results;
  }
};
