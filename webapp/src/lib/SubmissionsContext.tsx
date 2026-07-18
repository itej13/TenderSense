import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { SectorId } from '../types'
import {
  createSubmission,
  listSubmissions,
  reviewSubmission,
  type TenderLinkSubmission,
} from './submissions'

interface SubmissionsContextValue {
  submissions: TenderLinkSubmission[]
  pendingCount: number
  refresh: () => void
  submitLink: (input: {
    url: string
    title: string
    sector: SectorId
    notes: string
    submittedById: string
    submittedByName: string
  }) => TenderLinkSubmission
  review: (input: {
    id: string
    status: 'approved' | 'rejected'
    adminNotes: string
    reviewedByName: string
  }) => TenderLinkSubmission | null
}

const SubmissionsContext = createContext<SubmissionsContextValue | null>(null)

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<TenderLinkSubmission[]>([])

  const refresh = useCallback(() => {
    setSubmissions(listSubmissions())
  }, [])

  useEffect(() => {
    refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tendersense.tender_submissions') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const value: SubmissionsContextValue = {
    submissions,
    pendingCount: submissions.filter((s) => s.status === 'pending').length,
    refresh,
    submitLink: (input) => {
      const item = createSubmission(input)
      refresh()
      return item
    },
    review: (input) => {
      const item = reviewSubmission(input)
      refresh()
      return item
    },
  }

  return (
    <SubmissionsContext.Provider value={value}>{children}</SubmissionsContext.Provider>
  )
}

export function useSubmissions() {
  const ctx = useContext(SubmissionsContext)
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider')
  return ctx
}
