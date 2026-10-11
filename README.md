# Finding the Next Signal — Autonomous Financial Research Agent (Track C)
### ATMOS 2026 · BITS Pilani, Hyderabad Campus · Autonomous Financial Research Hackathon

> **"The evidence is public. Finding the story is the challenge."**

---

## 📌 Executive Summary
**Signal-C** is an autonomous financial research investigator built for **Track C (Consumer, FMCG & Retail)**. Given any NIFTY 50 FMCG company (e.g., `BRITANNIA`, `HINDUNILVR`, `TATACONSUM`, `NESTLEIND`, `ITC`) or listed sector peer, the system independently investigates public statutory filings, financial notes, earnings call transcripts, and competitor results to uncover non-obvious, evidence-backed financial truths that standard equity summarizers miss.

Unlike typical AI chatbots or news scrapers, Signal-C:
* **Does not summarize headlines** $\rightarrow$ It tests hypotheses against audited footnotes and segment reports.
* **Separates Price Inflation from Volume Consumption** $\rightarrow$ Decomposes reported top-line revenue into Underlying Volume Growth (UVG) vs Price/Mix Realization.
* **Tracks Working-Capital Friction** $\rightarrow$ Audits Days Sales Outstanding (DSO) and distributor credit extensions to detect channel stuffing.
* **Performs Active Self-Falsification** $\rightarrow$ Runs a Devil's Advocate engine that checks competitor co-movements and defines strict falsification conditions.
* **Provides a 100% Auditable Evidence Trail** $\rightarrow$ Every assertion maps directly to primary BSE/NSE filings and annual report notes.

---

## 🛠️ Multi-Agent Architecture

```
[Target FMCG Company] (e.g. BRITANNIA, HINDUNILVR, TATACONSUM, ITC, NESTLEIND, GODREJCP)
       │
       ├── 1. ScoutAgent ────────────── Pulls quarterly results, BSE disclosures, investor decks
       ├── 2. ForensicAnalystAgent ──── Computes UVG vs Realization, DSO delta, A&P-to-EBITDA ratios
       ├── 3. PatternDetectionAgent ── Cross-references management narrative against audited accounts
       ├── 4. HypothesisGeneratorAgent Forms the non-obvious core discovery thesis
       ├── 5. DevilsAdvocateAgent ──── Challenges thesis against peers & creates falsification rules
       └── 6. AuditSynthesisAgent ───── Formulates the auditable 8-point dossier & equity report
```

---

## 📊 The 8 Mandatory Output Elements Delivered

| # | Required Element | Description |
|---|---|---|
| 1 | **The Discovery** | One clear sentence describing the non-obvious finding. |
| 2 | **Why It Matters** | 3 to 5 bullets explaining financial and market significance. |
| 3 | **Evidence Trail** | Multi-source auditable primary citations with clickable links and direct excerpts. |
| 4 | **Timeline** | Chronological phases showing when the divergence emerged and accelerated. |
| 5 | **Numbers** | Exact derived calculations: Volume/Price breakdown, DSO change, Margin vs A&P. |
| 6 | **Counterargument** | Strongest alternative explanation (e.g. macro input inflation, ERP transitions). |
| 7 | **Falsification Condition** | Precise, quantitative future criteria that would disprove the conclusion. |
| 8 | **Evidence Strength** | Strong, Moderate, or Weak rating with explicit audit justification. |

---

## 🚀 Quickstart & Running the Prototype

### 1. Requirements
* Python 3.10+
* Dependencies: `fastapi`, `uvicorn`, `requests`, `pydantic`

### 2. Launch the Application
In your terminal, navigate to the project directory and run:

```powershell
cd C:\Users\OJ\.gemini\antigravity\scratch\signal-c-prototype
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Open in Browser
Visit:
```
http://127.0.0.1:8000
```

### 4. Interactive Features:
1. **1-Click Ticker Pills:** Select `BRITANNIA`, `HINDUNILVR`, `TATACONSUM`, `NESTLEIND`, `ITC`, or `GODREJCP`.
2. **Arbitrary Company Input:** Type *any* listed FMCG ticker into the input bar to demonstrate zero-shot generalization across the entire sector.
3. **Live Pipeline Animation:** Watch the agent stepper visualize each stage of discovery in real time.
4. **Interactive Financial Charts:** Hover over quarterly revenue vs UVG bars and the DSO surge line chart.
5. **Dual Views:**
   * **Interactive UI Dashboard** (real-time terminal view)
   * **Professional Equity Research Report** (institutional print layout with 1-click PDF export via browser print)

---

## 📁 Repository Structure

```
signal-c-prototype/
├── backend/
│   ├── main.py                  # FastAPI web server and API endpoints
│   ├── agents/
│   │   ├── orchestrator.py      # Investigation workflow state engine
│   │   ├── calculators.py       # FMCG metrics: UVG vs Price, DSO, A&P divergence
│   │   ├── falsification_engine.py # Devil's advocate & peer benchmarking engine
│   │   └── data_fetcher.py      # Auditable filings, decks & primary research store
├── frontend/
│   ├── index.html               # Dual-surface: Interactive Dashboard & Equity Report
│   ├── style.css                # Dark financial terminal theme + clean print CSS
│   └── app.js                   # Chart.js visualizations, state management & agent animator
├── docs/
│   ├── ROUND1_SOLUTION_REPORT.md# Complete 2-page Round 1 Solution Report
│   ├── DEMO_VIDEO_SCRIPT.md     # 2-minute Unstop video demo script
└── README.md                    # This document
```

---


2. **Working MVP (Appreciated):** Working FastAPI + Web UI ready for live demonstration.
3. **Demo Video:** Follows the 1m50s script in `docs/DEMO_VIDEO_SCRIPT.md`.
