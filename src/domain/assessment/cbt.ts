import type { Phq9Severity, Gad7Severity } from './scoring'

export function generateCbtTips(phq: Phq9Severity, gad: Gad7Severity): string[] {
  const tips: string[] = []

  const common = [
    '建立日常作息与规律睡眠：固定起床/入睡时间，逐步减少晚间屏幕暴露',
    '行为激活：列出3个微小、可完成的有益活动（如10分钟散步/淋浴/整理桌面），按难度从易到难完成',
    '担忧记录与分时处理：把担忧写下，安排每天固定10-20分钟“担忧时间”，其余时间遇到担忧先搁置',
    '证据法与替代想法：对反复出现的负性自动想法，分别写下支持与反驳证据，形成更平衡的替代想法',
  ]
  tips.push(...common)

  if (phq === 'moderate' || phq === 'moderately_severe' || phq === 'severe') {
    tips.push('行为激活分级计划：把有意义的活动按难度分级，每天按阶梯递进')
    tips.push('愉快活动日记：记录每日完成的活动与情绪评分，观察“活动-情绪”关系')
  }

  if (gad === 'moderate' || gad === 'severe') {
    tips.push('呼吸/地面化技巧：4-6呼吸、5-4-3-2-1感官练习，降低生理唤醒')
    tips.push('概率重估：把担忧事件的真实概率进行量化估计，并准备若发生时的具体应对步骤')
  }

  tips.push('如症状持续或影响功能，请尽快寻求专业帮助（心理咨询/精神科）')

  return tips
}
