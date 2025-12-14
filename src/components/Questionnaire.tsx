import React from 'react';
import { motion } from 'framer-motion';
import { COMMON_OPTIONS } from '../data/scales';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

interface Props {
  title: string;
  subtitle?: string;
  items: string[];
  responses: number[];
  onChange: (index: number, value: number) => void;
}

export default function Questionnaire({ title, subtitle, items, responses, onChange }: Props) {
  return (
    <Card className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className="space-y-8">
        {items.map((q, idx) => (
          <motion.div 
            key={idx} 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="font-medium text-lg text-slate-800">
              <span className="inline-block w-6 text-slate-400 font-normal">{idx + 1}.</span>
              {q}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pl-0 sm:pl-6">
              {COMMON_OPTIONS.map(opt => {
                const isSelected = responses[idx] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange(idx, opt.value)}
                    className={cn(
                      "relative flex items-center justify-center px-4 py-3 rounded-xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-1 group",
                      isSelected 
                        ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md shadow-sky-100" 
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId={`indicator-${idx}`}
                        className="absolute inset-0 rounded-xl border-2 border-sky-500 pointer-events-none"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
