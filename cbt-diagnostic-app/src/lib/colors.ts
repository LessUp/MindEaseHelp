/**
 * 颜色映射工具
 * 解决Tailwind动态类名无法编译的问题
 */

// 预定义的颜色映射
export const COLOR_MAP = {
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
  },
} as const

export type ColorName = keyof typeof COLOR_MAP
export type ColorShade = keyof typeof COLOR_MAP.sky

/**
 * 获取颜色值
 */
export function getColor(name: ColorName, shade: ColorShade = 500): string {
  return COLOR_MAP[name]?.[shade] || COLOR_MAP.sky[shade]
}

/**
 * 获取颜色的完整样式对象
 */
export function getColorStyles(name: ColorName) {
  const colors = COLOR_MAP[name] || COLOR_MAP.sky
  return {
    bg50: colors[50],
    bg100: colors[100],
    bg200: colors[200],
    bg500: colors[500],
    text500: colors[500],
    text600: colors[600],
    text700: colors[700],
    border200: colors[200],
  }
}

/**
 * 量表颜色配置
 */
export const SCALE_COLORS = {
  PHQ9: 'sky',
  GAD7: 'emerald',
  PSS10: 'amber',
  PSQI: 'indigo',
  SAS: 'rose',
  SDS: 'purple',
} as const

/**
 * 疗法颜色配置
 */
export const THERAPY_COLORS = {
  CBT: 'blue',
  DBT: 'purple',
  ACT: 'green',
  IPT: 'orange',
  Gestalt: 'teal',
  Mindfulness: 'indigo',
} as const
