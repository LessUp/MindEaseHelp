export type Phq9Severity = 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'
export type Gad7Severity = 'minimal' | 'mild' | 'moderate' | 'severe'

export interface SeverityInfo {
  label: string
  description: string
  recommendation: string
}

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

export const PHQ9_SEVERITY_INFO: Record<Phq9Severity, SeverityInfo> = {
  minimal: {
    label: '最轻',
    description: '当前抑郁相关症状处于最轻范围，可能与日常情绪波动或短期压力有关。',
    recommendation: '保持良好的作息、饮食与社交联系，继续关注身心状态的细微变化。',
  },
  mild: {
    label: '轻度',
    description: '出现轻度抑郁症状，偶尔影响情绪与效率，但通常仍能维持日常功能。',
    recommendation: '尝试规律运动、行为激活与社交支持，如持续存在可与专业人士讨论。',
  },
  moderate: {
    label: '中度',
    description: '中度抑郁症状可能已经影响睡眠、食欲或兴趣，需要更系统的自助与支持。',
    recommendation: '尽快与心理咨询或精神科专业人员联系，讨论进一步评估与干预方案。',
  },
  moderately_severe: {
    label: '中重度',
    description: '中重度抑郁症状常显著影响工作、学习或人际功能，应积极寻求帮助。',
    recommendation: '建议尽快安排专业评估，并与信任的亲友分享现状以获得支持。',
  },
  severe: {
    label: '重度',
    description: '重度抑郁症状提示较高风险，可能伴随强烈的绝望感或自伤念头。',
    recommendation: '务必立即联系精神卫生专业机构或当地医疗资源，必要时寻求紧急协助。',
  },
}

export const GAD7_SEVERITY_INFO: Record<Gad7Severity, SeverityInfo> = {
  minimal: {
    label: '最轻',
    description: '当前焦虑相关症状处于最轻范围，身心处于相对稳定状态。',
    recommendation: '保持现有的压力管理习惯，如规律运动、放松练习与适度休息。',
  },
  mild: {
    label: '轻度',
    description: '轻度焦虑症状可能在特定情境下加重，但总体可控。',
    recommendation: '尝试呼吸练习、担忧记录与问题解决策略，必要时与专业人士交流。',
  },
  moderate: {
    label: '中度',
    description: '中度焦虑可能导致注意力、睡眠或躯体不适的明显波动。',
    recommendation: '建议尽快向心理咨询或医疗专业人员寻求评估，并结合自助练习持续管理。',
  },
  severe: {
    label: '重度',
    description: '重度焦虑常伴随持续紧张与躯体症状，对生活影响显著。',
    recommendation: '建议尽快联系专业人员进行全面评估，并了解可能的治疗与药物支持。',
  },
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
