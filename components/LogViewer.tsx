import React from 'react';
import { ModelProfile, Message } from '../types';

export default ({ profiles, histories, onClose }: { profiles: ModelProfile[]; histories: Record<string, Message[]>; onClose: () => void }) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Group conversations by profile
  const profileLogs = profiles.map(profile => ({
    profile,
    messages: histories[profile.id] || []
  })).filter(log => log.messages.length > 0);

  return (
    <div className="absolute inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col p-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4 mb-6">
        <h2 className="text-xl font-orbitron text-emerald-500 tracking-widest uppercase">Model Matrix Memory</h2>
        <button onClick={onClose} className="p-3 border border-emerald-500 text-emerald-500 text-[10px] uppercase hover:bg-emerald-500/10 transition-all">Close_DB</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {profileLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-emerald-700 font-mono text-sm">No conversation logs found.</p>
            <p className="text-emerald-900 font-mono text-xs mt-2">Start chatting with models to create logs.</p>
          </div>
        ) : (
          profileLogs.map(({ profile, messages }) => (
            <div key={profile.id} className="border border-emerald-900/20 bg-emerald-950/5 rounded-lg p-4 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/30">
                <div>
                  <h3 className="text-emerald-400 font-orbitron text-sm uppercase font-bold">{profile.name}</h3>
                  <p className="text-emerald-700 font-mono text-[9px] mt-1">{profile.summary}</p>
                </div>
                <div className="text-emerald-900 font-mono text-[8px]">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {messages.map((msg: Message, idx: number) => (
                  <div key={idx} className={`p-3 rounded border-l-2 ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900/40 border-emerald-900/30' 
                      : 'bg-emerald-950/10 border-emerald-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-orbitron uppercase ${
                        msg.role === 'user' ? 'text-zinc-500' : 'text-emerald-500'
                      }`}>
                        {msg.role === 'user' ? 'USER' : profile.name}
                      </span>
                      <span className="text-[8px] text-emerald-900 font-mono">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    {msg.detectedFallacies && msg.detectedFallacies.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-red-900/20">
                        <p className="text-[8px] text-red-400 font-mono uppercase mb-1">Detected Fallacies:</p>
                        {msg.detectedFallacies.map((fallacy, fIdx) => (
                          <div key={fIdx} className="text-[8px] text-red-500 font-mono ml-2">
                            • {fallacy.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
