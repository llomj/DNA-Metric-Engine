import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default ({ profile, settings, onSettingsChange, onFileUpload }: any) => {
  const [showUpload, setShowUpload] = useState(false);
  if (!profile) return null;

  const updateSetting = (key: string, value: number | boolean) => {
    if (onSettingsChange) {
      onSettingsChange({ ...settings, [key]: value });
    }
  };

  const Slider = ({ label, value, onChange, min = 0, max = 100 }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">{label}</label>
        <span className="text-[10px] text-emerald-400 font-bold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${(value / max) * 100}%, #18181b ${(value / max) * 100}%, #18181b 100%)`
        }}
      />
    </div>
  );

  const Toggle = ({ label, value, onChange }: any) => (
    <div className="flex justify-between items-center">
      <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-zinc-900'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  const defaultSettings = {
    aggressiveness: 80,
    formality: 70,
    emotionalExpressiveness: 30,
    verbosity: 50,
    analyticalDepth: 80,
    skepticism: 70,
    abstractness: 40,
    intellectualDensity: 75,
    ttsEnabled: false,
    ...settings
  };

  return (
    <div className="h-full overflow-y-auto space-y-6 custom-scrollbar pb-6">
      {/* DNA Registry Upload */}
      <div className="p-6 border border-emerald-500/30 bg-black/60 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-emerald-500 font-orbitron text-[10px] uppercase">DNA_Registry</h3>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="text-[8px] text-emerald-600 border border-emerald-900/30 px-3 py-1.5 rounded uppercase font-mono hover:bg-emerald-900/10"
          >
            {showUpload ? 'Hide' : '+ Add DNA'}
          </button>
        </div>
        {showUpload && (
          <FileUpload
            onUpload={async (content: string, fileName: string) => {
              if (onFileUpload) {
                await onFileUpload(content, fileName);
                setShowUpload(false);
              }
            }}
            onCancel={() => setShowUpload(false)}
          />
        )}
      </div>

      {/* Identity Registry */}
      {profile && (
        <div className="p-6 border border-emerald-500/30 bg-black/60 rounded-xl">
          <h3 className="text-emerald-500 font-orbitron text-[10px] uppercase mb-3">Identity_Registry</h3>
          <div className="text-xl text-emerald-400 font-bold uppercase mb-2">{profile.name}</div>
          <p className="text-[11px] text-emerald-700 font-mono">{profile.summary}</p>
        </div>
      )}

      {/* System Controls */}
      <div className="p-6 border border-emerald-500/30 bg-black/60 rounded-xl space-y-6">
        <h3 className="text-emerald-500 font-orbitron text-[10px] uppercase mb-4">System_Control</h3>
        
        <div className="space-y-5">
          <Slider label="Aggressiveness" value={defaultSettings.aggressiveness} onChange={(v: number) => updateSetting('aggressiveness', v)} />
          <Slider label="Formality" value={defaultSettings.formality} onChange={(v: number) => updateSetting('formality', v)} />
          <Slider label="Emotional Expressiveness" value={defaultSettings.emotionalExpressiveness} onChange={(v: number) => updateSetting('emotionalExpressiveness', v)} />
          <Slider label="Verbosity" value={defaultSettings.verbosity} onChange={(v: number) => updateSetting('verbosity', v)} />
          <Slider label="Analytical Depth" value={defaultSettings.analyticalDepth} onChange={(v: number) => updateSetting('analyticalDepth', v)} />
          <Slider label="Skepticism" value={defaultSettings.skepticism} onChange={(v: number) => updateSetting('skepticism', v)} />
          <Slider label="Abstractness" value={defaultSettings.abstractness} onChange={(v: number) => updateSetting('abstractness', v)} />
          <Slider label="Intellectual Density" value={defaultSettings.intellectualDensity} onChange={(v: number) => updateSetting('intellectualDensity', v)} />
          <Toggle label="Text-to-Speech" value={defaultSettings.ttsEnabled} onChange={(v: boolean) => updateSetting('ttsEnabled', v)} />
        </div>
      </div>

      {/* DNA Metrics */}
      {profile && profile.metrics && (
        <div className="p-6 border border-emerald-500/30 bg-black/60 rounded-xl space-y-4">
          <h3 className="text-emerald-500 font-orbitron text-[10px] uppercase mb-3">DNA_Metrics</h3>
          
          {profile.metrics.behavioralTraits && profile.metrics.behavioralTraits.length > 0 && (
            <div>
              <div className="text-[8px] text-emerald-900 font-mono uppercase mb-2">Behavioral Traits</div>
              <div className="flex flex-wrap gap-2">
                {profile.metrics.behavioralTraits.map((trait: string, i: number) => (
                  <span key={i} className="text-[8px] text-emerald-700 border border-emerald-900/30 px-2 py-1 rounded font-mono">{trait}</span>
                ))}
              </div>
            </div>
          )}

          {profile.metrics.epistemology && (
            <div>
              <div className="text-[8px] text-emerald-900 font-mono uppercase mb-2">Epistemology</div>
              <p className="text-[9px] text-emerald-700 font-mono leading-relaxed">{profile.metrics.epistemology}</p>
            </div>
          )}

          {profile.metrics.valueHierarchy && profile.metrics.valueHierarchy.length > 0 && (
            <div>
              <div className="text-[8px] text-emerald-900 font-mono uppercase mb-2">Value Hierarchy</div>
              <div className="text-[9px] text-emerald-700 font-mono">{profile.metrics.valueHierarchy.join(' > ')}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
