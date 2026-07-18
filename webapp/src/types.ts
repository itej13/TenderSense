export type SectorId = 'water' | 'power' | 'road' | 'railway' | 'urban' | 'ports' | 'aviation'

export const SECTOR_IDS: SectorId[] = [
  'water',
  'power',
  'road',
  'railway',
  'urban',
  'ports',
  'aviation',
]

export interface Source {
  name: string
  url: string
  type: string
}

export interface TenderEligibility {
  minAnnualTurnoverINR?: number | null
  similarProjectsRequired?: string | null
  keyPersonnel?: string[]
  other?: string[]
}

export interface TechnicalCriterion {
  criterion: string
  maxMarks?: number | null
  subCriteria?: string[]
  notes?: string
}

export interface Tender {
  id: string
  title: string
  issuingAuthority: string
  tenderRef?: string | null
  url: string
  datePublished?: string | null
  estimatedValueINR?: number | null
  estimatedValueLabel?: string | null
  scopeSummary: string
  consultancyType: string
  eligibility?: TenderEligibility
  evaluationMethod?: string | null
  minTechnicalScore?: number | null
  technicalCriteria?: TechnicalCriterion[]
  sourceType: string
  sourceDocument?: string | null
}

export interface ScoringLevel {
  level: string
  meaning: string
}

export interface InputField {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean' | 'text' | string
  options?: string[]
  scoring?: string
}

export interface FrameworkCriterion {
  id: string
  label: string
  typicalWeightPct: number
  description: string
  scoringGuidance: ScoringLevel[]
  inputFields: InputField[]
}

export interface KeyPolicy {
  name: string
  url?: string
  relevance?: string
}

export interface EvaluationFramework {
  summary: string
  dominantMethod: string
  typicalMinTechnicalScore: number
  criteria: FrameworkCriterion[]
  keyPolicies?: KeyPolicy[]
}

export interface SectorData {
  sector: SectorId
  sectorLabel: string
  generatedAt: string
  sources: Source[]
  tenders: Tender[]
  evaluationFramework: EvaluationFramework
}

export interface SectorMeta {
  id: SectorId
  label: string
  shortLabel: string
  tagline: string
  accent: string
  accentSoft: string
  accentText: string
  accentHex: string
  icon: string
}
