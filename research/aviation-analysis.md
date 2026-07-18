# Aviation Sector — Consultant Selection Analysis (Airports & Civil Aviation)

## 1. Landscape

Consultancy demand in Indian aviation infrastructure clusters into a few recurring assignment types:

- **Greenfield airport feasibility** — Techno-Economic Feasibility Report (TEFR) / Detailed Techno-Economic Report (DTER), usually bundled with master planning, financial modelling, EIA/SIA, statutory clearances and **bid-process management** for the PPP developer. This is the single most common consultancy tendered by state airport SPVs (TIDCO, APADCL, MADC).
- **Project Management Consultancy (PMC)** for terminal/runway/apron construction, tendered mainly by **AAI** for very large works (e.g. Srinagar new terminal ₹937.92 Cr; Great Nicobar greenfield ~₹8,573 Cr).
- **Architectural & Engineering (design) consultancy** for terminal/civil-enclave development (AAI).
- **Transaction advisory / strategy** for PPP structuring, privatisation and specialised facilities (e.g. AAI FFS & TRTO training facilities).
- **Specialised surveys & environmental** — OLS/aeronautical surveys (ICAO Annex 14 / DGCA CAR), hydrographic surveys for water aerodromes, and EIA/EMP for Environmental Clearance.

Delivery model matters: MoCA's *Guidelines for Setting up of Greenfield Airports* push airports toward **PPP concessions** (with Viability Gap Funding up to 20%), which is why feasibility consultants are almost always also asked to run the developer bid process — and why PPP/transaction-advisory experience is scored as a distinct block.

## 2. Issuing authorities

- **Airports Authority of India (AAI)** — PMC and A&E consultancy for terminals/runways; tenders via eProcure (etenders.gov.in). Also issues strategy/advisory RFPs.
- **State airport SPVs** — TIDCO (Tamil Nadu: Hosur, Parandur/Chennai), APADCL (Andhra Pradesh: Amaravati, Nagarjuna Sagar, Bhogapuram, water aerodromes), MADC (Maharashtra: Purandar/Nagpur), NIAL (Noida/Jewar). These dominate greenfield feasibility work.
- **Private/JV airport operators** — e.g. CIAL (Cochin) for aeronautical/OLS surveys.
- **Ministry of Civil Aviation (MoCA)** — policy/steering (greenfield guidelines, UDAN/RCS).

## 3. Tender notes (10 researched)

| ID | Assignment | Authority | Method | Min tech | Turnover gate | Source type |
|----|-----------|-----------|--------|----------|---------------|-------------|
| 001 | TEFR Nagarjuna Sagar greenfield | APADCL | QCBS 70:30 | 60/100 | ₹500 Cr | live |
| 002 | DTER Hosur greenfield intl | TIDCO | QCBS 80:20 | 70/100 | ₹100 Cr | live |
| 003 | TEFR Chennai (Parandur) greenfield | TIDCO | QCBS 80:20 | 70/100 | ₹100 Cr | archived (2020) |
| 004 | Pre-feasibility+TEFR Amaravati | APADCL | QCBS 70:30 | 60/100 | ~₹500 Cr | live |
| 005 | Water aerodromes (survey/OLS/EIA), 8 sites | APADCL | QCBS 60:40 | 60% | CA-certified | live |
| 006 | PMC Srinagar new terminal | AAI | QCBS (per RFP) | n/a* | per RFP | live (₹937.92 Cr) |
| 007 | PMC Great Nicobar greenfield | AAI | QCBS (per RFP) | n/a* | per RFP | live (~₹8,573 Cr) |
| 008 | FFS & TRTO facility advisory | AAI | QCBS 80:20 | n/a* | ₹300 Cr | live |
| 009 | OLS/aeronautical survey Cochin | CIAL | Empanelment/L1 | n/a | ₹50 lakh similar | archived (2023) |
| 010 | A&E consultancy Agra civil enclave | AAI | QCBS (per RFP) | n/a* | per RFP | archived (2023) |

\* Exact scoring/threshold sits inside the full RFP on etenders.gov.in; only metadata was available from accessible listings. Marked honestly in the JSON (`maxMarks: null`, method noted "ratio per RFP").

Notable observations:
- **APADCL** uses a consistent house template (QCBS 70:30, min 60): firm airport-consulting experience (5) + greenfield (5) + technical services (5) + ₹3000 Cr PPP transport (5) + approach/methodology (20) + **team 55** + presentation (5).
- **TIDCO** uses QCBS 80:20, min 70, turnover ₹100 Cr, with the richest personnel breakdown (Team Leader, Airport Sector Expert, Airport Planner, Environmental, Financial, Social, Contract experts), each scored by qualifying airport passenger capacity.
- **Water aerodromes** (005) is the clearest example of specialised gates — OLS (ICAO Annex 14/DGCA CAR), hydrographic survey, and NABET-accredited EIA — with a 60/35/5 (experience/team/approach) split.

## 4. Criteria synthesis (feeds evaluationFramework)

The six synthesised criteria and typical weights:

1. **Firm's airport consultancy experience (~28%)** — scored by airport SCALE (MPPA and ₹ project-value bands, e.g. 10+ MPPA / ₹1500 Cr), not km. Distinct greenfield-airport credit.
2. **PPP / transaction advisory experience (~10%)** — separate block; airport-specific PPP advisory scores highest.
3. **Approach, methodology & presentation (~22%)** — larger than roads; a formal presentation to the committee/MoCA/AAI is commonly a scored sub-block.
4. **Key personnel (~45%)** — the dominant block. Airport-specific roles: Team Leader/Project Director (≥20 yrs, led ≥1 airport ≥₹1000 Cr), Airport Sector Expert, Airport Planner (master plans), PPP/Contract Expert, Financial Specialist, Environmental Expert (EIA + EC), Social/R&R Expert. Outsourced/<2-yr-tenure CVs scored at ~75%.
5. **Financial turnover & eligibility gate (~5%)** — ₹100 Cr (greenfield TEFR) up to ₹300-500 Cr (AAI advisory/large PMC); positive net worth; ≥5 yrs aviation consultancy.
6. **Specialised survey/EIA/aeronautical capability (~10%)** — AAI survey empanelment (GIS Circular 03/2021), ICAO Annex 14 OLS, NABET/MoEF&CC EIA, hydrographic/geotechnical capability.

Input fields are quantitative (counts of airport assignments, largest MPPA served, project-value band, master plans, core roles staffed, turnover, accreditations) so the webapp can map a firm's credentials to indicative marks.

## 5. Dominant method & gaps

- **Dominant method:** QCBS. Ratio varies — **80:20** for greenfield feasibility/advisory (TIDCO, AAI advisory) with a 70/100 minimum; **70:30** (APADCL, min 60); **60:40** for multi-scope survey/EIA (min 60%). GFR Rule 192 caps technical weight at 80%.
- **No INFRACON equivalent:** unlike roads, aviation has no single mandatory firm/personnel registration portal. Instead there are task-specific accreditations (AAI survey empanelment, NABET EIA).
- **Gaps / caveats:**
  - For four tenders (AAI Srinagar PMC, AAI Great Nicobar PMC, AAI FFS/TRTO, AAI Agra A&E) the detailed technical scoring tables sit inside RFP PDFs on etenders.gov.in that were not directly fetched within the context budget; only verifiable listing metadata (ref, value, method, turnover where stated) is captured, and marks are left `null`.
  - Estimated consultancy fee values are generally not disclosed pre-award (fee is quoted in the financial bid); underlying project values are recorded where known.
  - UDAN/RCS-specific consultancy tenders were not separately isolated; the greenfield-feasibility and AAI PMC tenders cover the same evaluation patterns those assignments use.
  - Aggregator-listing URLs are used for the four AAI tenders (metadata verified); the authoritative documents are the corresponding RFPs on etenders.gov.in.
