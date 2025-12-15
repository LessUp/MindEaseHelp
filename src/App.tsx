import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import Questionnaire from './components/Questionnaire'
import { Layout } from './components/layout/Layout'
import { Intro } from './components/views/Intro'
import { Result } from './components/views/Result'
import { ProgressBar } from './components/ui/ProgressBar'
import { Button } from './components/ui/Button'

import { useAssessmentFlow } from './app/assessment/useAssessmentFlow'
import { PHQ9_ITEMS, GAD7_ITEMS } from './domain/assessment/scales'
import type { Phq9Severity, Gad7Severity } from './domain/assessment/scoring'

export default function App() {
  const {
    step,
    direction,
    paginate,

    phq9,
    setPhq9,
    gad7,
    setGad7,

    allowLocalSave,
    setAllowLocalSave,
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
  } = useAssessmentFlow()

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

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
                onClick={() => {
                  if (allowLocalSave) saveSnapshot()
                  paginate('result', 1)
                }} 
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
              onRestart={restart}
              onBack={() => paginate('gad7', -1)}
              badgeClass={badgeClass}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
