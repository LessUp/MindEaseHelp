import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import Questionnaire from './components/Questionnaire'
import { Layout } from './components/layout/Layout'
import { Intro } from './components/views/Intro'
import { Result } from './components/views/Result'
import { ProgressBar } from './components/ui/ProgressBar'
import { Button } from './components/ui/Button'

import { PHQ9_ITEMS, GAD7_ITEMS } from './data/scales'
import {
  phq9Total,
  gad7Total,
  phq9Severity,
  gad7Severity,
  type Phq9Severity,
  type Gad7Severity,
  triage,
  PHQ9_SEVERITY_INFO,
  GAD7_SEVERITY_INFO,
} from './utils/scoring'
import { generateCbtTips } from './utils/cbt'

type Step = 'intro' | 'phq9' | 'gad7' | 'result'

type AssessmentSnapshot = {
  ts: number
  phq9: number[]
  gad7: number[]
  phqTotal: number
  gadTotal: number
  phqLevel: Phq9Severity
  gadLevel: Gad7Severity
}

export default function App() {
  const [step, setStep] = useState<Step>('intro')
  const [direction, setDirection] = useState(0)
  const [phq9, setPhq9] = useState<number[]>(Array(PHQ9_ITEMS.length).fill(-1))
  const [gad7, setGad7] = useState<number[]>(Array(GAD7_ITEMS.length).fill(-1))

  const [allowLocalSave, setAllowLocalSave] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<AssessmentSnapshot | null>(null)

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const paginate = (newStep: Step, newDirection: number) => {
    setDirection(newDirection)
    setStep(newStep)
  }

  // Derived
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

  const validateSnapshot = (raw: unknown): raw is AssessmentSnapshot => {
    if (typeof raw !== 'object' || raw === null) return false
    const snapshot = raw as Partial<AssessmentSnapshot>
    const isValidResponses = (arr: unknown, length: number) =>
      Array.isArray(arr) && arr.length === length && arr.every(v => typeof v === 'number')
    return (
      typeof snapshot.ts === 'number' &&
      isValidResponses(snapshot.phq9, PHQ9_ITEMS.length) &&
      isValidResponses(snapshot.gad7, GAD7_ITEMS.length) &&
      typeof snapshot.phqTotal === 'number' &&
      typeof snapshot.gadTotal === 'number' &&
      typeof snapshot.phqLevel === 'string' &&
      typeof snapshot.gadLevel === 'string'
    )
  }

  const loadLatestSnapshot = () => {
    try {
      const raw = localStorage.getItem('cbt-diagnostic-latest')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (validateSnapshot(parsed)) {
        setLastSaved(parsed)
      }
    } catch {}
  }

  useEffect(() => {
    try {
      const pref = localStorage.getItem('cbt-diagnostic-allow-save')
      if (pref === 'true') {
        setAllowLocalSave(true)
      }
    } catch {}
    loadLatestSnapshot()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cbt-diagnostic-allow-save', allowLocalSave ? 'true' : 'false')
    } catch {}
  }, [allowLocalSave])

  useEffect(() => {
    if (!allowLocalSave) return
    // Don't save if we are not in result step or if data is incomplete
    if (step !== 'result') return

    try {
      const payload = {
        ts: Date.now(),
        phq9,
        gad7,
        phqTotal,
        gadTotal,
        phqLevel,
        gadLevel,
      }
      localStorage.setItem('cbt-diagnostic-latest', JSON.stringify(payload))
      setLastSaved(payload)
    } catch {}
  }, [step, allowLocalSave, phq9, gad7, phqTotal, gadTotal, phqLevel, gadLevel])

  const allAnswered = (arr: number[]) => arr.every(v => v >= 0)
  const answeredCount = (arr: number[]) => arr.filter(v => v >= 0).length

  const severityText = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal': return '最轻'
      case 'mild': return '轻度'
      case 'moderate': return '中度'
      case 'moderately_severe': return '中重度'
      case 'severe': return '重度'
    }
  }

  const badgeClass = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal': return 'badge badge-success bg-emerald-100 text-emerald-800'
      case 'mild': return 'badge bg-blue-100 text-blue-800'
      case 'moderate': return 'badge badge-warning bg-amber-100 text-amber-800'
      case 'moderately_severe':
      case 'severe': return 'badge badge-danger bg-red-100 text-red-800'
    }
  }

  const formatTimestamp = (ts: number) =>
    new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(ts)

  const handleRestart = () => {
    setPhq9(Array(PHQ9_ITEMS.length).fill(-1))
    setGad7(Array(GAD7_ITEMS.length).fill(-1))
    paginate('intro', -1)
  }

  const restoreFromLastSaved = () => {
    if (!lastSaved) return
    setPhq9([...lastSaved.phq9])
    setGad7([...lastSaved.gad7])
    paginate('result', 1)
  }

  // Animation variants for page transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  return (
    <Layout>
      <AnimatePresence mode="wait" custom={direction}>
        {step === 'intro' && (
          <motion.div
            key="intro"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <Intro
              onStart={() => paginate('phq9', 1)}
              allowLocalSave={allowLocalSave}
              setAllowLocalSave={setAllowLocalSave}
              lastSaved={lastSaved}
              onRestore={restoreFromLastSaved}
              onClearHistory={clearLocalSnapshot}
              formatTimestamp={formatTimestamp}
              badgeClass={badgeClass}
              severityText={severityText}
            />
          </motion.div>
        )}

        {step === 'phq9' && (
          <motion.div
            key="phq9"
            className="space-y-6"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <ProgressBar current={answeredCount(phq9)} total={PHQ9_ITEMS.length} />
            <Questionnaire
              title="第一部分：PHQ-9"
              subtitle="请根据过去两周内的实际感受，回答以下问题。"
              items={PHQ9_ITEMS}
              responses={phq9}
              onChange={(index, value) =>
                setPhq9(prev => prev.map((v, i) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => paginate('intro', -1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <Button 
                onClick={() => paginate('gad7', 1)} 
                disabled={!allAnswered(phq9)}
                className="w-32"
              >
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'gad7' && (
          <motion.div
            key="gad7"
            className="space-y-6"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <ProgressBar current={answeredCount(gad7)} total={GAD7_ITEMS.length} />
            <Questionnaire
              title="第二部分：GAD-7"
              subtitle="请根据过去两周内的实际感受，回答以下问题。"
              items={GAD7_ITEMS}
              responses={gad7}
              onChange={(index, value) =>
                setGad7(prev => prev.map((v, i) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => paginate('phq9', -1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              <Button 
                onClick={() => paginate('result', 1)} 
                disabled={!allAnswered(gad7)}
                className="w-32"
              >
                查看结果
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <Result
              phqTotal={phqTotal}
              gadTotal={gadTotal}
              phqLevel={phqLevel}
              gadLevel={gadLevel}
              triageRes={triageRes}
              phqInfo={phqInfo}
              gadInfo={gadInfo}
              crisisSupportTips={crisisSupportTips}
              tips={tips}
              allowLocalSave={allowLocalSave}
              setAllowLocalSave={setAllowLocalSave}
              onRestart={handleRestart}
              onBack={() => paginate('gad7', -1)}
              badgeClass={badgeClass}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
