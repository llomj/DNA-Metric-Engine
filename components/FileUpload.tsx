import React, { useState } from 'react';

export default ({ onUpload, onCancel }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');

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
    // Auto-fill model name from filename (without extension)
    if (!modelName) {
      setModelName(file.name.replace(/\.(txt|rtf)$/i, ''));
    }

    try {
      let text = '';
      if (fileExt === '.rtf') {
        // For RTF files, read as text (basic handling)
        text = await file.text();
      } else {
        text = await file.text();
      }
      setFileContent(text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
      setFileName('');
    }
  };

  const handleUpload = async () => {
    if (!fileContent) {
      alert('Please select a file first');
      return;
    }
    if (!modelName.trim()) {
      alert('Please enter a model name');
      return;
    }

    setIsProcessing(true);
    try {
      if (onUpload) {
        await onUpload(fileContent, modelName.trim());
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-emerald-500 font-orbitron text-[10px] uppercase mb-3">Upload_DNA_File</h3>
      
      {/* Model Name Input */}
      <div className="space-y-2">
        <label className="text-[9px] text-emerald-700 font-mono uppercase tracking-wider">Model_Name</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Enter model name..."
          disabled={isProcessing}
          className="w-full bg-zinc-900 border border-emerald-900/30 rounded-lg px-4 py-3 text-emerald-400 text-[11px] font-mono outline-none focus:border-emerald-500/50 disabled:opacity-50"
        />
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-emerald-900/50 rounded-xl p-6 text-center">
        <input
          type="file"
          accept=".txt,.rtf"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
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

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {fileContent && modelName.trim() && (
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="flex-1 py-2.5 text-[9px] bg-emerald-500 text-black rounded-lg uppercase font-mono font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Upload & Analyze'}
          </button>
        )}
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
