# TenderSense

Consultancy bid intelligence for Government of India infrastructure tenders.

## Architecture

- `research/<sector>.json` — sector datasets from research agents (source of truth)
- `webapp/public/data/` — runtime JSON served to the browser (`npm run sync-data`)
- `webapp/src/` — React UI: seven sector workspaces, tender library, QCBS evaluator

Sectors: water, power, road, railway, urban, ports, aviation.

## Commands

```bash
npm install
npm run sync-data   # research/ → src/data + public/data
npm run dev
npm run build
```
