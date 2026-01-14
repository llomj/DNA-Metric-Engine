import React, { useState, useEffect } from 'react';

export default ({ onClose, onSave }: any) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load existing API key from localStorage
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Store API key ONLY in localStorage - never sent to server or GitHub
      localStorage.setItem('gemini_api_key', apiKey.trim());
      if (onSave) {
        onSave(apiKey.trim());
      }
      if (onClose) {
        onClose();
      }
      // Show confirmation
      alert('API key saved securely to your device. It will not be shared or uploaded to GitHub.');
    } else {
      alert('Please enter an API key');
    }
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
      <div className="border-2 border-emerald-600 bg-black/90 p-8 max-w-md w-full rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.5)]">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
            <h2 className="text-emerald-500 font-orbitron text-xl uppercase tracking-wider">API Key Configuration</h2>
            <button
              onClick={onClose}
              className="text-emerald-700 hover:text-emerald-500 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-emerald-400 font-mono text-xs uppercase mb-2">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full p-4 bg-zinc-900 border border-emerald-900/30 rounded-lg text-emerald-400 text-sm font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-emerald-700 font-mono text-xs leading-relaxed">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-400 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          <div className="flex space-x-4 pt-4 border-t border-emerald-900/50">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-emerald-900/50 text-emerald-700 font-mono text-xs uppercase hover:bg-emerald-900/20 hover:border-emerald-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 border-2 border-emerald-500 bg-emerald-950/30 text-emerald-400 font-orbitron text-xs uppercase font-bold hover:bg-emerald-950/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
