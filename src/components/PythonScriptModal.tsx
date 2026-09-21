import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  HelpCircle,
  FileCode
} from 'lucide-react';
import { LectureData } from '../types';
import { generatePythonScript } from '../utils/scriptGenerators';

interface PythonScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureData;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  isOpen,
  onClose,
  lecture,
}) => {
  const [copied, setCopied] = useState(false);
  const scriptContent = generatePythonScript(lecture);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sync_slides_voice.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Python CLI Script (Google Slides API &amp; Drive)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Run locally with Google Slides REST API for automated batch updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Instructions */}
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
            Usage:
          </p>
          <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] mb-2">
            python sync_slides_voice.py --presentation_id &lt;YOUR_GOOGLE_SLIDE_ID&gt;
          </div>
          <p className="text-[11px] text-slate-500">
            Note: Requires <code>google-api-python-client</code> and OAuth credentials downloaded as <code>credentials.json</code>.
          </p>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-5 bg-slate-950 text-slate-100 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span>sync_slides_voice.py</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .py</span>
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
            <pre className="text-slate-300 whitespace-pre leading-relaxed">
              {scriptContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
