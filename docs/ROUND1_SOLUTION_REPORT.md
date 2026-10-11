# Finding the Next Signal: Autonomous Financial Research Investigator
## Round 1 Solution Report — Track C: Consumer, FMCG & Retail
**File Reference:** `TeamName_TrackC_Round1.pdf`  
**Hackathon:** ATMOS 2026 · BITS Pilani, Hyderabad Campus  
**Target Submission Deadline:** 19 October 2026, 11:59 PM IST  

---

### 1. Idea & Approach: Autonomous Discovery vs Summarisation
Most financial AI tools fail because they are designed as document summarizers—regurgitating management optimism verbatim from quarterly press releases. In the Indian FMCG sector (Track C), the crucial financial inflection points are intentionally obscured across disjointed filings: a company will celebrate "12% revenue growth" and "premiumization" in its investor presentation headline, while quietly burying negative tonnage volume growth (-1.5%) in footnote disclosures and concealing a 65% surge in distributor debtor days inside the statutory balance sheet notes.

Our system, **Signal-C**, is an autonomous forensic investigator designed to detect *growth quality divergences* and *balance sheet strain*. Rather than summarizing text, Signal-C executes targeted hypothesis testing:
1. **Separates Nominal Price Inflation from Real Consumption Volume:** Automatically decomposes reported revenue into Underlying Volume Growth (UVG) vs Realization/Pricing.
2. **Audits Distributor Working Capital Strain:** Calculates Days Sales Outstanding (DSO) and correlates receivables growth with inventory build-up to catch channel stuffing before headline growth stalls.
3. **Exposes Margin Mirages:** Reconciles Gross Margin expansion against Advertising & Sales Promotion (A&P) spend cuts to reveal when EBITDA is defended by starving brands of promotional reinvestment.

---

### 2. System Architecture & Stack
* **Agent Framework & Orchestration:** Asynchronous multi-agent state graph separating inquiry into 6 specialized agent personas: `ScoutAgent`, `ForensicAnalystAgent`, `PatternDetectionAgent`, `HypothesisGeneratorAgent`, `DevilsAdvocateAgent`, and `AuditSynthesisAgent`.
* **Foundation Reasoning Models:** Hybrid LLM architecture utilizing specialized prompting with structured Pydantic schema validation for deterministic financial ratio extraction and forensic anomaly deduction.
* **Search & Retrieval (Public Internet Only):** Dynamic headless scrapers and public financial data adapters querying NSE/BSE corporate filings, company investor relations portals, SEBI disclosures, and All India Consumer Products Distributors Federation (AICPDF) market alerts.
* **Deterministic Calculation Engine:** Standalone Python numerical engine calculating UVG, DSO, Cash Conversion Cycle (CCC), and Operating Cash Flow (OCF)-to-EBITDA conversion.
* **Output Interfaces:** Dual-surface architecture featuring both an interactive reactive web UI dashboard and an institutional-grade, PDF-exportable equity research note.

---

### 3. Investigation Workflow: From Ticker to Audited Discovery
```
[NIFTY 50 FMCG Ticker] (e.g. BRITANNIA / HINDUNILVR / TATACONSUM / NESTLEIND / ITC)
       │
       ▼
1. DISCOVER ─── ScoutAgent pulls 8 quarters of filings, statutory notes, presentations & concalls
       │
       ▼
2. CALCULATE ── ForensicAnalyst derives: UVG vs Realization, DSO delta, A&P-to-EBITDA ratio, OCF conversion
       │
       ▼
3. CONNECT ──── PatternDetection cross-references management optimism against audited accounts
       │
       ▼
4. REASON ───── HypothesisGenerator detects empirical divergence & forms the non-obvious thesis
       │
       ▼
5. CHALLENGE ── DevilsAdvocate stresses thesis against category peers & tests macro explanations
       │
       ▼
6. PROVE ────── SynthesisAgent outputs 8 mandatory elements with auditable clickable citation graph
```

---

### 4. Generalisation Across Track C Without Company-Specific Tuning
Signal-C achieves zero-shot generalization across all NIFTY 50 FMCG constituents (and any listed consumer peer) because its investigation vectors are parameterized around the universal unit economics of consumer packaged goods:
* **The FMCG Realization Identity:** $\text{Reported Revenue Growth} \equiv \text{UVG} + \text{Price Realization}$. This relationship is invariant across biscuits, soaps, teas, noodles, and cigarettes.
* **The Channel Liquidity Rule:** In traditional General Trade (GT) and modern Quick Commerce (QC), credit periods that deviate from historical medians by $> +7$ days trigger an automated working-capital strain flag regardless of company identity.
* **Standardized Ind AS Financial Taxonomies:** The agent parses standardized Schedule III Balance Sheets (Trade Receivables Note) and Ind AS 115 revenue disclosures common to all Indian listed entities.

---

### 5. Triangulation, Contradiction Detection & Self-Falsification
A discovery is invalid if it rests on a single document or mistakes an industry-wide macro headwind for an idiosyncratic company failure:
1. **Multi-Source Cross-Triangulation:** Every finding is linked across at least 4 independent primary sources: (a) Investor presentation volume disclosures, (b) Annual report statutory notes on trade debts, (c) Concall transcript management commentary, and (d) Category competitor filings.
2. **Contradiction Detection:** If management claims "strong demand traction" during an earnings call while statutory receivable days increase by 14 days and OCF-to-EBITDA drops below 70%, the contradiction engine automatically flags the narrative as uncorroborated.
3. **Active Self-Falsification (Devil's Advocate Engine):**
   * *Peer Normalization Check:* Did peer competitors also suffer volume drops and DSO spikes due to raw material inflation or quick-commerce terms? If yes, conviction is calibrated to Moderate and the sector-wide macro factor is explicitly highlighted.
   * *Empirically Falsifiable Condition:* Formulates exact quantitative milestones that would disprove the thesis (e.g. *"Falsified if the company logs two consecutive quarters of UVG > +3.5% with DSO normalizing below 26 days"*).

---

### 6. Required 8-Point Output Format
The agent synthesizes the mandatory 8 elements into both an interactive UI dashboard and an equity research report:
1. **The Discovery:** Single unambiguous sentence revealing the hidden divergence.
2. **Why It Matters:** 3–5 bullets detailing commercial and capital market ramifications.
3. **Evidence:** Auditable clickable citations with exact document excerpts and publication dates.
4. **Timeline:** Chronological milestones tracking the origin and acceleration of the shift.
5. **Numbers:** Clean calculated tables and interactive decomposition charts.
6. **Counterargument:** The strongest alternative defense or sector macro explanation.
7. **Falsification Condition:** Verifiable future threshold that would invalidate the finding.
8. **Evidence Strength:** Categorized (Strong / Moderate / Weak) with auditable justification.

---

### 7. Build Plan & Milestones to Finals (25 October 2026)
| Milestone | Timeline | Deliverables |
|---|---|---|
| **Phase 1: Working MVP** | Complete | Multi-agent Python core, FastAPI endpoints, reactive dashboard, live charts, and full support for all NIFTY 50 FMCG constituents. |
| **Phase 2: Live Ingestion** | 12–16 Oct | Live headless BSE/NSE corporate announcement RSS stream parser and concall audio/transcript alignment. |
| **Phase 3: Stress Testing** | 17–21 Oct | Blind live-testing across 20 non-NIFTY 50 listed peers (Dabur, Marico, Emami, Bikaji, Mrs Bectors) for tie-breaker readiness. |
| **Phase 4: Finals Dry Run** | 22–24 Oct | Latency optimization to deliver full multi-agent auditable discoveries within under 15 seconds during live judges demo. |
