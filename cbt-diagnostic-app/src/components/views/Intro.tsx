import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, History, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type Phq9Severity, type Gad7Severity } from '../../utils/scoring';

// Redefining types locally to avoid circular deps or if not exported
// Ideally these should be imported from a shared types file
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
  badgeClass: (s: string) => string;
  severityText: (s: string) => string;
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
      className="space-y-6"
    >
      <Card className="space-y-6 shadow-md border-slate-200/60">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            CBT 认知行为疗法自助评估
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            本工具整合了国际通用的 <strong>PHQ-9 (抑郁症筛查)</strong> 与 <strong>GAD-7 (焦虑症筛查)</strong> 量表。
            通过简单的自我评估，帮助您了解当前的情绪状态，并提供基于 CBT (认知行为疗法) 的应对建议。
          </p>
          
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 text-sm text-blue-800 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600" />
              <div>
                <strong>隐私说明：</strong>
                您的所有评估数据默认仅在本地浏览器处理，绝不会上传至任何服务器。
              </div>
            </div>
          </div>

          <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5 marker:text-slate-400">
            <li>预计耗时：3-5 分钟</li>
            <li>适用人群：18岁及以上成年人</li>
            <li>注意：本结果仅供参考，不能替代专业医生的临床诊断</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-100">
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto group">
            开始评估
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors p-2 rounded hover:bg-slate-50">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={allowLocalSave}
              onChange={(e) => setAllowLocalSave(e.target.checked)}
            />
            允许在本地保存历史记录
          </label>
        </div>
      </Card>

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
