import type { EvaluationFramework, FrameworkCriterion, ScoringLevel } from '../types'

export interface CriterionAssessment {
  levelIndex: number | null
  fieldValues: Record<string, string>
}

export type Assessments = Record<string, CriterionAssessment>

const DEFAULT_LEVEL_PCTS = [0.95, 0.8, 0.6, 0.4]

/** Extract an attainment fraction from level text like "Excellent (90-100%)"; fall back to position defaults. */
export function levelPct(level: ScoringLevel, index: number, total: number): number {
  const range = level.level.match(/(\d+)\s*[-–]\s*(\d+)\s*%/)
  if (range) return (Number(range[1]) + Number(range[2])) / 200
  const single = level.level.match(/[<>]?\s*(\d+)\s*%/)
  if (single) return Number(single[1]) / 100
  if (index < DEFAULT_LEVEL_PCTS.length && total <= DEFAULT_LEVEL_PCTS.length) {
    return DEFAULT_LEVEL_PCTS[index]
  }
  return 1 - index / Math.max(total, 1)
}

export interface CriterionScore {
  criterion: FrameworkCriterion
  weightPct: number
  attainment: number | null
  marks: number | null
}

export interface EvaluationResult {
  criterionScores: CriterionScore[]
  assessedWeight: number
  technicalScore: number | null
  qualifies: boolean | null
  combinedScore: number | null
  financialScore: number | null
}

export function parseMethodWeights(method: string): { tech: number; fin: number } {
  const m = method.match(/(\d+)\s*[:/]\s*(\d+)/)
  if (m) return { tech: Number(m[1]), fin: Number(m[2]) }
  if (/QBS/i.test(method)) return { tech: 100, fin: 0 }
  if (/LCS/i.test(method)) return { tech: 0, fin: 100 }
  return { tech: 80, fin: 20 }
}

export function evaluate(
  framework: EvaluationFramework,
  assessments: Assessments,
  opts: {
    minTechnicalScore: number
    method: string
    yourFeeINR?: number | null
    lowestFeeINR?: number | null
  },
): EvaluationResult {
  const totalWeight = framework.criteria.reduce((s, c) => s + c.typicalWeightPct, 0) || 100

  const criterionScores: CriterionScore[] = framework.criteria.map((criterion) => {
    // Normalize weights so they always sum to 100 even if source data doesn't.
    const weightPct = (criterion.typicalWeightPct / totalWeight) * 100
    const a = assessments[criterion.id]
    if (!a || a.levelIndex == null) {
      return { criterion, weightPct, attainment: null, marks: null }
    }
    const attainment = levelPct(
      criterion.scoringGuidance[a.levelIndex],
      a.levelIndex,
      criterion.scoringGuidance.length,
    )
    return { criterion, weightPct, attainment, marks: attainment * weightPct }
  })

  const assessed = criterionScores.filter((c) => c.marks != null)
  const assessedWeight = assessed.reduce((s, c) => s + c.weightPct, 0)
  const technicalScore =
    assessed.length === 0 ? null : assessed.reduce((s, c) => s + (c.marks ?? 0), 0)

  const allAssessed = assessed.length === framework.criteria.length && framework.criteria.length > 0
  const qualifies = allAssessed && technicalScore != null ? technicalScore >= opts.minTechnicalScore : null

  const { tech, fin } = parseMethodWeights(opts.method)
  let financialScore: number | null = null
  let combinedScore: number | null = null
  if (
    technicalScore != null &&
    opts.yourFeeINR != null &&
    opts.lowestFeeINR != null &&
    opts.yourFeeINR > 0 &&
    opts.lowestFeeINR > 0
  ) {
    financialScore = Math.min((opts.lowestFeeINR / opts.yourFeeINR) * 100, 100)
    combinedScore = (technicalScore * tech + financialScore * fin) / 100
  }

  return { criterionScores, assessedWeight, technicalScore, qualifies, combinedScore, financialScore }
}
