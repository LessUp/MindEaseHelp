import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center">
        <p className="text-xs leading-relaxed text-slate-400 max-w-lg mx-auto">
          免责声明：本应用提供的评估结果仅供参考，不构成医疗诊断或建议。
          <br />
          如果您正在经历严重的心理困扰或有自伤倾向，请立即寻求专业医生的帮助或联系当地急救服务。
        </p>
      </div>
    </footer>
  );
}
