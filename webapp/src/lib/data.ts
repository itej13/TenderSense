import type { SectorData, SectorId } from '../types'
import { SECTOR_IDS } from '../types'

export function formatINR(value?: number | null, label?: string | null): string {
  if (label) return label
  if (value == null) return 'Not disclosed'
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.00$/, '')} Cr`
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1).replace(/\.0$/, '')} L`
  return `₹${value.toLocaleString('en-IN')}`
}

async function fetchSector(id: SectorId): Promise<SectorData> {
  const res = await fetch(`/data/${id}.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to load ${id} sector data (${res.status})`)
  return (await res.json()) as SectorData
}

export async function loadAllSectorData(): Promise<Record<SectorId, SectorData>> {
  const entries = await Promise.all(
    SECTOR_IDS.map(async (id) => [id, await fetchSector(id)] as const),
  )
  return Object.fromEntries(entries) as Record<SectorId, SectorData>
}
