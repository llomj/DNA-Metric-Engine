import React, { useState, useRef, useEffect } from 'react';
import FallacyDetailModal from './FallacyDetailModal';
import { DetectedFallacy } from '../types';

export default ({ messages, onSendMessage, isThinking, profileName }: any) => {
  const [input, setInput] = useState('');
  const [selectedFallacy, setSelectedFallacy] = useState<DetectedFallacy | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  return (
    <div className="flex-1 flex flex-col h-full bg-black/20">
      <div className="px-6 py-3 border-b border-emerald-900/20 bg-zinc-950/40 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
            <div>
              <div className="text-[8px] text-emerald-900 font-mono uppercase tracking-wider">Active_Model</div>
              <div className="text-[12px] text-emerald-400 font-orbitron font-bold">{profileName || 'NO_MODEL_SELECTED'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
        {messages.map((msg: any, i: number) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`text-[8px] mb-1.5 font-orbitron uppercase opacity-60 ${msg.role === 'user' ? 'text-zinc-500' : 'text-emerald-500'}`}>
              {msg.role === 'user' ? 'USER' : profileName}
            </div>
            <div className={`p-3 rounded-lg text-[13px] font-mono leading-relaxed ${msg.role === 'user' ? 'bg-zinc-900 text-emerald-100' : 'bg-emerald-500/5 text-emerald-400 border-l-2 border-emerald-500/30'}`}>{msg.content}</div>
            {msg.detectedFallacies && msg.detectedFallacies.length > 0 && (
              <div className="mt-2 w-full space-y-1.5">
                {msg.detectedFallacies.map((f: DetectedFallacy, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFallacy(f)}
                    className="w-full p-2 bg-red-950/20 border border-red-600/30 rounded text-[9px] text-red-400 font-mono hover:bg-red-950/40 hover:border-red-500/50 cursor-pointer transition-all text-left"
                  >
                    ⚠️ FALLACY_DETECTED: {f.name} (Click for details)
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isThinking && <div className="text-emerald-800 text-[10px] font-orbitron animate-pulse">PARSING_NEURAL_LOGS...</div>}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="text-emerald-900 text-[10px] font-mono">No messages yet. Start a conversation.</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-zinc-950/80 backdrop-blur-xl">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) onSendMessage(input); setInput(''); }} className="flex space-x-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query" className="flex-1 bg-zinc-900 text-emerald-500 p-4 rounded-xl text-[12px] font-mono resize-none h-20" />
          <button type="submit" className="w-12 bg-emerald-500 text-black rounded-xl font-bold">SEND</button>
        </form>
      </div>
      {selectedFallacy && (
        <FallacyDetailModal fallacy={selectedFallacy} onClose={() => setSelectedFallacy(null)} />
      )}
    </div>
  );
};
