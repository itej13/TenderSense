import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const researchDir = path.resolve(here, '../../research')
const targets = [
  path.resolve(here, '../src/data'),
  path.resolve(here, '../public/data'),
]
const sectors = ['water', 'power', 'road', 'railway', 'urban', 'ports', 'aviation']

let failures = 0
for (const dir of targets) mkdirSync(dir, { recursive: true })

for (const sector of sectors) {
  const src = path.join(researchDir, `${sector}.json`)
  if (!existsSync(src)) {
    console.warn(`[skip] ${sector}.json not found in research/`)
    continue
  }
  try {
    const parsed = JSON.parse(readFileSync(src, 'utf8'))
    const tenders = Array.isArray(parsed.tenders) ? parsed.tenders.length : 0
    const criteria = parsed.evaluationFramework?.criteria?.length ?? 0
    for (const dir of targets) {
      copyFileSync(src, path.join(dir, `${sector}.json`))
    }
    console.log(`[ok]   ${sector}.json — ${tenders} tenders, ${criteria} framework criteria`)
  } catch (err) {
    failures++
    console.error(`[fail] ${sector}.json — ${err.message}`)
  }
}
process.exit(failures > 0 ? 1 : 0)
