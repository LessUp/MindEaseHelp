import React from 'react';
import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-sky-500 to-emerald-500 p-2 rounded-lg text-white shadow-md shadow-sky-200">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            MindEase <span className="font-normal text-slate-400">Help</span>
          </div>
        </div>
        <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
          Beta v0.1
        </div>
      </div>
    </header>
  );
}
