import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  FileCode, 
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { LectureData } from '../types';
import { generateGoogleAppsScript } from '../utils/scriptGenerators';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureData;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({
  isOpen,
  onClose,
  lecture,
}) => {
  const [copied, setCopied] = useState(false);
  const scriptContent = generateGoogleAppsScript(lecture);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google Apps Script — Speaker Notes &amp; Audio Integrator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync all {lecture.totalSlides} slides into your Google Slides presentation in 1 click
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

        {/* Instructions */}
        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
            <PlayCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            How to run in Google Slides (30 seconds)
          </h4>
          <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal list-inside">
            <li>
              Open your presentation in <span className="font-semibold text-slate-900 dark:text-white">Google Slides</span>.
            </li>
            <li>
              In the top menu, click <span className="font-semibold text-slate-900 dark:text-white">Extensions</span> &rarr; <span className="font-semibold text-indigo-600 dark:text-indigo-400">Apps Script</span>.
            </li>
            <li>
              Delete any default text in <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Code.gs</code>, paste the script below, and click <span className="font-semibold">Save</span> (or Ctrl+S).
            </li>
            <li>
              Select <span className="font-semibold text-indigo-600 dark:text-indigo-400">syncSpeakerNotes</span> from the function dropdown at the top, and click <span className="font-semibold">Run</span>.
            </li>
            <li>
              Grant Google Slides permissions if prompted. All <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lecture.totalSlides} slide notes</span> will be populated automatically!
            </li>
          </ol>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-hidden flex flex-col p-5 bg-slate-950 text-slate-100 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span>Code.gs (Ready-to-Paste)</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Entire Script</span>
                </>
              )}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
            <pre className="text-slate-300 whitespace-pre leading-relaxed">
              {scriptContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Includes <code>linkDriveAudioToNotes</code> for audio file sync.</span>
          </div>
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
