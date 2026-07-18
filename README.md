# TenderSense

Consultancy bid intelligence for Government of India infrastructure tenders.

Consultants can browse analyzed tenders across **seven sectors**, review how authorities score bids, and run an indicative QCBS / QBS / LCS evaluation against their own firm credentials.

## Sectors

| Sector | Focus |
|---|---|
| Water & Sanitation | JJM, AMRUT 2.0, NMCG, state water boards |
| Power & Energy | RDSS PMA, owner's engineer, renewables advisory |
| Roads & Highways | NHAI / MoRTH AE, DPR, IE, supervision |
| Railways & Metro | RVNL, DFCCIL, NHSRCL, metro DDC/GC |
| Urban & Smart Cities | Smart Cities PMC, PMAY-U, master plans |
| Ports & Waterways | Sagarmala, major ports, IWAI |
| Airports & Aviation | AAI PMC/DPR, UDAN, greenfield advisory |

## Repo layout

```
research/     # sector JSON + analysis markdown (source of truth)
webapp/       # Vite + React + TypeScript + Tailwind UI
```

## Local development

```bash
cd webapp
npm install
npm run sync-data   # copies research/*.json → webapp/public/data + src/data
npm run dev
```

Open http://127.0.0.1:5173

## Deploy

The Vercel app root is `webapp/`. Build command: `npm run build`. Output: `dist`.

## Disclaimer

Scores are indicative bid-decision aids derived from typical criteria observed across analyzed tenders — always verify against the actual RFP.
