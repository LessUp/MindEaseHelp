import React, { useEffect, useMemo, useState } from 'react'
import Questionnaire from './components/Questionnaire'
import { PHQ9_ITEMS, GAD7_ITEMS } from './data/scales'
import {
  phq9Total,
  gad7Total,
  phq9Severity,
  gad7Severity,
  type Phq9Severity,
  type Gad7Severity,
  triage,
} from './utils/scoring'
import { generateCbtTips } from './utils/cbt'

type Step = 'intro' | 'phq9' | 'gad7' | 'result'

export default function App() {
  const [step, setStep] = useState<Step>('intro')
  const [phq9, setPhq9] = useState<number[]>(Array(PHQ9_ITEMS.length).fill(-1))
  const [gad7, setGad7] = useState<number[]>(Array(GAD7_ITEMS.length).fill(-1))

  const [allowLocalSave, setAllowLocalSave] = useState<boolean>(false)

  // Derived
  const phqTotal = useMemo(() => phq9Total(phq9.map(v => (v < 0 ? 0 : v))), [phq9])
  const gadTotal = useMemo(() => gad7Total(gad7.map(v => (v < 0 ? 0 : v))), [gad7])
  const phqLevel: Phq9Severity = useMemo(() => phq9Severity(phqTotal), [phqTotal])
  const gadLevel: Gad7Severity = useMemo(() => gad7Severity(gadTotal), [gadTotal])
  const triageRes = useMemo(() => triage(phq9, gad7), [phq9, gad7])
  const tips = useMemo(() => generateCbtTips(phqLevel, gadLevel), [phqLevel, gadLevel])

  useEffect(() => {
    if (!allowLocalSave) return
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
    } catch {}
  }, [allowLocalSave, phq9, gad7, phqTotal, gadTotal, phqLevel, gadLevel])

  const allAnswered = (arr: number[]) => arr.every(v => v >= 0)

  const severityText = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal':
        return '最轻'
      case 'mild':
        return '轻度'
      case 'moderate':
        return '中度'
      case 'moderately_severe':
        return '中重度'
      case 'severe':
        return '重度'
    }
  }

  const badgeClass = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal':
        return 'badge badge-success'
      case 'mild':
        return 'badge'
      case 'moderate':
        return 'badge badge-warning'
      case 'moderately_severe':
      case 'severe':
        return 'badge badge-danger'
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto container-narrow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
            <div className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-600">
              CBT 评估与建议
            </div>
          </div>
          <div className="text-xs text-slate-500">v0.1 本地运行</div>
        </div>
      </header>

      <main className="mx-auto container-narrow px-4 py-6 space-y-6">
        {step === 'intro' && (
          <div className="card space-y-4">
            <h1 className="text-2xl font-bold">认知行为疗法（CBT）自助评估</h1>
            <p className="text-slate-700 text-sm leading-6">
              本工具整合 PHQ-9 与 GAD-7 量表，用于自我筛查抑郁与焦虑症状强度，并给出教育性建议，不能替代专业诊断与治疗。
            </p>
            <ul className="text-slate-700 text-sm list-disc pl-5 space-y-1">
              <li>预计耗时 3-5 分钟；数据默认只在本地处理，不会上传。</li>
              <li>若出现持续的自伤/自杀想法或计划，请立即联系当地紧急服务或就近医院急诊。</li>
            </ul>
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" onClick={() => setStep('phq9')}>开始评估</button>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={allowLocalSave}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowLocalSave(e.target.checked)}
                />
                允许在本地保存结果
              </label>
            </div>
            <p className="text-xs text-slate-500">提示：启用本地保存后，可在同一设备浏览器中查看最近一次结果。</p>
          </div>
        )}

        {step === 'phq9' && (
          <>
            <Questionnaire
              title="PHQ-9 抑郁症状筛查"
              subtitle="过去两周内，这些问题对你造成的困扰频率？"
              items={PHQ9_ITEMS}
              responses={phq9}
              onChange={(index: number, value: number) =>
                setPhq9((prev: number[]) => prev.map((v: number, i: number) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('intro')}>返回</button>
              <button className="btn btn-primary" onClick={() => setStep('gad7')} disabled={!allAnswered(phq9)}>下一步</button>
            </div>
          </>
        )}

        {step === 'gad7' && (
          <>
            <Questionnaire
              title="GAD-7 广泛性焦虑筛查"
              subtitle="过去两周内，这些问题对你造成的困扰频率？"
              items={GAD7_ITEMS}
              responses={gad7}
              onChange={(index: number, value: number) =>
                setGad7((prev: number[]) => prev.map((v: number, i: number) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('phq9')}>上一步</button>
              <button className="btn btn-primary" onClick={() => setStep('result')} disabled={!allAnswered(gad7)}>查看结果</button>
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            <div className="card space-y-3">
              <h2 className="text-xl font-semibold">结果总览</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-slate-600">PHQ-9</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-2xl font-bold">{phqTotal}</div>
                    <span className={badgeClass(phqLevel)}>{severityText(phqLevel)}</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-slate-600">GAD-7</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-2xl font-bold">{gadTotal}</div>
                    <span className={badgeClass(gadLevel)}>{severityText(gadLevel)}</span>
                  </div>
                </div>
              </div>

              {triageRes.level === 'none' && (
                <div className="badge">未检测到立即风险</div>
              )}
              {triageRes.level === 'high' && (
                <div className="badge badge-warning">建议尽快联系专业人员进行评估</div>
              )}
              {triageRes.level === 'crisis' && (
                <div className="badge badge-danger">如出现持续的自伤/自杀想法或计划，请立即联系当地紧急服务或就近医院急诊</div>
              )}
              {triageRes.reasons.length > 0 && (
                <ul className="text-sm text-slate-700 list-disc pl-5">
                  {triageRes.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">基于 CBT 的自助建议</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-3">本内容仅用于健康教育与自助管理，不能替代专业评估与治疗。</p>
            </div>

            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('gad7')}>上一步</button>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={allowLocalSave}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowLocalSave(e.target.checked)}
                  />
                  允许在本地保存结果
                </label>
                <button
                  className="btn"
                  onClick={() => {
                    setPhq9(Array(PHQ9_ITEMS.length).fill(-1))
                    setGad7(Array(GAD7_ITEMS.length).fill(-1))
                    setStep('intro')
                  }}
                >重新开始</button>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto container-narrow px-4 py-8 text-xs text-slate-500">
        <div>免责声明：本应用不提供医疗诊断或紧急服务。如遇危机，请立即联系当地紧急服务或就近医院急诊。</div>
      </footer>
    </div>
  )
}
