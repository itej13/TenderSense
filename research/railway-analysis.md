# Railways & Metro — Consultancy Tender Analysis

**Sector:** `railway` · **Generated:** 2026-07-18 · **Tenders analysed:** 13

## 1. Landscape

Consultant procurement in the Indian railway/metro space splits into a few distinct sub-markets, each with its own consultant "product":

- **Metro General Consultant (GC) / Project Consultant** — the big-ticket, multi-year advisory-plus-supervision engagement covering the whole project (civil, systems, track, rolling stock, SHE). Issued by metro corporations (DMRC, UPMRC, CMRL, BMRCL, MahaMetro, GMRC). Often preceded by an EOI/shortlisting stage.
- **PMC (Project Management Consultancy)** — construction-phase management, used heavily by NHSRCL (MAHSR bullet train) and RLDA (station redevelopment).
- **Detailed Design Consultant (DDC)** and **General Engineering Consultant (GEC)** — detailed design of viaducts/stations, and construction supervision, respectively (metro corporations; SYSTRA, AECOM, etc. dominate).
- **DPR / Final Location Survey (FLS)** — new railway-line surveys and detailed project reports, tendered by Ministry of Railways zonal construction units (N.F. Railway, Northern Railway/USBRL) via IREPS, and by IPRCL for specific corridors.
- **Station redevelopment advisory** — techno-economic feasibility, master planning, urban design and DPR, tendered by RLDA (often as limited tenders to empanelled architectural firms).

## 2. Authorities & sources

| Authority | Role | Example tender in dataset |
|---|---|---|
| DMRC | Delhi metro; GC/PC for Phase-IV | EOI/DMRC/SL/DCS-1B(R) |
| UPMRC | Lucknow/Kanpur/Agra metro; GC | LKGC (02)-01 (Phase 1B) |
| NHSRCL | Mumbai–Ahmedabad HSR; GC + PMC | NHSRCL/CO/CA/MA-SVGC/2020/34 |
| CMRL | Chennai metro; PMC + DDC | CMRL Phase 1 NCE; CMRL/CP/TDR-56-CS-DDC/2025 |
| IPRCL / NW Railway | New rail line GC (ghat/tunnels) | Taranga Hill–Ambaji–Aburoad GC |
| RLDA | Station redevelopment PMC / feasibility / DPR | CT-04/2023 (CSMT), CT-51/2022 (Sarai Rohilla) |
| MoR (N.F. Rly, Northern Rly/USBRL) | FLS + DPR of new BG lines (IREPS) | 75W126WA-FLS-Reasi-Poonch; CE-CON-NL-FLS-2026-01 |
| GMRC | Surat metro DPR/GEC/DDC selection | Surat Metro consultant selection |
| MoF / DoE | Policy (GFR Rule 192, Consultancy Manual 2022) | Manual for Procurement of Consultancy 2022 |

Live tender documents on IREPS/CPPP and some metro portals are frequently gated or expire; where the primary PDF was not durably accessible, the dataset cites the official EOI/NIT PDF (DMRC, CMRL, IPRCL) or a reputable trade-press record of the tender (RLDA via Rail Analysis, NHSRCL via Urban Transport News, MoR FLS via TenderShark), with `sourceType` marked honestly (`live-tender`, `archived-tender`, `model-rfp`, `policy-document`).

## 3. Tender notes

- **DMRC DCS-1B (Phase-IV GC)** is the richest eligibility example: single similar MRTS GC work **≥ ₹85.76 Cr** (or ₹42.88 Cr for underground), **average annual turnover > ₹71.47 Cr** over 5 years, positive net worth, liquidity/bid-capacity — all imposed at EOI before the QCBS 80:20 RFP is even issued. JICA ODA guidelines apply.
- **IPRCL GC (Taranga Hill tunnels)** is the richest *scoring* example, with an explicit marks table: Bidder experience **200** (10/assignment), average annual professional fees **130** (1/crore), Team Leader **50**, Tunnel Design Expert **40**, Tunnel Geologist **40**, Finance expert **20**, methodology & work plan **180 → 60 weight**, plus mandatory presentation + skill tests. Minimum technical score **49/70 (70%)**.
- **NHSRCL MAHSR PMC** shows how competitive the top is: technically-qualified JVs scored **99.25** and **97.25 / 100**; winning bid ₹1,111 Cr over 96 months.
- **RLDA station PMC** (CSMT, Ahmedabad) uses value-banded experience gates (3×₹10–15 Cr / 2×₹20–25 Cr / 1×₹30 Cr) plus an **ongoing assignment > ₹50 Cr**, and accepts airports/malls/other large RCC terminals as "similar".
- **RLDA feasibility/DPR** (Sarai Rohilla) is a **limited tender to empanelled architects** — no eligibility test, evaluation criteria only, COA registration mandatory.
- **MoR FLS/DPR** (Reasi–Poonch, N.F. Railway sections) represent the survey-consultancy category on IREPS; exact scoring is per tender document (two-packet QCBS per Railway Board norms), so `minTechnicalScore` is left null rather than guessed.

## 4. Criteria synthesis

The framework distils to **five criteria**:

1. **Firm's relevant experience (~35%)** — number and value of similar rail/metro/station/FLS assignments in last 5–7 years; asset-type match (underground/HSR/tunnel score higher); JV credit by share.
2. **Key personnel (~35%)** — Team Leader (≥15 yrs, on payroll, multiple similar assignments) plus discipline experts; duplicate-CV = zero; skill tests common.
3. **Approach/methodology + presentation (~15%)** — incl. QSMP for metro GC; live presentation/skill test in railway GC RFPs.
4. **Turnover/financial standing (~12%)** — gate (₹20 Cr → ₹71.47 Cr depending on tender) and scored sub-criterion (1 mark/crore, capped) with positive net worth.
5. **Statutory/eligibility compliance (~3%)** — COA registration, RLDA empanelment, EMD, bid capacity, clean personnel records.

**Dominant method:** QCBS 80:20 (metro/JICA); railway GC RFPs sometimes 70:30. **Typical minimum technical score:** 70/100 (or 70%).

## 5. Gaps & caveats

- Full per-criterion **mark weightings out of 100** are only firmly documented for the IPRCL GC and (partially) Surat metro RFPs; metro EOIs (DMRC, CMRL, UPMRC) publish eligibility and the QCBS 80:20 rule but the detailed technical-scoring table sits inside the shortlisted-only RFP. Weights in `evaluationFramework.criteria` are therefore *typical/synthesised*, not tender-verbatim.
- **RVNL, RITES and DFCCIL** own RFP PDFs were gated/redirecting; DFCCIL/railway GC scoring is represented via the closely-analogous IPRCL railway GC RFP and the South Eastern Railway GC RFP (49/70 gate) found in search. Direct RVNL/RITES DPR RFPs would strengthen the DPR/FLS branch.
- MoR FLS/DPR evaluation specifics (exact weightage and minimum score) were not extracted from the live IREPS documents to avoid fabrication.
- INFRACON-style mandatory portal registration (ubiquitous in roads) has **no exact railway equivalent** in the reviewed documents; metro/RLDA instead rely on COA registration, RLDA empanelment and CV-exclusivity rules.
