export type Phq9Severity = 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'
export type Gad7Severity = 'minimal' | 'mild' | 'moderate' | 'severe'

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)
}

export function phq9Total(responses: number[]): number {
  return sum(responses)
}

export function gad7Total(responses: number[]): number {
  return sum(responses)
}

export function phq9Severity(total: number): Phq9Severity {
  if (total <= 4) return 'minimal'
  if (total <= 9) return 'mild'
  if (total <= 14) return 'moderate'
  if (total <= 19) return 'moderately_severe'
  return 'severe'
}

export function gad7Severity(total: number): Gad7Severity {
  if (total <= 4) return 'minimal'
  if (total <= 9) return 'mild'
  if (total <= 14) return 'moderate'
  return 'severe'
}

export function hasPhq9Item9Risk(responses: number[]): boolean {
  const v = responses[8]
  return Number.isFinite(v) && v >= 1
}

export type TriageLevel = 'none' | 'high' | 'crisis'

export function triage(
  phq9: number[],
  gad7: number[]
): { level: TriageLevel; reasons: string[] } {
  const totalPhq = phq9Total(phq9)
  const totalGad = gad7Total(gad7)
  const reasons: string[] = []

  const item9 = hasPhq9Item9Risk(phq9)
  if (item9) reasons.push('PHQ-9 第9题提示自我伤害相关念头')
  if (totalPhq >= 20) reasons.push('抑郁症状总分很高（PHQ-9 ≥ 20）')
  if (totalGad >= 15) reasons.push('焦虑症状总分很高（GAD-7 ≥ 15）')

  // 升级判定
  if (item9 && (phq9[8] ?? 0) >= 2) {
    return { level: 'crisis', reasons }
  }
  if (item9 || totalPhq >= 20 || totalGad >= 15) {
    return { level: 'high', reasons }
  }
  return { level: 'none', reasons }
}
