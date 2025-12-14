import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Brain, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Sparkles, Headphones, Play, Square } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

// --- Box Breathing Component ---
const BoxBreathing = () => {
  const [status, setStatus] = useState<'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('idle');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (status === 'idle') return;

    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else {
      // Cycle transitions
      setCountdown(4);
      switch (status) {
        case 'inhale': setStatus('hold-in'); break;
        case 'hold-in': setStatus('exhale'); break;
        case 'exhale': setStatus('hold-out'); break;
        case 'hold-out': setStatus('inhale'); break;
      }
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const getInstruction = () => {
    switch (status) {
      case 'idle': return '点击开始';
      case 'inhale': return '吸气 (Inhale)';
      case 'hold-in': return '屏气 (Hold)';
      case 'exhale': return '呼气 (Exhale)';
      case 'hold-out': return '屏气 (Hold)';
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        
        {/* Animated Circle */}
        <motion.div
          animate={{
            scale: status === 'inhale' ? 1.5 : status === 'exhale' ? 1 : undefined,
            borderColor: status === 'hold-in' || status === 'hold-out' ? '#0ea5e9' : '#10b981', // sky-500 vs emerald-500
          }}
          transition={{ duration: 4, ease: "linear" }}
          className={cn(
            "w-24 h-24 rounded-full border-4 flex items-center justify-center",
            status === 'idle' ? "border-slate-300" : "border-emerald-500 bg-emerald-50/30"
          )}
        >
          <span className="text-2xl font-bold text-slate-700">
            {status === 'idle' ? <Wind className="w-8 h-8 text-slate-400" /> : countdown}
          </span>
        </motion.div>
        
        {/* Orbiting Dot (Visual Guide) */}
        {status !== 'idle' && (
           <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
           >
             <div className="w-3 h-3 bg-sky-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 shadow-md shadow-sky-200" />
           </motion.div>
        )}
      </div>

      <div className="mt-6 text-center space-y-4">
        <h4 className="text-xl font-bold text-slate-800 transition-all min-w-[120px]">
          {getInstruction()}
        </h4>
        <p className="text-sm text-slate-500 max-w-xs">
          {status === 'idle' 
            ? '四箱呼吸法能帮助快速平复情绪，减轻焦虑反应。' 
            : '跟随圆圈的节奏，专注于呼吸本身。'}
        </p>
        <Button 
          onClick={() => setStatus(status === 'idle' ? 'inhale' : 'idle')}
          variant={status === 'idle' ? 'primary' : 'outline'}
          className="w-32 mx-auto"
        >
          {status === 'idle' ? '开始练习' : '停止'}
        </Button>
      </div>
    </div>
  );
};

// --- Meditation Guide Component ---
const MeditationGuide = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    // Determine phase based on time left (Total 180s)
    // 180-120: Phase 0 (Prepare & Breath)
    // 120-60: Phase 1 (Body Scan)
    // 60-0: Phase 2 (Mindfulness)
    if (timeLeft > 120) setPhase(0);
    else if (timeLeft > 60) setPhase(1);
    else if (timeLeft > 0) setPhase(2);
    else setPhase(3); // Finished
  }, [timeLeft]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      if (timeLeft === 0) setTimeLeft(180);
      setIsActive(true);
    }
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(180);
    setPhase(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    if (timeLeft === 0) return "练习完成。感受此刻的平静。";
    switch (phase) {
      case 0: return "调整坐姿，轻轻闭上眼睛。将注意力集中在呼吸上，感受空气的进出。";
      case 1: return "从头顶开始，缓慢向下扫描身体。放松紧绷的肌肉，肩膀下沉，眉头舒展。";
      case 2: return "观察此刻的念头，像观察天空中的云彩一样。不评判，只是静静看着它们飘过。";
      default: return "准备开始...";
    }
  };

  return (
    <div className="flex flex-col items-center py-6 space-y-6">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent"
          animate={{ rotate: isActive ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-3xl font-bold text-slate-700 font-mono">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="text-center max-w-md space-y-2 min-h-[80px]">
        <h4 className="text-lg font-bold text-indigo-900">
          {timeLeft === 0 ? "完成" : ["专注呼吸", "身体扫描", "正念观察"][phase]}
        </h4>
        <p className="text-slate-600 leading-relaxed transition-all duration-500">
          {getPhaseText()}
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={toggleTimer}
          className={cn("min-w-[100px]", isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700")}
        >
          {isActive ? <span className="flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> 暂停</span> : <span className="flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> {timeLeft < 180 && timeLeft > 0 ? "继续" : "开始"}</span>}
        </Button>
        <Button variant="outline" onClick={reset} disabled={timeLeft === 180}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// --- White Noise Player Component ---
const WhiteNoisePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioCtx]);

  const togglePlay = () => {
    if (isPlaying) {
      // Stop
      audioCtx?.suspend();
      setIsPlaying(false);
    } else {
      // Start
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        
        // Create Brown Noise
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Compensate for gain
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        
        const gain = ctx.createGain();
        gain.gain.value = 0.5; // Initial volume
        
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start(0);

        setAudioCtx(ctx);
        setIsPlaying(true);
      } else {
        audioCtx.resume();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      <div className={cn(
        "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700",
        isPlaying ? "bg-sky-100 shadow-lg shadow-sky-200 scale-110" : "bg-slate-100"
      )}>
        <Headphones className={cn(
          "w-12 h-12 transition-colors duration-500",
          isPlaying ? "text-sky-600" : "text-slate-400"
        )} />
      </div>

      <div className="text-center space-y-2">
        <h4 className="text-lg font-bold text-slate-800">
          {isPlaying ? "正在播放：温和褐噪" : "白噪音疗愈"}
        </h4>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          褐噪（Brown Noise）比白噪音更低沉柔和，像远处的雷声或海浪，能有效屏蔽环境干扰，帮助放松。
        </p>
      </div>

      <Button 
        onClick={togglePlay}
        size="lg"
        className={cn(
          "rounded-full px-8 shadow-md transition-all",
          isPlaying ? "bg-slate-700 hover:bg-slate-800" : "bg-sky-600 hover:bg-sky-700"
        )}
      >
        {isPlaying ? <span className="flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> 停止播放</span> : <span className="flex items-center gap-2"><Play className="w-4 h-4 fill-current" /> 播放白噪音</span>}
      </Button>
    </div>
  );
};

// --- Distortion Checker Component ---
const DISTORTIONS = [
  {
    id: 'all-or-nothing',
    name: '非黑即白',
    desc: '用绝对化的标准评价事物，若不完美就是彻底失败。',
    fix: '寻找灰色地带，承认进步而非只看结果。'
  },
  {
    id: 'catastrophizing',
    name: '灾难化思维',
    desc: '总是预想最坏的结果，并认为自己无法承受。',
    fix: '问自己：最坏的情况发生的概率有多大？如果发生了我能做什么？'
  },
  {
    id: 'emotional-reasoning',
    name: '情绪化推理',
    desc: '因为感觉不好，就认为现实也是糟糕的 ("我觉得我是个失败者，所以我一定是")。',
    fix: '区分感受和事实，情绪不等于现实。'
  },
  {
    id: 'should',
    name: '“应该”法则',
    desc: '用严苛的“应该”、“必须”来要求自己或他人。',
    fix: '将“应该”改为“如果...会更好”，接纳不完美。'
  }
];

const DistortionChecker = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 mb-4">
        当我们感到焦虑或抑郁时，大脑容易陷入“认知扭曲”。点击下方卡片，识别你的负面思维模式。
      </p>
      <div className="grid gap-3">
        {DISTORTIONS.map((d) => (
          <div 
            key={d.id}
            className={cn(
              "border rounded-xl overflow-hidden transition-all cursor-pointer",
              activeId === d.id 
                ? "bg-sky-50 border-sky-200 shadow-sm" 
                : "bg-white border-slate-100 hover:border-slate-300"
            )}
            onClick={() => setActiveId(activeId === d.id ? null : d.id)}
          >
            <div className="p-4 flex items-center justify-between">
              <span className={cn("font-bold", activeId === d.id ? "text-sky-700" : "text-slate-700")}>
                {d.name}
              </span>
              {activeId === d.id ? <ChevronUp className="w-4 h-4 text-sky-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
            {activeId === d.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4 text-sm space-y-2 bg-white/50"
              >
                <p className="text-slate-600"><span className="font-semibold text-slate-900">表现：</span>{d.desc}</p>
                <p className="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">
                  <span className="font-semibold">💡 应对：</span>{d.fix}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function CbtTools() {
  const [activeTab, setActiveTab] = useState<'breathing' | 'meditation' | 'whitenoise' | 'distortion'>('breathing');

  return (
    <Card className="bg-white border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden">
      <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          CBT 心理工具箱
        </h3>
      </div>
      
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('breathing')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap min-w-[90px]",
            activeTab === 'breathing' ? "text-sky-600 bg-sky-50/50" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Wind className="w-4 h-4" />
            呼吸
          </span>
          {activeTab === 'breathing' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
        </button>
        <button
          onClick={() => setActiveTab('meditation')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap min-w-[90px]",
            activeTab === 'meditation' ? "text-sky-600 bg-sky-50/50" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            冥想
          </span>
          {activeTab === 'meditation' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
        </button>
        <button
          onClick={() => setActiveTab('whitenoise')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap min-w-[90px]",
            activeTab === 'whitenoise' ? "text-sky-600 bg-sky-50/50" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4" />
            白噪音
          </span>
          {activeTab === 'whitenoise' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
        </button>
        <button
          onClick={() => setActiveTab('distortion')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap min-w-[110px]",
            activeTab === 'distortion' ? "text-sky-600 bg-sky-50/50" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            认知纠偏
          </span>
          {activeTab === 'distortion' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
        </button>
      </div>

      <div className="p-6 min-h-[320px] flex items-center justify-center w-full">
        <div className="w-full max-w-lg">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'breathing' && <BoxBreathing />}
            {activeTab === 'meditation' && <MeditationGuide />}
            {activeTab === 'whitenoise' && <WhiteNoisePlayer />}
            {activeTab === 'distortion' && <DistortionChecker />}
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
