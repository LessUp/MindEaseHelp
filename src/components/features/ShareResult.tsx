import React, { useRef, useState } from 'react';
import { Download, Share2, X, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { type Phq9Severity, type Gad7Severity } from '../../utils/scoring';

interface ShareResultProps {
  phqTotal: number;
  gadTotal: number;
  phqLevel: Phq9Severity;
  gadLevel: Gad7Severity;
  phqLabel: string;
  gadLabel: string;
  date: string;
}

type CardTheme = 'clean' | 'warm' | 'dark';

const THEMES: Record<CardTheme, { name: string; class: string; text: string }> = {
  clean: {
    name: '专业简约',
    class: 'bg-white border-2 border-slate-100',
    text: 'text-slate-800'
  },
  warm: {
    name: '温暖治愈',
    class: 'bg-gradient-to-br from-orange-50 to-rose-100 border-none',
    text: 'text-rose-900'
  },
  dark: {
    name: '静谧暗夜',
    class: 'bg-slate-900 border-none',
    text: 'text-slate-50'
  }
};

export function ShareResult({ phqTotal, gadTotal, phqLabel, gadLabel, date }: ShareResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<CardTheme>('clean');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Retina display support
        useCORS: true,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `MindEase-Assessment-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        分享结果
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-500" />
                  生成分享卡片
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-slate-50 flex flex-col items-center gap-6">
                {/* Card Preview Area */}
                <div className="relative shadow-xl rounded-xl overflow-hidden">
                  <div 
                    ref={cardRef}
                    className={cn(
                      "w-[320px] p-8 flex flex-col gap-6 aspect-[4/5]",
                      THEMES[theme].class
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
                          M
                        </div>
                        <span className={cn("font-bold text-lg", THEMES[theme].text)}>MindEase</span>
                      </div>
                      <span className={cn("text-xs opacity-60", THEMES[theme].text)}>{date}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center gap-6">
                      <div className={cn("p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20")}>
                        <div className={cn("text-xs uppercase tracking-wider opacity-70 mb-1", THEMES[theme].text)}>PHQ-9 抑郁指数</div>
                        <div className="flex items-baseline gap-3">
                          <span className={cn("text-5xl font-bold", THEMES[theme].text)}>{phqTotal}</span>
                          <span className={cn("text-lg font-medium opacity-90", THEMES[theme].text)}>{phqLabel}</span>
                        </div>
                      </div>

                      <div className={cn("p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20")}>
                        <div className={cn("text-xs uppercase tracking-wider opacity-70 mb-1", THEMES[theme].text)}>GAD-7 焦虑指数</div>
                        <div className="flex items-baseline gap-3">
                          <span className={cn("text-5xl font-bold", THEMES[theme].text)}>{gadTotal}</span>
                          <span className={cn("text-lg font-medium opacity-90", THEMES[theme].text)}>{gadLabel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-black/5">
                      <p className={cn("text-xs opacity-60 text-center leading-relaxed", THEMES[theme].text)}>
                        关注心理健康，拥抱美好生活。<br/>
                        MindEase 助您了解当下状态。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(THEMES) as CardTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all border-2",
                          theme === t 
                            ? "border-sky-500 bg-sky-50 text-sky-700" 
                            : "border-transparent bg-white hover:bg-slate-100 text-slate-600"
                        )}
                      >
                        {THEMES[t].name}
                      </button>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleDownload} 
                    disabled={isGenerating}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200/50"
                  >
                    {isGenerating ? '生成中...' : '保存图片'}
                    {!isGenerating && <Download className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
