import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, RotateCcw, ChevronLeft, ShieldCheck, BrainCircuit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ShareResult } from '../features/ShareResult';
import { CbtTools } from '../features/CbtTools';
import { type Phq9Severity, type Gad7Severity } from '../../utils/scoring';
import { cn } from '../../lib/utils';

// Types (duplicated locally as before, ideally centralized)
type TriageResult = {
  level: 'none' | 'high' | 'crisis'
  reasons: string[]
}

type SeverityInfo = {
  label: string
  description: string
  recommendation: string
}

interface ResultProps {
  phqTotal: number;
  gadTotal: number;
  phqLevel: Phq9Severity;
  gadLevel: Gad7Severity;
  triageRes: TriageResult;
  phqInfo: SeverityInfo;
  gadInfo: SeverityInfo;
  crisisSupportTips: string[];
  tips: string[];
  allowLocalSave: boolean;
  setAllowLocalSave: (v: boolean) => void;
  onRestart: () => void;
  onBack: () => void;
  badgeClass: (s: Phq9Severity | Gad7Severity) => string;
}

export function Result({
  phqTotal,
  gadTotal,
  phqLevel,
  gadLevel,
  triageRes,
  phqInfo,
  gadInfo,
  crisisSupportTips,
  tips,
  allowLocalSave,
  setAllowLocalSave,
  onRestart,
  onBack,
  badgeClass,
}: ResultProps) {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <BrainCircuit className="text-sky-600 w-8 h-8" />
            <span className="flex-1">评估结果分析</span>
            <ShareResult 
              phqTotal={phqTotal} 
              gadTotal={gadTotal}
              phqLevel={phqLevel}
              gadLevel={gadLevel}
              phqLabel={phqInfo.label}
              gadLabel={gadInfo.label}
              date={new Date().toLocaleDateString('zh-CN')}
            />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group relative bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">PHQ-9 抑郁指数</div>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-extrabold text-slate-800 tracking-tight">{phqTotal}</div>
                <div className="flex flex-col items-start">
                  <span className={cn("text-sm px-2.5 py-1 rounded-full font-bold", badgeClass(phqLevel).replace('badge', ''))}>
                    {phqInfo.label}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                {phqInfo.description}
              </div>
            </div>

            <div className="group relative bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GAD-7 焦虑指数</div>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-extrabold text-slate-800 tracking-tight">{gadTotal}</div>
                <div className="flex flex-col items-start">
                  <span className={cn("text-sm px-2.5 py-1 rounded-full font-bold", badgeClass(gadLevel).replace('badge', ''))}>
                    {gadInfo.label}
                  </span>
                </div>
              </div>
               <div className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                {gadInfo.description}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Triage Alerts */}
      <motion.div variants={itemVariants} className="space-y-4">
        {triageRes.level === 'none' ? (
          <div className="flex items-center gap-4 text-emerald-800 bg-emerald-50/80 border border-emerald-100 px-5 py-4 rounded-xl shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-emerald-900">状态良好</div>
              <div className="text-sm opacity-90">未检测到立即的严重风险，请继续保持良好的身心状态。</div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "flex items-start gap-4 px-5 py-4 rounded-xl shadow-sm border",
            triageRes.level === 'crisis' 
              ? "bg-red-50/80 border-red-100 text-red-900" 
              : "bg-amber-50/80 border-amber-100 text-amber-900"
          )}>
            <div className={cn(
              "p-2 rounded-full shrink-0",
              triageRes.level === 'crisis' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            )}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-2">
                {triageRes.level === 'crisis' ? '紧急提醒' : '建议关注'}
                {triageRes.level === 'crisis' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">高风险</span>}
              </div>
              <div className="text-sm opacity-90 leading-relaxed">
                {triageRes.level === 'crisis' 
                  ? '如出现持续的自伤/自杀想法，请立即拨打当地急救电话或前往最近的医院急诊。'
                  : '检测到较高的风险指标，建议尽快联系心理咨询师或医生进行专业评估。'
                }
              </div>
              {triageRes.reasons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-black/5 text-xs opacity-80">
                   <ul className="list-disc pl-4 space-y-1">
                    {triageRes.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Crisis Support Tips */}
      {crisisSupportTips.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card variant="danger" className="bg-red-50/90 border-red-200">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5" />
              安全与求助建议
            </h3>
            <ul className="space-y-2">
              {crisisSupportTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-900">
                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* CBT Tips */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              基于 CBT 的自助建议
            </h3>
          </div>
          <div className="p-6">
            <ul className="grid gap-3">
              {tips.map((t, i) => (
                <li key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-600 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 mt-6 text-center border-t border-slate-100 pt-4">
              注：以上内容仅为健康教育建议，不作为医疗处方。
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Interactive CBT Tools */}
      <motion.div variants={itemVariants}>
        <CbtTools />
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
        <Button variant="ghost" onClick={onBack} className="w-full sm:w-auto text-slate-500 hover:text-slate-900">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回检查
        </Button>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer p-2 rounded hover:bg-slate-100/50">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={allowLocalSave}
              onChange={(e) => setAllowLocalSave(e.target.checked)}
            />
            保存记录
          </label>
          <Button onClick={onRestart} className="w-full sm:w-auto shadow-md shadow-sky-200/50 bg-sky-600 hover:bg-sky-700 text-white">
            <RotateCcw className="w-4 h-4 mr-2" />
            重新评估
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper icon
function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
