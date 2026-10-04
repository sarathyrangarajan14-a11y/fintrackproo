import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface DocumentLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string | null;
  documentType?: string;
}

export default function DocumentLightbox({
  isOpen,
  onClose,
  title,
  url,
  documentType = "Document"
}: DocumentLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !url) return null;

  const isPdf = typeof url === 'string' && (url.startsWith('data:application/pdf') || url.toLowerCase().endsWith('.pdf'));

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}${isPdf ? '.pdf' : '.png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download document", e);
    }
  };

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div 
      id="document-lightbox-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="document-lightbox-content"
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0b1329] border border-slate-700/80 rounded-3xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
              <p className="text-xs text-slate-400">{documentType} • KYC Verified Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPdf && (
              <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
                <button
                  id="lightbox-zoom-out-btn"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  id="lightbox-reset-btn"
                  onClick={resetTransform}
                  className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white"
                  title="Reset Zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  id="lightbox-zoom-in-btn"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  id="lightbox-rotate-btn"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors ml-1 border-l border-slate-700"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              id="lightbox-download-btn"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              id="lightbox-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors ml-1"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-[400px] max-h-[70vh] bg-slate-950/60 select-none">
          {isPdf ? (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800">
              <FileText className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
              <p className="text-base font-bold text-white mb-2">{title} (PDF Document)</p>
              <p className="text-xs text-slate-400 max-w-md text-center mb-6">
                This document is formatted as an official PDF. You can download and inspect it directly.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                Download / Open PDF
              </button>
            </div>
          ) : (
            <div className="relative flex items-center justify-center overflow-hidden w-full h-full">
              <img
                src={url}
                alt={title}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Security Verified • 256-bit Encrypted Storage</span>
          </div>
          <div>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">ESC</kbd> or click outside to exit</div>
        </div>
      </div>
    </div>
  );
}
