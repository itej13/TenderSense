# Tender Research Output Schema

Each sector agent writes two files:

1. `research/<sector>.json` — machine-readable data consumed by the webapp
2. `research/<sector>-analysis.md` — human-readable analysis report

`<sector>` is one of: `water`, `power`, `road`, `railway`.

## JSON Schema (`research/<sector>.json`)

```json
{
  "sector": "road",
  "sectorLabel": "Road & Highways",
  "generatedAt": "2026-07-18",
  "sources": [
    {
      "name": "Central Public Procurement Portal",
      "url": "https://eprocure.gov.in",
      "type": "tender-portal | policy-document | authority-website"
    }
  ],
  "tenders": [
    {
      "id": "road-001",
      "title": "Consultancy Services for Detailed Project Report ...",
      "issuingAuthority": "NHAI",
      "tenderRef": "NHAI/xx/2026 (or null if unavailable)",
      "url": "https://... (source URL, REQUIRED — must be real)",
      "datePublished": "2026-05-01 (or null)",
      "estimatedValueINR": 25000000,
      "estimatedValueLabel": "₹2.5 Cr",
      "scopeSummary": "2-4 sentence summary of the consultancy scope",
      "consultancyType": "DPR | PMC | Supervision | Feasibility | Design Review | Transaction Advisory | Other",
      "eligibility": {
        "minAnnualTurnoverINR": 50000000,
        "similarProjectsRequired": "e.g. 3 similar DPR assignments in last 7 years",
        "keyPersonnel": ["Team Leader cum Highway Engineer (20 yrs)", "..."],
        "other": ["..."]
      },
      "evaluationMethod": "QCBS 80:20 | QCBS 70:30 | QBS | LCS | Fixed Budget",
      "minTechnicalScore": 75,
      "technicalCriteria": [
        {
          "criterion": "Firm's relevant experience",
          "maxMarks": 30,
          "subCriteria": ["..."],
          "notes": "optional"
        }
      ],
      "sourceType": "live-tender | archived-tender | policy-document | model-rfp",
      "sourceDocument": "name of the RFP/policy doc this was extracted from"
    }
  ],
  "evaluationFramework": {
    "summary": "2-3 paragraph synthesis of how consultant evaluation works in this sector",
    "dominantMethod": "QCBS 80:20",
    "typicalMinTechnicalScore": 75,
    "criteria": [
      {
        "id": "firm-experience",
        "label": "Firm's Relevant Experience",
        "typicalWeightPct": 30,
        "description": "What authorities look for",
        "scoringGuidance": [
          { "level": "Excellent (90-100%)", "meaning": "e.g. 5+ similar assignments of comparable value" },
          { "level": "Good (70-89%)", "meaning": "..." },
          { "level": "Fair (50-69%)", "meaning": "..." },
          { "level": "Poor (<50%)", "meaning": "..." }
        ],
        "inputFields": [
          {
            "key": "similarProjectsCount",
            "label": "Number of similar assignments completed (last 7 years)",
            "type": "number | select | boolean | text",
            "options": ["only for select type"],
            "scoring": "description of how this maps to marks"
          }
        ]
      }
    ],
    "keyPolicies": [
      { "name": "Manual for Procurement of Consultancy Services, MoF 2022", "url": "...", "relevance": "..." }
    ]
  }
}
```

## Rules

- Every tender MUST have a real, verifiable `url`. Never fabricate tenders, refs, or values.
- If live tender documents aren't accessible, use archived tenders, model RFPs, and policy/guideline documents — and mark `sourceType` accordingly.
- `evaluationFramework.criteria` is the most important part: the webapp uses `inputFields` to render a form where a consultant enters their firm's details against a tender, and `typicalWeightPct` + `scoringGuidance` to compute an indicative score. Make these concrete and quantitative wherever the source documents allow.
- Aim for 8-15 tenders per sector; quality and accuracy over quantity.
- JSON must be valid (no comments, no trailing commas).
