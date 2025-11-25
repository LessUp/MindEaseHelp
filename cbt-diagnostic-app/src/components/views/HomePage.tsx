import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, Heart, Sparkles, TrendingUp, Clock, 
  ArrowRight, Wind, Moon, Activity, ChevronRight,
  Smile, Frown, Meh
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { getColor } from '../../lib/colors'

interface HomePageProps {
  onStartAssessment: () => void
}

// ========================================
// 快捷工具卡片
// ========================================
const QUICK_TOOLS = [
  { id: 'breathing', name: '呼吸练习', icon: Wind, color: 'sky', tab: 'tools' as const },
  { id: 'meditation', name: '冥想引导', icon: Moon, color: 'indigo', tab: 'tools' as const },
  { id: 'history', name: '查看记录', icon: Activity, color: 'emerald', tab: 'history' as const },
]

// ========================================
// 心情记录选项
// ========================================
const MOOD_OPTIONS = [
  { value: 5, icon: Smile, label: '很好', color: 'emerald' },
  { value: 3, icon: Meh, label: '一般', color: 'amber' },
  { value: 1, icon: Frown, label: '不好', color: 'rose' },
] as const

export function HomePage({ onStartAssessment }: HomePageProps) {
  const assessments = useAppStore((s) => s.assessments)
  const moods = useAppStore((s) => s.moods)
  const addMood = useAppStore((s) => s.addMood)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  // 获取今日是否已记录心情
  const today = new Date().toDateString()
  const todayMood = moods.find(m => new Date(m.date).toDateString() === today)

  // 获取最近评估
  const latestAssessment = assessments[0]

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了'
    if (hour < 12) return '早上好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  const handleMoodSelect = (value: number) => {
    addMood({
      id: `mood_${Date.now()}`,
      date: Date.now(),
      value,
      synced: false,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20"
    >
      {/* 欢迎区域 */}
      <motion.div variants={itemVariants} className="pt-2">
        <h1 className="text-2xl font-bold text-slate-800">
          {getGreeting()} 👋
        </h1>
        <p className="text-slate-500 mt-1">关注心理健康，从每一天开始</p>
      </motion.div>

      {/* 今日心情 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-violet-50 to-pink-50 border-violet-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-bold text-slate-800">今日心情</span>
            </div>
            {todayMood && (
              <span className="text-xs text-slate-500">已记录</span>
            )}
          </div>
          
          {!todayMood ? (
            <div className="flex justify-around">
              {MOOD_OPTIONS.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <mood.icon 
                    className="w-10 h-10"
                    style={{ color: getColor(mood.color, 500) }}
                  />
                  <span className="text-xs font-medium text-slate-600">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-2">
              {MOOD_OPTIONS.find(m => m.value === todayMood.value)?.icon && (
                React.createElement(
                  MOOD_OPTIONS.find(m => m.value === todayMood.value)!.icon,
                  { 
                    className: "w-8 h-8",
                    style: { color: getColor(MOOD_OPTIONS.find(m => m.value === todayMood.value)!.color, 500) }
                  }
                )
              )}
              <span className="text-slate-600">
                你今天感觉{MOOD_OPTIONS.find(m => m.value === todayMood.value)?.label}
              </span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* 开始评估卡片 */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-600 text-white border-0 shadow-lg shadow-sky-200/50">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-6 h-6" />
                  <span className="font-bold text-lg">心理健康评估</span>
                </div>
                <p className="text-white/80 text-sm">
                  使用专业的PHQ-9和GAD-7量表，了解你的情绪状态
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>约5分钟</span>
              </div>
              <Button
                onClick={onStartAssessment}
                className="bg-white text-sky-600 hover:bg-white/90 shadow-md"
              >
                开始评估
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 快捷工具 */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">快捷工具</h2>
          <button 
            onClick={() => setActiveTab('tools')}
            className="text-sm text-sky-600 flex items-center gap-1"
          >
            全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_TOOLS.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTab(tool.tab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center"
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: getColor(tool.color, 50) }}
              >
                <tool.icon 
                  className="w-6 h-6"
                  style={{ color: getColor(tool.color, 500) }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">{tool.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 最近评估 */}
      {latestAssessment && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">最近评估</h2>
            <button 
              onClick={() => setActiveTab('history')}
              className="text-sm text-sky-600 flex items-center gap-1"
            >
              全部记录
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  {latestAssessment.scaleId === 'PHQ9' ? 'PHQ-9 抑郁筛查' : 'GAD-7 焦虑筛查'}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {new Date(latestAssessment.completedAt).toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">
                  {latestAssessment.totalScore}
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {latestAssessment.severity}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 健康小贴士 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-amber-800 mb-1">今日小贴士</div>
              <p className="text-sm text-amber-700">
                每天花5分钟进行深呼吸练习，可以有效降低焦虑水平，改善睡眠质量。
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
