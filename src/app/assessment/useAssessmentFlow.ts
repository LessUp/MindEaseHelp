import { useMemo, useState } from 'react'

import { GAD7_ITEMS, PHQ9_ITEMS } from '../../domain/assessment/scales'
import { generateCbtTips } from '../../domain/assessment/cbt'
import {
  gad7Severity,
  gad7Total,
  phq9Severity,
  phq9Total,
  triage,
  GAD7_SEVERITY_INFO,
  PHQ9_SEVERITY_INFO,
  type Gad7Severity,
  type Phq9Severity,
} from '../../domain/assessment/scoring'
import {
  clearLatestSnapshot,
  readAllowLocalSavePreference,
  readLatestSnapshot,
  writeAllowLocalSavePreference,
  writeLatestSnapshot,
  type AssessmentSnapshot,
} from '../../domain/assessment/storage'

export type AssessmentStep = 'intro' | 'phq9' | 'gad7' | 'result'

export function useAssessmentFlow() {
  const [step, setStep] = useState<AssessmentStep>('intro')
  const [direction, setDirection] = useState(0)
  const [phq9, setPhq9] = useState<number[]>(Array(PHQ9_ITEMS.length).fill(-1))
  const [gad7, setGad7] = useState<number[]>(Array(GAD7_ITEMS.length).fill(-1))

  const [allowLocalSave, setAllowLocalSave] = useState<boolean>(readAllowLocalSavePreference)
  const [lastSaved, setLastSaved] = useState<AssessmentSnapshot | null>(readLatestSnapshot)

  const paginate = (newStep: AssessmentStep, newDirection: number) => {
    setDirection(newDirection)
    setStep(newStep)
  }

  const allAnswered = (arr: number[]) => arr.every(v => v >= 0)
  const answeredCount = (arr: number[]) => arr.filter(v => v >= 0).length

  const phqTotal = useMemo(() => phq9Total(phq9.map(v => (v < 0 ? 0 : v))), [phq9])
  const gadTotal = useMemo(() => gad7Total(gad7.map(v => (v < 0 ? 0 : v))), [gad7])
  const phqLevel: Phq9Severity = useMemo(() => phq9Severity(phqTotal), [phqTotal])
  const gadLevel: Gad7Severity = useMemo(() => gad7Severity(gadTotal), [gadTotal])

  const triageRes = useMemo(() => triage(phq9, gad7), [phq9, gad7])
  const tips = useMemo(() => generateCbtTips(phqLevel, gadLevel), [phqLevel, gadLevel])
  const phqInfo = useMemo(() => PHQ9_SEVERITY_INFO[phqLevel], [phqLevel])
  const gadInfo = useMemo(() => GAD7_SEVERITY_INFO[gadLevel], [gadLevel])

  const crisisSupportTips = useMemo(() => {
    if (triageRes.level === 'crisis') {
      return [
        '请立即联系当地紧急服务或就近医院急诊，确保自身安全。',
        '若身边有可信任的人，请寻求他们的陪伴，避免独自一人。',
        '在等待专业人员时，可拨打危机干预热线或使用线上紧急支持渠道。',
      ]
    }
    if (triageRes.level === 'high') {
      return [
        '建议尽快预约心理咨询或精神科医生，讨论评估与治疗选项。',
        '将当前状况告知信任的亲友，建立安全支持计划。',
        '若症状加重或出现危机信号，请及时联系当地紧急服务。',
      ]
    }
    return []
  }, [triageRes])

  const saveSnapshot = () => {
    const payload: AssessmentSnapshot = {
      ts: Date.now(),
      phq9: [...phq9],
      gad7: [...gad7],
      phqTotal,
      gadTotal,
      phqLevel,
      gadLevel,
    }
    writeLatestSnapshot(payload)
    setLastSaved(payload)
  }

  const setAllowLocalSaveWithSnapshot = (allow: boolean) => {
    setAllowLocalSave(allow)
    writeAllowLocalSavePreference(allow)
    if (allow && step === 'result') {
      saveSnapshot()
    }
  }

  const restoreFromLastSaved = () => {
    if (!lastSaved) return
    setPhq9([...lastSaved.phq9])
    setGad7([...lastSaved.gad7])
    paginate('result', 1)
  }

  const clearLocalSnapshot = () => {
    clearLatestSnapshot()
    setLastSaved(null)
  }

  const restart = () => {
    setPhq9(Array(PHQ9_ITEMS.length).fill(-1))
    setGad7(Array(GAD7_ITEMS.length).fill(-1))
    paginate('intro', -1)
  }

  return {
    step,
    direction,
    paginate,

    phq9,
    setPhq9,
    gad7,
    setGad7,

    allowLocalSave,
    setAllowLocalSave: setAllowLocalSaveWithSnapshot,
    lastSaved,
    restoreFromLastSaved,
    clearLocalSnapshot,

    phqTotal,
    gadTotal,
    phqLevel,
    gadLevel,
    triageRes,
    tips,
    phqInfo,
    gadInfo,
    crisisSupportTips,

    saveSnapshot,
    restart,

    allAnswered,
    answeredCount,
  }
}
