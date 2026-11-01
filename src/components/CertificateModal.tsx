import React, { useEffect, useRef } from 'react';
import { X, Download, Printer, Award, ShieldCheck } from 'lucide-react';
import { QuizResult } from '../types/quiz';
import { drawCertificateToCanvas, downloadCertificateImage } from '../utils/certificate';

interface CertificateModalProps {
  result: QuizResult | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ result, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (result && canvasRef.current) {
      drawCertificateToCanvas(canvasRef.current, result);
    }
  }, [result]);

  if (!result) return null;

  const handleDownload = () => {
    if (canvasRef.current) {
      const sanitizedName = (result.userName || 'Student').replace(/\s+/g, '_');
      const filename = `CyberQuiz_Certificate_${sanitizedName}_${result.categoryName}.png`;
      downloadCertificateImage(canvasRef.current, filename);
    }
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const windowContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CyberQuiz Certificate - ${result.userName}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; }
            img { width: 100vw; height: auto; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Certificate of Achievement</h3>
              <p className="text-xs text-slate-400">
                Verified CyberQuiz Security Qualification · {result.categoryName} Defense
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Certificate modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas / Preview */}
        <div className="p-4 sm:p-6 bg-slate-950/90 flex flex-col items-center justify-center overflow-x-auto">
          <canvas
            ref={canvasRef}
            className="w-full max-w-2xl h-auto rounded-lg shadow-2xl border border-slate-800"
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Passed with {result.percentage}% Accuracy · Officially Verifiable</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              Download High-Res PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
