import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, RotateCcw, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
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
  badgeClass: (s: string) => string;
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
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-6 h-6" />
            评估完成：结果总览
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">PHQ-9 抑郁指数</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-4xl font-bold text-slate-800">{phqTotal}</div>
                <span className={cn("text-sm px-2.5 py-0.5 rounded-full font-medium", badgeClass(phqLevel).replace('badge', ''))}>
                  {phqInfo.label}
                </span>
              </div>
            </div>
            <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">GAD-7 焦虑指数</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-4xl font-bold text-slate-800">{gadTotal}</div>
                <span className={cn("text-sm px-2.5 py-0.5 rounded-full font-medium", badgeClass(gadLevel).replace('badge', ''))}>
                  {gadInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Triage Alerts */}
          <div className="space-y-2">
            {triageRes.level === 'none' && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-lg text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                未检测到立即的严重风险，请继续保持良好的身心状态。
              </div>
            )}
            {triageRes.level === 'high' && (
              <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 px-4 py-3 rounded-lg text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong>建议关注：</strong> 检测到较高的风险指标，建议尽快联系心理咨询师或医生进行专业评估。
                </div>
              </div>
            )}
            {triageRes.level === 'crisis' && (
              <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong>紧急提醒：</strong> 如出现持续的自伤/自杀想法，请立即拨打当地急救电话或前往最近的医院急诊。
                </div>
              </div>
            )}
            
            {triageRes.reasons.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="text-xs font-medium text-slate-500 mb-2">风险提示详情：</div>
                 <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                  {triageRes.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Crisis Support Tips */}
      {crisisSupportTips.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card variant="danger" className="bg-red-50/80">
            <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5" />
              安全与求助建议
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-red-800/90">
              {crisisSupportTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Detailed Analysis */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-500" />
            PHQ-9 症状解读
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{phqInfo.description}</p>
          <div className="bg-sky-50 rounded-lg p-3 text-sm text-sky-900">
            <strong>建议：</strong> {phqInfo.recommendation}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" />
            GAD-7 症状解读
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{gadInfo.description}</p>
          <div className="bg-emerald-50 rounded-lg p-3 text-sm text-emerald-900">
            <strong>建议：</strong> {gadInfo.recommendation}
          </div>
        </Card>
      </motion.div>

      {/* CBT Tips */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-slate-50">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">基于 CBT 的自助建议</h3>
          <ul className="space-y-3">
            {tips.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-4 text-center">
            注：以上内容仅为健康教育建议，不作为医疗处方。
          </p>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Button variant="ghost" onClick={onBack} className="w-full sm:w-auto">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回检查
        </Button>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={allowLocalSave}
              onChange={(e) => setAllowLocalSave(e.target.checked)}
            />
            保存记录
          </label>
          <Button onClick={onRestart} className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            重新评估
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper icon component needed only here for now
function ShieldCheck({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
