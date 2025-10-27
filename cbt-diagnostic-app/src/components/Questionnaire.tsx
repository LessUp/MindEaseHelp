import React from 'react'
import { COMMON_OPTIONS } from '../data/scales'

interface Props {
  title: string
  subtitle?: string
  items: string[]
  responses: number[]
  onChange: (index: number, value: number) => void
}

export default function Questionnaire({ title, subtitle, items, responses, onChange }: Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 mb-4">{subtitle}</p>}
      <div className="space-y-4">
        {items.map((q, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-4">
            <div className="mb-3 font-medium">{idx + 1}. {q}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_OPTIONS.map(opt => {
                const id = `${title}-${idx}-${opt.value}`
                const name = `${title}-${idx}`
                return (
                  <label key={opt.value} htmlFor={id} className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 ${responses[idx] === opt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                    <input
                      id={id}
                      type="radio"
                      className="accent-blue-600"
                      name={name}
                      checked={responses[idx] === opt.value}
                      onChange={() => onChange(idx, opt.value)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
