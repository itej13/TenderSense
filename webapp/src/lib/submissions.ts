import type { SectorId } from '../types'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface TenderLinkSubmission {
  id: string
  url: string
  title: string
  sector: SectorId
  notes: string
  submittedById: string
  submittedByName: string
  submittedAt: string
  status: SubmissionStatus
  reviewedAt?: string | null
  reviewedByName?: string | null
  adminNotes?: string
}

const STORAGE_KEY = 'tendersense.tender_submissions'

function readAll(): TenderLinkSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TenderLinkSubmission[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(items: TenderLinkSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function listSubmissions(): TenderLinkSubmission[] {
  return readAll().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
}

export function createSubmission(input: {
  url: string
  title: string
  sector: SectorId
  notes: string
  submittedById: string
  submittedByName: string
}): TenderLinkSubmission {
  const item: TenderLinkSubmission = {
    id: `sub-${crypto.randomUUID()}`,
    url: input.url.trim(),
    title: input.title.trim(),
    sector: input.sector,
    notes: input.notes.trim(),
    submittedById: input.submittedById,
    submittedByName: input.submittedByName,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    reviewedAt: null,
    reviewedByName: null,
    adminNotes: '',
  }
  const next = [item, ...readAll()]
  writeAll(next)
  return item
}

export function reviewSubmission(input: {
  id: string
  status: 'approved' | 'rejected'
  adminNotes: string
  reviewedByName: string
}): TenderLinkSubmission | null {
  const all = readAll()
  const idx = all.findIndex((s) => s.id === input.id)
  if (idx < 0) return null
  const updated: TenderLinkSubmission = {
    ...all[idx],
    status: input.status,
    adminNotes: input.adminNotes.trim(),
    reviewedAt: new Date().toISOString(),
    reviewedByName: input.reviewedByName,
  }
  all[idx] = updated
  writeAll(all)
  return updated
}

export function countPending(): number {
  return readAll().filter((s) => s.status === 'pending').length
}
