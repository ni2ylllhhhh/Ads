import React, { useState } from 'react';
import { Check, Copy, Download, Code2, FileCode, X } from 'lucide-react';
import { generatePureSvg, generateStandaloneHtml } from '../utils/htmlExport';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeconds: number;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  currentSeconds,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'svg'>('html');
  const [copied, setCopied] = useState(false);
  const [includeJs, setIncludeJs] = useState(true);

  if (!isOpen) return null;

  const htmlCode = generateStandaloneHtml({
    initialSeconds: currentSeconds,
    title: 'সাদা পেজে টাইমার (Timer)',
    isInteractive: includeJs,
  });

  const svgCode = generatePureSvg({
    value: currentSeconds,
    progressPercent: 25,
    showNotches: true,
  });

  const activeContent = activeTab === 'html' ? htmlCode : svgCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const filename = activeTab === 'html' ? 'timer-stopwatch.html' : 'stopwatch-icon-15.svg';
    const mimeType = activeTab === 'html' ? 'text/html' : 'image/svg+xml';
    const blob = new Blob([activeContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold text-neutral-900">
              HTML / SVG কোড (Standalone Code)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar & Action Controls */}
        <div className="px-6 py-3 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-1 bg-neutral-200/70 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              কমপ্লিট HTML ফাইল (.html)
            </button>
            <button
              onClick={() => setActiveTab('svg')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'svg'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              বিশুদ্ধ ভেক্টর SVG কোড
            </button>
          </div>

          {activeTab === 'html' && (
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeJs}
                onChange={(e) => setIncludeJs(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              টাইমার জাভাস্ক্রিপ্ট কোড সহ
            </label>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              ডাউনলোড করুন
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  কপি হয়েছে!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  কোড কপি করুন
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-4 bg-neutral-950 flex-1 overflow-auto font-mono text-xs text-neutral-200 leading-relaxed selection:bg-neutral-800 selection:text-white">
          <pre className="whitespace-pre">
            <code>{activeContent}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
          <span>
            {activeTab === 'html'
              ? 'এই HTML ফাইলটি যেকোনো ব্রাউজারে ডাবল ক্লিক করলেই চলবে (কোনো সার্ভার দরকার নেই)।'
              : 'এই SVG কোডটি আপনার যেকোনো ওয়েব পেজ বা গ্রাফিক্সে সরাসরি পেস্ট করা যাবে।'}
          </span>
          <button
            onClick={onClose}
            className="font-semibold text-neutral-800 hover:underline"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
