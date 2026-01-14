import React, { useState } from 'react';
import FileUpload from './FileUpload';
import UserProfileEditor from './UserProfileEditor';
import { UserProfile } from '../types';

export default ({ profiles, activeId, onSelect, onAdd, onDelete, userProfile, onUserProfileSave }: any) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center border-b border-emerald-900/30 pb-4">
        <h3 className="text-emerald-500 font-orbitron text-lg uppercase tracking-wider">DNA Registry</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowUserProfile(!showUserProfile)}
            className="text-[10px] text-emerald-600 border border-emerald-900/30 px-4 py-2 rounded uppercase font-mono hover:bg-emerald-900/10 font-bold"
          >
            {showUserProfile ? 'Cancel' : '👤 User Profile'}
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="text-[10px] text-emerald-600 border border-emerald-900/30 px-4 py-2 rounded uppercase font-mono hover:bg-emerald-900/10 font-bold"
          >
            {showUpload ? 'Cancel' : '+ Add DNA'}
          </button>
        </div>
      </div>
      
      {/* User Profile Editor */}
      {showUserProfile && (
        <div className="border border-emerald-900/30 rounded-lg p-4 bg-black/40">
          <UserProfileEditor
            userProfile={userProfile}
            onSave={(profile: UserProfile) => {
              if (onUserProfileSave) {
                onUserProfileSave(profile);
              }
              setShowUserProfile(false);
            }}
            onCancel={() => setShowUserProfile(false)}
          />
        </div>
      )}

      {/* Current User Profile Display */}
      {userProfile && !showUserProfile && (
        <div className="border border-emerald-500/30 rounded-lg p-3 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-[10px] text-emerald-700 font-mono uppercase mb-1">Active User Profile</div>
              <div className="text-sm font-orbitron font-bold text-emerald-400">{userProfile.name}</div>
              {userProfile.summary && (
                <div className="text-[9px] text-emerald-800 font-mono mt-1 line-clamp-1">{userProfile.summary}</div>
              )}
            </div>
            <button
              onClick={() => setShowUserProfile(true)}
              className="text-[8px] text-emerald-600 border border-emerald-900/30 px-2 py-1 rounded uppercase font-mono hover:bg-emerald-900/10"
            >
              Edit
            </button>
          </div>
        </div>
      )}
      
      {showUpload && (
        <div className="border border-emerald-900/30 rounded-lg p-4">
          <FileUpload
            onUpload={async (content: string, fileName: string) => {
              if (onAdd) {
                await onAdd(content, fileName);
                setShowUpload(false);
              }
            }}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {profiles.map((p: any) => (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${
              activeId === p.id
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'border-emerald-900/20 text-emerald-900 hover:border-emerald-900/40 hover:bg-emerald-900/5'
            }`}
          >
            <div className="flex flex-col flex-1">
              <span className="text-sm font-orbitron font-bold">{p.name}</span>
              {p.summary && (
                <span className="text-[10px] text-emerald-700 font-mono mt-1 line-clamp-2">{p.summary}</span>
              )}
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p.id);
                }}
                className="text-[9px] text-red-900 border border-red-900/30 px-3 py-1.5 rounded hover:bg-red-900/10 font-mono uppercase ml-4"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
