import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Sparkles, History, User, Brain, Heart } from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { MobileNav } from './MobileNav'
import { HistoryCenter } from '../views/HistoryCenter'
import { ProfileCenter } from '../views/ProfileCenter'
import { TherapyToolbox } from '../features/TherapyToolbox'
import { RelaxTools } from '../features/RelaxTools'
import { cn } from '../../lib/utils'

// ========================================
// 侧边导航项
// ========================================
type TabId = 'home' | 'tools' | 'history' | 'profile'

const NAV_ITEMS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'tools', label: '工具箱', icon: Sparkles },
  { id: 'history', label: '记录', icon: History },
  { id: 'profile', label: '我的', icon: User },
]

// ========================================
// 桌面端侧边导航
// ========================================
function DesktopSidebar() {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-800">MindEase</div>
            <div className="text-xs text-slate-500">心理健康助手</div>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
              activeTab === item.id
                ? "bg-sky-50 text-sky-600"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                layoutId="desktopActiveIndicator"
                className="ml-auto w-1.5 h-5 bg-sky-500 rounded-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Heart className="w-4 h-4 text-rose-500" />
            关爱心理健康
          </div>
          <p className="text-xs text-slate-500">
            如需专业帮助，请及时联系心理咨询师或医生
          </p>
        </div>
      </div>
    </aside>
  )
}

// ========================================
// 工具箱页面
// ========================================
function ToolsPage() {
  const [toolSection, setToolSection] = useState<'therapy' | 'relax'>('therapy')
  
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-amber-500" />
        <h1 className="text-xl font-bold text-slate-800">工具箱</h1>
      </div>

      {/* 切换标签 */}
      <div className="flex bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setToolSection('therapy')}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            toolSection === 'therapy'
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          心理疗法
        </button>
        <button
          onClick={() => setToolSection('relax')}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            toolSection === 'relax'
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          放松工具
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={toolSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {toolSection === 'therapy' ? <TherapyToolbox /> : <RelaxTools />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ========================================
// App Shell Props
// ========================================
interface AppShellProps {
  children: React.ReactNode // 主页内容（评估流程）
  showNav?: boolean
}

// ========================================
// 主组件
// ========================================
export function AppShell({ children, showNav = true }: AppShellProps) {
  const activeTab = useAppStore((s) => s.activeTab)

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return children
      case 'tools':
        return <ToolsPage />
      case 'history':
        return <HistoryCenter />
      case 'profile':
        return <ProfileCenter />
      default:
        return children
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* 桌面端侧边导航 */}
      {showNav && <DesktopSidebar />}

      {/* 主内容区域 */}
      <main className={cn(
        "flex-1 px-4 py-6 md:px-8 md:py-8",
        "max-w-lg mx-auto md:max-w-2xl lg:max-w-3xl",
        showNav && "pb-24 md:pb-8" // 移动端为底部导航留空间
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 移动端底部导航 */}
      {showNav && <MobileNav />}
    </div>
  )
}
