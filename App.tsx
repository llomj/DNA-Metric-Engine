import React, { useState, useEffect } from 'react';
import { ModelProfile, Message, CustomizationSettings, AppStatus, UserProfile } from './types';
import { gemini } from './services/geminiService';
import Header from './components/Header';
import ModelConfig from './components/ModelConfig';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import ModelLibrary from './components/ModelLibrary';
import FallacyRegistry from './components/FallacyRegistry';
import ApiKeyDialog from './components/ApiKeyDialog';
import LogViewer from './components/LogViewer';

const TJUMPS_PROFILE: ModelProfile = {
  id: 'dna-tjumps-v1',
  name: 'T-JUMPS.rtf',
  summary: 'Debate specialist focused on foundational epistemology.',
  metrics: {
    behavioralTraits: ['Persistent', 'Analytical'],
    epistemology: 'Foundational Presuppositionalism.',
    moralAxioms: ['Logic is transcendental'],
    rhetoricalStructure: 'Socratic questioning.',
    linguisticPatterns: ['"Prove the premise"'],
    cognitiveBiases: ['Logical Rigor Bias'],
    valueHierarchy: ['Logic', 'Consistency'],
    emotionalConstraints: 'Highly modulated.'
  }
};

const DEFAULT_SETTINGS: CustomizationSettings = {
  aggressiveness: 80,
  formality: 70,
  emotionalExpressiveness: 30,
  verbosity: 50,
  analyticalDepth: 80,
  skepticism: 70,
  abstractness: 40,
  intellectualDensity: 75,
  ttsEnabled: false
};

export default () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.ACTIVE);
  const [profiles, setProfiles] = useState<ModelProfile[]>([TJUMPS_PROFILE]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(TJUMPS_PROFILE.id);
  const [histories, setHistories] = useState<Record<string, Message[]>>({});
  const [settings, setSettings] = useState<CustomizationSettings>(DEFAULT_SETTINGS);
  const [viewMode, setViewMode] = useState<'chat' | 'config'>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFallacies, setShowFallacies] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPurgeWarning, setShowPurgeWarning] = useState(false);
  const [deleteWarningProfileId, setDeleteWarningProfileId] = useState<string | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;
  const currentHistory = activeProfileId ? (histories[activeProfileId] || []) : [];

  // Load all data from localStorage on mount
  useEffect(() => {
    // Load user profile
    const storedProfile = localStorage.getItem('user_profile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error loading user profile:', e);
      }
    }

    // Load profiles
    const storedProfiles = localStorage.getItem('model_profiles');
    if (storedProfiles) {
      try {
        const parsed = JSON.parse(storedProfiles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProfiles(parsed);
          // Set active profile if it exists
          const storedActiveId = localStorage.getItem('active_profile_id');
          if (storedActiveId && parsed.find((p: ModelProfile) => p.id === storedActiveId)) {
            setActiveProfileId(storedActiveId);
          } else {
            setActiveProfileId(parsed[0].id);
          }
        }
      } catch (e) {
        console.error('Error loading profiles:', e);
      }
    }

    // Load conversation histories
    const storedHistories = localStorage.getItem('conversation_histories');
    if (storedHistories) {
      try {
        setHistories(JSON.parse(storedHistories));
      } catch (e) {
        console.error('Error loading histories:', e);
      }
    }

    // Load settings
    const storedSettings = localStorage.getItem('model_settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('model_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save active profile ID to localStorage
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('active_profile_id', activeProfileId);
    }
  }, [activeProfileId]);

  // Save conversation histories to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(histories).length > 0) {
      localStorage.setItem('conversation_histories', JSON.stringify(histories));
    }
  }, [histories]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('model_settings', JSON.stringify(settings));
  }, [settings]);

  // Save user profile to localStorage
  const handleUserProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  };

  const handleFileUpload = async (content: string, modelName: string) => {
    if (!modelName.trim()) {
      alert('Please enter a model name');
      return;
    }
    setIsAnalyzing(true);
    try {
      const analyzed = await gemini.analyzeDNA(content);
      const newProfile: ModelProfile = {
        id: `dna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: modelName.trim(),
        summary: analyzed.summary || 'AI-analyzed DNA profile',
        metrics: analyzed.metrics || {
          behavioralTraits: [],
          epistemology: '',
          moralAxioms: [],
          rhetoricalStructure: '',
          linguisticPatterns: [],
          cognitiveBiases: [],
          valueHierarchy: [],
          emotionalConstraints: ''
        }
      };
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error analyzing DNA:', error);
      alert('Error analyzing file. Please check the file format and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeProfileId || !activeProfile || isThinking) return;
    setIsThinking(true);
    
    // Check user message for fallacies before sending
    const userMsg: Message = { role: 'user', content, timestamp: Date.now() };
    const historyBeforeUser = currentHistory;
    const updated = [...historyBeforeUser, userMsg];
    
    // Store user message (fallacies will be detected in the model's response)
    setHistories(prev => ({ ...prev, [activeProfileId]: updated }));
    
    try {
      const res = await gemini.generateResponse(activeProfile, updated, settings);
      // Model response includes fallacies detected in both user and model messages
      const modelMsg: Message = { 
        role: 'model', 
        content: res.responseText, 
        timestamp: Date.now(), 
        detectedFallacies: res.fallacies 
      };
      setHistories(prev => ({ ...prev, [activeProfileId]: [...updated, modelMsg] }));
    } catch (e: any) {
      console.error(e);
      const errorMsg: Message = {
        role: 'model',
        content: `ERROR: ${e.message || 'Failed to generate response. Please check your API key configuration.'}`,
        timestamp: Date.now()
      };
      setHistories(prev => ({ ...prev, [activeProfileId]: [...updated, errorMsg] }));
    } finally {
      setIsThinking(false);
    }
  };

  const handlePurge = () => {
    setShowPurgeWarning(true);
  };

  const confirmPurge = () => {
    // Reset to default profile only
    setProfiles([TJUMPS_PROFILE]);
    setActiveProfileId(TJUMPS_PROFILE.id);
    setHistories({});
    setSettings(DEFAULT_SETTINGS);
    setViewMode('chat');
    setIsMenuOpen(false);
    setShowPurgeWarning(false);
    // Clear localStorage
    localStorage.removeItem('model_profiles');
    localStorage.removeItem('conversation_histories');
    localStorage.removeItem('model_settings');
    localStorage.removeItem('active_profile_id');
    // Keep user profile - don't delete it on purge
  };

  const cancelPurge = () => {
    setShowPurgeWarning(false);
  };

  const handleDeleteClick = (id: string) => {
    if (profiles.length > 1) {
      setDeleteWarningProfileId(id);
    } else {
      alert('Cannot delete the last profile');
    }
  };

  const confirmDelete = () => {
    if (!deleteWarningProfileId) return;
    
    const idToDelete = deleteWarningProfileId;
    setProfiles(prev => prev.filter(p => p.id !== idToDelete));
    if (activeProfileId === idToDelete) {
      const remainingProfiles = profiles.filter(p => p.id !== idToDelete);
      setActiveProfileId(remainingProfiles[0]?.id || null);
    }
    // Clear the history for the deleted profile
    setHistories(prev => {
      const updated = { ...prev };
      delete updated[idToDelete];
      return updated;
    });
    setDeleteWarningProfileId(null);
  };

  const cancelDelete = () => {
    setDeleteWarningProfileId(null);
  };

  return (
    <div className="h-full w-full bg-black flex justify-center items-center overflow-hidden">
      <div className="relative w-full h-full md:max-w-[430px] md:max-h-[932px] md:border-x md:border-zinc-900 bg-black flex flex-col overflow-hidden">
        <Header status={status} viewMode={viewMode} onReset={handlePurge} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} onToggleView={() => setViewMode(v => v === 'chat' ? 'config' : 'chat')} onToggleFallacies={() => { setShowFallacies(true); setShowLogs(false); }} onToggleLogs={() => { setShowLogs(true); setShowFallacies(false); }} onToggleApiKey={() => setShowApiKeyDialog(true)} />
        <main className="flex-1 overflow-hidden relative">
          {viewMode === 'chat' ? <ChatInterface messages={currentHistory} onSendMessage={handleSendMessage} isThinking={isThinking} profileName={activeProfile?.name || 'GUEST'} /> : <div className="h-full overflow-y-auto"><ModelConfig profile={activeProfile} settings={settings} onSettingsChange={setSettings} onFileUpload={handleFileUpload} /></div>}
        </main>
        {showFallacies && <FallacyRegistry onClose={() => setShowFallacies(false)} />}
        {showLogs && <LogViewer profiles={profiles} histories={histories} onClose={() => setShowLogs(false)} />}
        {isMenuOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/80" onClick={() => setIsMenuOpen(false)}></div>
            <div className="relative w-full bg-zinc-950 p-6 overflow-y-auto">
              <ModelLibrary
                profiles={profiles}
                activeId={activeProfileId}
                onSelect={(id: string) => { 
                  setActiveProfileId(id); 
                  setViewMode('config'); // Switch to config view to show system control
                  setIsMenuOpen(false); 
                }}
                onAdd={handleFileUpload}
                onDelete={handleDeleteClick}
                userProfile={userProfile}
                onUserProfileSave={handleUserProfileSave}
              />
            </div>
          </div>
        )}
        {isAnalyzing && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90">
            <div className="text-center space-y-4">
              <div className="text-emerald-500 font-orbitron text-sm animate-pulse">ANALYZING_DNA...</div>
              <div className="text-[10px] text-emerald-700 font-mono">Processing file content</div>
            </div>
          </div>
        )}
        {showPurgeWarning && (
          <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <div className="border-2 border-red-600 bg-black/90 p-8 max-w-md w-full rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="text-red-500 text-5xl animate-pulse">⚠</div>
                </div>
                <div>
                  <h2 className="text-red-500 font-orbitron text-xl uppercase tracking-wider mb-4">WARNING: PURGE PROTOCOL</h2>
                  <div className="border-t border-red-900/50 pt-4 space-y-3">
                    <p className="text-red-400 font-mono text-sm leading-relaxed">
                      This action will <span className="text-red-500 font-bold">DELETE ALL DNA REGISTRY ENTRIES</span>
                    </p>
                    <p className="text-red-600 font-mono text-xs">
                      This operation cannot be undone.
                    </p>
                    <p className="text-red-700 font-mono text-xs uppercase">
                      Continue with purge?
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4 border-t border-red-900/50">
                  <button
                    onClick={cancelPurge}
                    className="flex-1 px-6 py-3 border border-red-900/50 text-red-700 font-mono text-xs uppercase hover:bg-red-900/20 hover:border-red-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurge}
                    className="flex-1 px-6 py-3 border-2 border-red-500 bg-red-950/30 text-red-400 font-orbitron text-xs uppercase font-bold hover:bg-red-950/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {deleteWarningProfileId && (
          <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <div className="border-2 border-red-600 bg-black/90 p-8 max-w-md w-full rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="text-red-500 text-5xl animate-pulse">⚠</div>
                </div>
                <div>
                  <h2 className="text-red-500 font-orbitron text-xl uppercase tracking-wider mb-4">WARNING: DELETE PROTOCOL</h2>
                  <div className="border-t border-red-900/50 pt-4 space-y-3">
                    <p className="text-red-400 font-mono text-sm leading-relaxed">
                      This action will <span className="text-red-500 font-bold">DELETE THIS DNA PROFILE</span>
                    </p>
                    {profiles.find(p => p.id === deleteWarningProfileId) && (
                      <p className="text-red-500 font-orbitron text-xs font-bold">
                        {profiles.find(p => p.id === deleteWarningProfileId)?.name}
                      </p>
                    )}
                    <p className="text-red-600 font-mono text-xs">
                      This operation cannot be undone.
                    </p>
                    <p className="text-red-700 font-mono text-xs uppercase">
                      Continue with deletion?
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4 border-t border-red-900/50">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-6 py-3 border border-red-900/50 text-red-700 font-mono text-xs uppercase hover:bg-red-900/20 hover:border-red-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 border-2 border-red-500 bg-red-950/30 text-red-400 font-orbitron text-xs uppercase font-bold hover:bg-red-950/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showApiKeyDialog && (
          <ApiKeyDialog
            onClose={() => setShowApiKeyDialog(false)}
            onSave={(key: string) => {
              // API key is saved ONLY to localStorage (client-side) - never to GitHub
              // Reload to reinitialize service with new API key
              setShowApiKeyDialog(false);
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};
