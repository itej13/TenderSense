import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SectorData, SectorId } from '../types'
import { SECTOR_IDS } from '../types'
import { loadAllSectorData } from '../lib/data'

interface DataContextValue {
  ready: boolean
  error: string | null
  byId: Record<SectorId, SectorData> | null
  sectorData: (id: SectorId) => SectorData
  totalTenders: number
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [byId, setById] = useState<Record<SectorId, SectorData> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadAllSectorData()
      .then((data) => {
        if (!cancelled) setById(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Failed to load sector research')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<DataContextValue>(() => {
    const totalTenders = byId
      ? SECTOR_IDS.reduce((sum, id) => sum + (byId[id]?.tenders.length ?? 0), 0)
      : 0
    return {
      ready: !!byId,
      error,
      byId,
      totalTenders,
      sectorData: (id: SectorId) => {
        if (!byId) throw new Error('Sector data not loaded yet')
        return byId[id]
      },
    }
  }, [byId, error])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useSectorStore() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useSectorStore must be used within DataProvider')
  return ctx
}
