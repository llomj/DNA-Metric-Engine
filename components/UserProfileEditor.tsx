import React, { useState } from 'react';
import { UserProfile } from '../types';
import { gemini } from '../services/geminiService';

export default ({ userProfile, onSave, onCancel }: { userProfile?: UserProfile; onSave: (profile: UserProfile) => void; onCancel: () => void }) => {
  const [name, setName] = useState(userProfile?.name || '');
  const [persona, setPersona] = useState(userProfile?.persona || '');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.txt', '.rtf'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExt)) {
      alert('Please upload a .txt or .rtf file');
      return;
    }

    setFileName(file.name);
    try {
      const text = await file.text();
      setFileContent(text);
      if (!persona) {
        setPersona(text);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
      setFileName('');
    }
  };

  const handleAnalyze = async () => {
    if (!persona.trim() && !fileContent.trim()) {
      alert('Please provide persona text or upload a file');
      return;
    }

    const contentToAnalyze = fileContent || persona;
    if (!contentToAnalyze.trim()) return;

    setIsProcessing(true);
    try {
      const analyzed = await gemini.analyzeDNA(contentToAnalyze);
      setPersona(contentToAnalyze);
      // Optionally use analyzed metrics if user wants
    } catch (error) {
      console.error('Error analyzing persona:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!persona.trim() && !fileContent.trim()) {
      alert('Please provide persona information (text or file)');
      return;
    }

    const finalPersona = fileContent || persona;
    const profile: UserProfile = {
      id: userProfile?.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      persona: finalPersona.trim(),
      dnaMetrics: userProfile?.dnaMetrics,
      summary: userProfile?.summary,
      createdAt: userProfile?.createdAt || Date.now()
    };

    onSave(profile);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
        <h3 className="text-emerald-500 font-orbitron text-sm uppercase tracking-wider">User_Persona_Profile</h3>
        <button
          onClick={onCancel}
          className="text-[9px] text-emerald-900 border border-emerald-900/30 px-3 py-1.5 rounded uppercase font-mono hover:bg-emerald-900/10"
        >
          Cancel
        </button>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">Your_Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          disabled={isProcessing}
          className="w-full bg-zinc-900 border border-emerald-900/30 rounded-lg px-4 py-3 text-emerald-400 text-[11px] font-mono outline-none focus:border-emerald-500/50 disabled:opacity-50"
        />
      </div>

      {/* Input Mode Toggle */}
      <div className="flex space-x-2 border-b border-emerald-900/20 pb-3">
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2 text-[9px] uppercase font-mono border rounded ${
            inputMode === 'text'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'border-emerald-900/30 text-emerald-900 hover:bg-emerald-900/10'
          }`}
        >
          Copy/Paste Text
        </button>
        <button
          onClick={() => setInputMode('file')}
          className={`flex-1 py-2 text-[9px] uppercase font-mono border rounded ${
            inputMode === 'file'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'border-emerald-900/30 text-emerald-900 hover:bg-emerald-900/10'
          }`}
        >
          Import File
        </button>
      </div>

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="space-y-2">
          <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">Persona_Description</label>
          <textarea
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Describe your personality, background, interests, communication style, values, or any relevant information about yourself..."
            disabled={isProcessing}
            rows={8}
            className="w-full bg-zinc-900 border border-emerald-900/30 rounded-lg px-4 py-3 text-emerald-400 text-[11px] font-mono outline-none focus:border-emerald-500/50 disabled:opacity-50 resize-none"
          />
          <p className="text-[8px] text-emerald-900 font-mono italic">
            This helps models understand who they're talking to and adapt their responses naturally.
          </p>
        </div>
      )}

      {/* File Upload Mode */}
      {inputMode === 'file' && (
        <div className="space-y-2">
          <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">Import_Persona_File</label>
          <div className="border-2 border-dashed border-emerald-900/50 rounded-xl p-6 text-center">
            <input
              type="file"
              accept=".txt,.rtf"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="hidden"
              id="user-file-upload"
            />
            <label
              htmlFor="user-file-upload"
              className={`cursor-pointer block ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="space-y-2">
                <div className="text-emerald-500 text-2xl">📄</div>
                <div className="text-[10px] text-emerald-700 font-mono uppercase">
                  {fileName ? 'File Selected' : 'Click to Upload'}
                </div>
                <div className="text-[8px] text-emerald-900 font-mono">
                  .txt or .rtf files only
                </div>
                {fileName && (
                  <div className="text-[9px] text-emerald-600 font-mono mt-2">
                    {fileName}
                  </div>
                )}
              </div>
            </label>
          </div>
          {fileContent && (
            <div className="mt-2 p-3 bg-zinc-900/50 border border-emerald-900/20 rounded text-[9px] text-emerald-700 font-mono max-h-32 overflow-y-auto">
              <div className="text-[8px] text-emerald-900 uppercase mb-1">Preview:</div>
              {fileContent.substring(0, 200)}...
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={handleSave}
          disabled={isProcessing || !name.trim() || (!persona.trim() && !fileContent.trim())}
          className="flex-1 py-2.5 text-[9px] bg-emerald-500 text-black rounded-lg uppercase font-mono font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Profile
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2.5 text-[9px] text-emerald-900 border border-emerald-900/30 rounded-lg uppercase font-mono hover:bg-emerald-900/10 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
