import React from 'react';
export default ({ status, viewMode, onReset, onToggleMenu, onToggleView, onToggleFallacies, onToggleApiKey, onToggleLogs }: any) => (
  <header className="px-6 py-4 flex items-center justify-between border-b border-emerald-900/30">
    <div className="flex items-center space-x-4">
      <button onClick={onToggleMenu} className="p-2 border border-emerald-900/50 text-emerald-500 rounded">☰</button>
      <div><h1 className="text-sm font-orbitron text-emerald-500">DNA_ENGINE</h1></div>
    </div>
    <div className="flex items-center space-x-2">
      <button onClick={onToggleFallacies} className="px-2 py-1.5 border border-emerald-500/30 text-[9px] text-emerald-500 uppercase font-bold tracking-tighter hover:bg-emerald-500/10" title="logical fallacies list">LF</button>
      <button onClick={onToggleLogs} className="px-2 py-1.5 border border-emerald-500/30 text-[9px] text-emerald-500 uppercase font-bold tracking-tighter hover:bg-emerald-500/10" title="model matrix memory logs">LOG</button>
      <button onClick={onToggleApiKey} className="px-2 py-1.5 border border-emerald-500/30 text-[9px] text-emerald-500 uppercase font-bold tracking-tighter hover:bg-emerald-500/10" title="API key configuration">🔑</button>
      <button onClick={onReset} className="px-3 py-1.5 border border-emerald-900 text-[9px] text-emerald-900 hover:text-emerald-500 transition-all uppercase font-bold tracking-tighter">Purge</button>
      <button onClick={onToggleView} className={`w-10 h-10 rounded-sm flex items-center justify-center ${viewMode === 'config' ? 'bg-emerald-500 text-black shadow-[0_0_15px_#10b981]' : 'bg-zinc-900 text-emerald-500'}`}><span className="font-bold text-xl font-orbitron">Ω</span></button>
    </div>
  </header>
);
