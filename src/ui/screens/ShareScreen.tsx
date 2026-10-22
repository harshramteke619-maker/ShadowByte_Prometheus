// src/ui/screens/ShareScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { data, i18n } from '../../api';

export const ShareScreen: React.FC = () => {
  const [packString, setPackString] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    data.exportPack().then(async (str) => {
      setPackString(str);
      if (str.length < 2500) {
        try {
          const url = await QRCode.toDataURL(str, { width: 220, margin: 2 });
          setQrDataUrl(url);
        } catch {
          // ignore
        }
      }
    });
  }, []);

  const handleDownloadFile = () => {
    const blob = new Blob([packString], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offline_lessons_${Date.now()}.pack`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const added = await data.importPack(content);
        setImportStatus(`Successfully added ${added} lesson(s)!`);
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const toggleScanner = async () => {
    if (isScanning) {
      setIsScanning(false);
      return;
    }
    setIsScanning(true);
    // Dynamic import for html5-qrcode to keep initial bundle light
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      const scanner = new Html5QrcodeScanner(
        'qr-reader-container',
        { fps: 10, qrbox: { width: 200, height: 200 } },
        false
      );

      scanner.render(
        async (decodedText) => {
          const added = await data.importPack(decodedText);
          setImportStatus(`QR Scanned! Added ${added} lesson(s).`);
          scanner.clear();
          setIsScanning(false);
        },
        () => {}
      );
    } catch {
      setImportStatus('Camera scanner not available. Please use file upload.');
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-extrabold text-slate-900">{i18n.t('share')}</h2>
        <p className="text-xs text-slate-500">
          Share lessons peer-to-peer via QR code or file without internet
        </p>
      </div>

      {/* Success Notification */}
      {importStatus && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold p-3 rounded-xl text-center shadow-xs animate-bounce">
          {importStatus}
        </div>
      )}

      {/* Section 1: Export */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>📤</span> {i18n.t('exportTitle')}
        </h3>

        {qrDataUrl ? (
          <div className="flex flex-col items-center justify-center space-y-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <img src={qrDataUrl} alt="Lesson Pack QR" className="w-52 h-52 rounded-lg" />
            <span className="text-[11px] text-slate-500">Scan this on another phone</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Lesson pack is optimized for file sharing.
          </p>
        )}

        <button
          onClick={handleDownloadFile}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span>💾</span> {i18n.t('downloadPack')}
        </button>
      </div>

      {/* Section 2: Receive / Import */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>📥</span> {i18n.t('scanTitle')}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={toggleScanner}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold p-3 rounded-xl border border-indigo-200 text-xs flex flex-col items-center gap-1.5 transition-colors"
          >
            <span className="text-xl">📷</span>
            <span>{isScanning ? 'Close Scanner' : 'Scan QR'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold p-3 rounded-xl border border-slate-200 text-xs flex flex-col items-center gap-1.5 transition-colors"
          >
            <span className="text-xl">📁</span>
            <span>{i18n.t('uploadPack')}</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pack,.json,.txt"
          className="hidden"
        />

        {isScanning && (
          <div id="qr-reader-container" className="rounded-xl overflow-hidden border border-slate-200 mt-2" />
        )}
      </div>
    </div>
  );
};
