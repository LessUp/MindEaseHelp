import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, History, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type Phq9Severity, type Gad7Severity } from '../../domain/assessment/scoring';
import { cn } from '../../lib/utils';

type AssessmentSnapshot = {
  ts: number
  phqTotal: number
  gadTotal: number
  phqLevel: Phq9Severity
  gadLevel: Gad7Severity
}

interface IntroProps {
  onStart: () => void;
  allowLocalSave: boolean;
  setAllowLocalSave: (allow: boolean) => void;
  lastSaved: AssessmentSnapshot | null;
  onRestore: () => void;
  onClearHistory: () => void;
  formatTimestamp: (ts: number) => string;
  badgeClass: (s: Phq9Severity | Gad7Severity) => string;
  severityText: (s: Phq9Severity | Gad7Severity) => string;
}

export function Intro({
  onStart,
  allowLocalSave,
  setAllowLocalSave,
  lastSaved,
  onRestore,
  onClearHistory,
  formatTimestamp,
  badgeClass,
  severityText,
}: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-medium border border-sky-100">
              <Sparkles className="w-3 h-3" />
              <span>专业的心理健康自测工具</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              了解您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">情绪状态</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
              本工具整合了国际通用的 <strong>PHQ-9 (抑郁症筛查)</strong> 与 <strong>GAD-7 (焦虑症筛查)</strong> 量表。
              通过简单的自我评估，帮助您了解当前的情绪状态，并提供基于 CBT (认知行为疗法) 的应对建议。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <Button size="lg" onClick={onStart} className="w-full sm:w-auto group bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-300/50">
              开始评估
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 w-full sm:w-auto">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>数据仅本地处理，保护隐私</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="inline-flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-slate-800 transition-colors select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={allowLocalSave}
                onChange={(e) => setAllowLocalSave(e.target.checked)}
              />
              允许在本地浏览器保存历史记录
            </label>
          </div>
        </div>
      </div>

      {lastSaved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="info" className="bg-white/50 backdrop-blur-sm border-blue-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-slate-700">最近评估记录</div>
                  <div className="text-xs text-slate-500">{formatTimestamp(lastSaved.ts)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-1" />
                  清除
                </Button>
                <Button variant="secondary" size="sm" onClick={onRestore}>
                  查看详情
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white border border-slate-100 p-3 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase mb-1">PHQ-9 抑郁</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{lastSaved.phqTotal}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", badgeClass(lastSaved.phqLevel).replace('badge', ''))}>
                    {severityText(lastSaved.phqLevel)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-white border border-slate-100 p-3 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase mb-1">GAD-7 焦虑</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{lastSaved.gadTotal}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", badgeClass(lastSaved.gadLevel).replace('badge', ''))}>
                    {severityText(lastSaved.gadLevel)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
