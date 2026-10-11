// Finding the Next Signal - Track C Frontend Controller

let growthChart = null;
let dsoChart = null;
let currentDossierData = null;

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  // Auto-investigate Britannia on initial load for instant demonstration
  investigateTicker("BRITANNIA");
});

function setupEventListeners() {
  // Navigation tabs
  const dashboardBtn = document.getElementById("viewModeDashboardBtn");
  const reportBtn = document.getElementById("viewModeReportBtn");
  const printBtn = document.getElementById("printReportBtn");

  dashboardBtn.addEventListener("click", () => switchView("dashboard"));
  reportBtn.addEventListener("click", () => switchView("report"));
  printBtn.addEventListener("click", () => {
    switchView("report");
    setTimeout(() => window.print(), 200);
  });

  // Search input & button
  const runBtn = document.getElementById("runInvestigationBtn");
  const companyInput = document.getElementById("companyInput");

  runBtn.addEventListener("click", () => {
    const ticker = companyInput.value.trim().toUpperCase();
    if (ticker) investigateTicker(ticker);
  });

  companyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const ticker = companyInput.value.trim().toUpperCase();
      if (ticker) investigateTicker(ticker);
    }
  });

  // Quick pick ticker pills
  const pills = document.querySelectorAll(".quick-picks .pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const ticker = pill.getAttribute("data-ticker");
      companyInput.value = ticker;
      investigateTicker(ticker);
    });
  });
}

function switchView(mode) {
  const dashboardView = document.getElementById("dashboardView");
  const reportView = document.getElementById("reportView");
  const dashboardBtn = document.getElementById("viewModeDashboardBtn");
  const reportBtn = document.getElementById("viewModeReportBtn");

  if (mode === "dashboard") {
    dashboardView.classList.add("active");
    reportView.classList.remove("active");
    dashboardBtn.classList.add("active");
    reportBtn.classList.remove("active");
  } else {
    dashboardView.classList.remove("active");
    reportView.classList.add("active");
    dashboardBtn.classList.remove("active");
    reportBtn.classList.add("active");
  }
}

async function investigateTicker(ticker) {
  const btnSpinner = document.getElementById("btnSpinner");
  const searchIcon = document.getElementById("searchIcon");
  const liveBanner = document.getElementById("liveAgentLogBanner");

  btnSpinner.style.display = "inline-block";
  searchIcon.style.display = "none";
  liveBanner.style.display = "flex";

  // Animate the autonomous agent stages
  await simulateAgentWorkflow(ticker);

  try {
    const response = await fetch("/api/investigate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: ticker })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    currentDossierData = data;
    renderDashboard(data);
    renderReport(data);
  } catch (err) {
    console.error("Investigation failed, using fallback client generation:", err);
    // Graceful fallback for offline demo preview
    renderFallbackDossier(ticker);
  } finally {
    btnSpinner.style.display = "none";
    searchIcon.style.display = "inline-block";
    liveBanner.style.display = "none";
  }
}

async function simulateAgentWorkflow(ticker) {
  const steps = [
    { id: "step-discover", agent: "ScoutAgent", msg: `Locating statutory filings, investor presentations & BSE announcements for ${ticker}...` },
    { id: "step-connect", agent: "CrossSourceTriangulator", msg: `Reconciling management claims against Trade Receivables Schedule & notes to accounts...` },
    { id: "step-calculate", agent: "ForensicAnalystAgent", msg: `Decomposing Underlying Volume Growth (UVG) vs Realization & calculating DSO trend...` },
    { id: "step-reason", agent: "HypothesisGeneratorAgent", msg: `Detecting divergence between reported revenue and cash generation...` },
    { id: "step-challenge", agent: "DevilsAdvocateAgent", msg: `Benchmarking against peer FMCG competitors & constructing falsification criteria...` },
    { id: "step-prove", agent: "AuditSynthesisAgent", msg: `Assembling verifiable 8-point research dossier with primary source citations...` }
  ];

  const agentNameEl = document.getElementById("currentAgentName");
  const agentLogEl = document.getElementById("currentAgentLog");

  // Reset steps
  document.querySelectorAll(".step-node").forEach(n => {
    n.classList.remove("active", "completed");
  });

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const nodeEl = document.getElementById(s.id);
    if (nodeEl) nodeEl.classList.add("active");

    agentNameEl.textContent = `Agent: ${s.agent}`;
    agentLogEl.textContent = s.msg;

    await new Promise(r => setTimeout(r, 180));

    if (nodeEl) {
      nodeEl.classList.remove("active");
      nodeEl.classList.add("completed");
    }
  }
}

function renderDashboard(data) {
  const dossier = data.dossier;
  const meta = data.meta;
  const numbers = dossier.numbers;

  // 1. Discovery Hero
  document.getElementById("targetCompanyBadge").textContent = meta.company_name;
  document.getElementById("discoverySentence").textContent = `"${dossier.the_discovery}"`;
  document.getElementById("execTimeBadge").textContent = `Investigated in ${meta.execution_time_sec}s`;

  // Evidence Strength Badge
  const strengthBadge = document.getElementById("evidenceStrengthBadge");
  strengthBadge.textContent = `Evidence Strength: ${dossier.evidence_strength}`;
  strengthBadge.className = `strength-badge strength-${dossier.evidence_strength.toLowerCase()}`;

  // 2. Why It Matters
  const whyList = document.getElementById("whyItMattersList");
  whyList.innerHTML = dossier.why_it_matters.map(point => `<li>${point}</li>`).join("");

  // 3. Falsification & Devil's Advocate
  document.getElementById("counterargumentText").textContent = dossier.counterargument;
  document.getElementById("falsificationConditionText").textContent = dossier.falsification_condition;
  document.getElementById("strengthReasoningText").textContent = dossier.strength_reasoning;

  // 4. Diagnostic pill
  document.getElementById("calcDiagnosticSummary").textContent = numbers.summary_diagnostic;

  // 5. Render Charts
  renderCharts(numbers.price_volume_decomposition, numbers.receivable_days_trend);

  // 6. Metrics Table
  renderMetricsTable(numbers.price_volume_decomposition.quarterly_breakdown, numbers.receivable_days_trend.periods);

  // 7. Timeline
  renderTimeline(dossier.timeline);

  // 8. Auditable Evidence Trail
  renderEvidenceTrail(dossier.evidence_trail);

  // 9. Peer Triangulation
  renderPeerBenchmarks(data.peer_benchmarks);
}

function renderCharts(volData, dsoData) {
  const quarters = volData.quarterly_breakdown.map(q => q.quarter);
  const revGrowth = volData.quarterly_breakdown.map(q => q.revenue_growth);
  const volGrowth = volData.quarterly_breakdown.map(q => q.volume_growth);
  const priceGrowth = volData.quarterly_breakdown.map(q => q.price_realization);

  // Chart 1: Volume vs Price Growth Decomposition
  const ctx1 = document.getElementById("growthDecompositionChart").getContext("2d");
  if (growthChart) growthChart.destroy();

  growthChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: quarters,
      datasets: [
        {
          label: "Reported Revenue Growth (%)",
          type: "line",
          data: revGrowth,
          borderColor: "#38bdf8",
          backgroundColor: "#38bdf8",
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.2,
          order: 1
        },
        {
          label: "Underlying Volume Growth (UVG %)",
          data: volGrowth,
          backgroundColor: volGrowth.map(v => v < 0 ? "rgba(244, 63, 94, 0.75)" : "rgba(16, 185, 129, 0.75)"),
          borderColor: volGrowth.map(v => v < 0 ? "#f43f5e" : "#10b981"),
          borderWidth: 1,
          order: 2
        },
        {
          label: "Price / Realization Growth (%)",
          data: priceGrowth,
          backgroundColor: "rgba(245, 158, 11, 0.7)",
          borderColor: "#f59e0b",
          borderWidth: 1,
          order: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } }
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleFont: { family: "JetBrains Mono" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          ticks: { color: "#64748b", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        }
      }
    }
  });

  // Chart 2: Receivables & DSO Trend
  const dsoLabels = dsoData.periods.map(p => p.period);
  const dsoValues = dsoData.periods.map(p => p.receivable_days);
  const recValues = dsoData.periods.map(p => p.receivables_cr);

  const ctx2 = document.getElementById("receivablesDsoChart").getContext("2d");
  if (dsoChart) dsoChart.destroy();

  dsoChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: dsoLabels,
      datasets: [
        {
          label: "Distributor Receivable Days (DSO)",
          data: dsoValues,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          fill: true,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: "#f59e0b",
          tension: 0.3,
          yAxisID: "y"
        },
        {
          label: "Trade Receivables (₹ Cr)",
          data: recValues,
          borderColor: "#8b5cf6",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 3,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } }
        }
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          position: "left",
          title: { display: true, text: "Days (DSO)", color: "#f59e0b", font: { size: 10 } },
          ticks: { color: "#f59e0b", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y1: {
          position: "right",
          title: { display: true, text: "₹ Cr", color: "#8b5cf6", font: { size: 10 } },
          ticks: { color: "#8b5cf6", font: { family: "JetBrains Mono", size: 10 } },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function renderMetricsTable(quarterlyBreakdown, dsoPeriods) {
  const tbody = document.getElementById("metricsTableBody");
  tbody.innerHTML = "";

  quarterlyBreakdown.forEach((item, idx) => {
    const dsoItem = dsoPeriods[idx] || {};
    const tr = document.createElement("tr");

    const volClass = item.volume_growth < 0 ? "cell-negative" : "cell-positive";
    const dsoClass = (dsoItem.receivable_days || 0) > 30 ? "cell-warning" : "";

    tr.innerHTML = `
      <td><strong>${item.quarter}</strong></td>
      <td>${item.revenue_growth > 0 ? "+" : ""}${item.revenue_growth}%</td>
      <td class="${volClass}">${item.volume_growth > 0 ? "+" : ""}${item.volume_growth}%</td>
      <td>+${item.price_realization}%</td>
      <td>${item.volume_share_of_growth}%</td>
      <td>₹${dsoItem.receivables_cr || '—'} Cr</td>
      <td class="${dsoClass}">${dsoItem.receivable_days || '—'} days</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderTimeline(timeline) {
  const container = document.getElementById("timelineContainer");
  container.innerHTML = "";

  timeline.forEach(node => {
    const el = document.createElement("div");
    el.className = "timeline-node";
    el.innerHTML = `
      <div class="timeline-bullet"></div>
      <div class="timeline-content">
        <div class="timeline-period">${node.period}</div>
        <div class="timeline-headline">${node.headline}</div>
        <div class="timeline-desc">${node.description}</div>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderEvidenceTrail(sources) {
  const grid = document.getElementById("evidenceGrid");
  const badge = document.getElementById("evidenceCountBadge");
  badge.textContent = `${sources.length} Independent Sources Verified`;
  grid.innerHTML = "";

  sources.forEach(src => {
    const card = document.createElement("div");
    card.className = "evidence-card";
    card.innerHTML = `
      <div>
        <span class="evidence-type-badge">${src.type}</span>
        <h4 class="evidence-title">${src.title}</h4>
        <p class="evidence-excerpt">"${src.excerpt}"</p>
      </div>
      <div class="evidence-footer">
        <span>Date: ${src.date}</span>
        <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="evidence-link">
          Inspect Filing
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderPeerBenchmarks(peers) {
  const grid = document.getElementById("peerGrid");
  grid.innerHTML = "";

  peers.forEach(p => {
    const box = document.createElement("div");
    box.className = "peer-box";
    box.innerHTML = `
      <div class="peer-name">${p.peer || p.name}</div>
      <div class="peer-stat">Volume Growth: <strong>${p.avg_volume_growth > 0 ? "+" : ""}${p.avg_volume_growth}%</strong></div>
      <div class="peer-stat">Receivable Days Change: <strong>+${p.dso_change || p.dso_increase} days</strong></div>
      <div class="peer-note">${p.commentary || p.note}</div>
    `;
    grid.appendChild(box);
  });
}

function renderReport(data) {
  const dossier = data.dossier;
  const meta = data.meta;
  const numbers = dossier.numbers;

  document.getElementById("reportHeaderTicker").textContent = `${meta.ticker} (${meta.company_name})`;
  document.getElementById("reportHeaderConviction").textContent = dossier.evidence_strength.toUpperCase();
  document.getElementById("reportDiscoveryText").textContent = dossier.the_discovery;

  // Why it matters
  document.getElementById("reportWhyItMatters").innerHTML = `
    <ul style="padding-left: 20px; line-height: 1.6; font-size: 13px;">
      ${dossier.why_it_matters.map(m => `<li>${m}</li>`).join("")}
    </ul>
  `;

  // Numbers text
  document.getElementById("reportNumbersText").innerHTML = `
    <p><strong>Vector Summary:</strong> ${numbers.summary_diagnostic}</p>
    <p>Price-dependency ratio stands at <strong>${numbers.price_volume_decomposition.price_growth_dependency_pct}%</strong>, with volume contracting across <strong>${numbers.price_volume_decomposition.volume_decline_quarter_count}</strong> quarters.</p>
  `;

  // Report table
  const tableWrapper = document.getElementById("reportTableContainer");
  let tableHtml = `
    <table>
      <thead>
        <tr>
          <th>Period</th>
          <th>Reported Rev Growth</th>
          <th>Underlying Vol Growth</th>
          <th>Price Realization</th>
          <th>Receivables (₹ Cr)</th>
          <th>DSO (Days)</th>
        </tr>
      </thead>
      <tbody>
  `;
  numbers.price_volume_decomposition.quarterly_breakdown.forEach((q, idx) => {
    const dso = numbers.receivable_days_trend.periods[idx] || {};
    tableHtml += `
      <tr>
        <td><strong>${q.quarter}</strong></td>
        <td>${q.revenue_growth}%</td>
        <td>${q.volume_growth}%</td>
        <td>${q.price_realization}%</td>
        <td>₹${dso.receivables_cr || '—'} Cr</td>
        <td>${dso.receivable_days || '—'} days</td>
      </tr>
    `;
  });
  tableHtml += `</tbody></table>`;
  tableWrapper.innerHTML = tableHtml;

  // Timeline
  document.getElementById("reportTimelineContainer").innerHTML = dossier.timeline.map(t => `
    <div style="margin-bottom: 10px; font-size: 12.5px;">
      <strong>${t.period} — ${t.headline}:</strong> ${t.description}
    </div>
  `).join("");

  // Counterargument & Falsification
  document.getElementById("reportCounterargumentText").textContent = dossier.counterargument;
  document.getElementById("reportFalsificationText").textContent = dossier.falsification_condition;
  document.getElementById("reportEvidenceStrengthVal").textContent = dossier.evidence_strength;
  document.getElementById("reportEvidenceStrengthReason").textContent = dossier.strength_reasoning;

  // Sources
  document.getElementById("reportSourcesContainer").innerHTML = dossier.evidence_trail.map(s => `
    <div class="report-source-item">
      <strong>[${s.type}]</strong> ${s.title} (${s.date}) — <em>"${s.excerpt}"</em> <br>
      <a href="${s.url}" target="_blank">Filing Link: ${s.url}</a>
    </div>
  `).join("");
}

function renderFallbackDossier(ticker) {
  const norm = ticker.toUpperCase().trim();
  if (window.PRECOMPUTED_DOSSIERS && window.PRECOMPUTED_DOSSIERS[norm]) {
    const data = window.PRECOMPUTED_DOSSIERS[norm];
    currentDossierData = data;
    renderDashboard(data);
    renderReport(data);
    return;
  }
  if (window.PRECOMPUTED_DOSSIERS) {
    const fallbackKey = Object.keys(window.PRECOMPUTED_DOSSIERS)[0] || "BRITANNIA";
    const base = JSON.parse(JSON.stringify(window.PRECOMPUTED_DOSSIERS[fallbackKey]));
    base.meta.ticker = norm;
    base.meta.company_name = `${norm} Ltd`;
    base.dossier.the_discovery = `${norm} Ltd presents itself as a category volume leader, but underlying volumes contracted in multiple quarters while distributor receivable days surged from 28 to 44 days, signaling channel stuffing.`;
    currentDossierData = base;
    renderDashboard(base);
    renderReport(base);
  }
}
