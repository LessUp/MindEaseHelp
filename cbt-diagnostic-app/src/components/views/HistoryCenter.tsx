import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, TrendingUp, TrendingDown, Minus, Calendar,
  ChevronRight, Trash2, Filter, BarChart2, Activity
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { getColor, type ColorName } from '../../lib/colors'
import type { AssessmentRecord, ScaleType } from '../../core/types'

// ========================================
// 量表信息映射
// ========================================
const SCALE_INFO: Record<ScaleType, { name: string; color: ColorName; maxScore: number }> = {
  PHQ9: { name: 'PHQ-9 抑郁', color: 'sky', maxScore: 27 },
  GAD7: { name: 'GAD-7 焦虑', color: 'emerald', maxScore: 21 },
  PSS10: { name: 'PSS-10 压力', color: 'amber', maxScore: 40 },
  PSQI: { name: 'PSQI 睡眠', color: 'indigo', maxScore: 21 },
  SAS: { name: 'SAS 焦虑', color: 'rose', maxScore: 80 },
  SDS: { name: 'SDS 抑郁', color: 'purple', maxScore: 80 },
}

// ========================================
// 分数图表组件
// ========================================
interface ScoreChartProps {
  data: { date: string; score: number }[]
  maxScore: number
  color: ColorName
}

function ScoreChart({ data, maxScore, color }: ScoreChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
        暂无数据
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.score), maxScore * 0.5)
  const bgColor = getColor(color, 500)
  
  return (
    <div className="h-40 flex items-end gap-2 px-2 pt-4">
      {data.map((item, idx) => {
        const height = Math.max((item.score / maxValue) * 100, 8)
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-[10px] text-slate-500 font-medium">{item.score}</div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="w-full rounded-t-md min-h-[8px]"
              style={{ backgroundColor: bgColor }}
            />
            <span className="text-[10px] text-slate-400 truncate w-full text-center">
              {item.date.slice(5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ========================================
// 趋势指示器
// ========================================
function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'worsening' }) {
  const config = {
    improving: { icon: TrendingDown, color: 'text-emerald-500', label: '改善中' },
    stable: { icon: Minus, color: 'text-slate-400', label: '稳定' },
    worsening: { icon: TrendingUp, color: 'text-rose-500', label: '需关注' },
  }
  const { icon: Icon, color, label } = config[trend]
  
  return (
    <span className={cn("flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// ========================================
// 单条记录卡片
// ========================================
interface RecordCardProps {
  record: AssessmentRecord
  onDelete: (id: string) => void
}

function RecordCard({ record, onDelete }: RecordCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const scaleInfo = SCALE_INFO[record.scaleId] || { name: record.scaleId, color: 'slate' as ColorName, maxScore: 100 }
  const percentage = Math.round((record.totalScore / scaleInfo.maxScore) * 100)
  const bgColor = getColor(scaleInfo.color, 500)
  const bgLightColor = getColor(scaleInfo.color, 50)
  const textColor = getColor(scaleInfo.color, 700)
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-slate-800">{scaleInfo.name}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" />
            {new Date(record.completedAt).toLocaleString('zh-CN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{record.totalScore}</div>
          <div className="text-xs text-slate-400">/ {scaleInfo.maxScore}</div>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: bgColor }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: bgLightColor, color: textColor }}
        >
          {record.severity}
        </span>
        
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              取消
            </button>
            <button
              onClick={() => onDelete(record.id)}
              className="px-3 py-1 text-xs text-white bg-rose-500 hover:bg-rose-600 rounded-lg font-medium"
            >
              删除
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ========================================
// 主组件
// ========================================
export function HistoryCenter() {
  const assessments = useAppStore((s) => s.assessments)
  const deleteAssessment = useAppStore((s) => s.deleteAssessment)
  const [selectedScale, setSelectedScale] = useState<ScaleType | 'all'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')

  // 筛选记录
  const filteredRecords = useMemo(() => {
    if (selectedScale === 'all') return assessments
    return assessments.filter(r => r.scaleId === selectedScale)
  }, [assessments, selectedScale])

  // 获取有记录的量表类型
  const availableScales = useMemo(() => {
    const scales = new Set(assessments.map(r => r.scaleId))
    return Array.from(scales) as ScaleType[]
  }, [assessments])

  // 计算统计数据
  const stats = useMemo(() => {
    if (selectedScale === 'all' || filteredRecords.length === 0) return null
    
    const scores = filteredRecords.map(r => r.totalScore)
    const recent = filteredRecords.slice(0, 5)
    const older = filteredRecords.slice(5, 10)
    
    let trend: 'improving' | 'stable' | 'worsening' = 'stable'
    if (recent.length >= 2 && older.length >= 2) {
      const recentAvg = recent.reduce((a, r) => a + r.totalScore, 0) / recent.length
      const olderAvg = older.reduce((a, r) => a + r.totalScore, 0) / older.length
      const diff = recentAvg - olderAvg
      if (diff < -2) trend = 'improving'
      else if (diff > 2) trend = 'worsening'
    }
    
    return {
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
      min: Math.min(...scores),
      max: Math.max(...scores),
      count: scores.length,
      trend,
    }
  }, [filteredRecords, selectedScale])

  // 图表数据
  const chartData = useMemo(() => {
    return filteredRecords.slice(0, 10).map(r => ({
      date: new Date(r.completedAt).toLocaleDateString('zh-CN'),
      score: r.totalScore,
    })).reverse()
  }, [filteredRecords])

  if (assessments.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <History className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">暂无评估记录</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          完成心理评估后，你的记录将在这里显示，帮助你追踪心理健康变化
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <History className="w-6 h-6 text-sky-500" />
          评估记录
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === 'list' ? "bg-sky-100 text-sky-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Activity className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === 'chart' ? "bg-sky-100 text-sky-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 量表筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedScale('all')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedScale === 'all'
              ? "bg-sky-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          全部
        </button>
        {availableScales.map(scale => (
          <button
            key={scale}
            onClick={() => setSelectedScale(scale)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedScale === scale
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {SCALE_INFO[scale]?.name || scale}
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      {stats && (
        <Card className="bg-gradient-to-br from-sky-50 to-emerald-50 border-sky-100">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.average}</div>
              <div className="text-xs text-slate-500">平均分</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.min}</div>
              <div className="text-xs text-slate-500">最低</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-500">{stats.max}</div>
              <div className="text-xs text-slate-500">最高</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.count}</div>
              <div className="text-xs text-slate-500">次数</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
            <span className="text-sm text-slate-600">趋势分析</span>
            <TrendIndicator trend={stats.trend} />
          </div>
        </Card>
      )}

      {/* 图表视图 */}
      {viewMode === 'chart' && selectedScale !== 'all' && (
        <Card>
          <h3 className="font-bold text-slate-700 mb-4">得分趋势</h3>
          <ScoreChart
            data={chartData}
            maxScore={SCALE_INFO[selectedScale]?.maxScore || 100}
            color={SCALE_INFO[selectedScale]?.color || 'sky'}
          />
        </Card>
      )}

      {/* 记录列表 */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredRecords.map(record => (
            <RecordCard
              key={record.id}
              record={record}
              onDelete={deleteAssessment}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
