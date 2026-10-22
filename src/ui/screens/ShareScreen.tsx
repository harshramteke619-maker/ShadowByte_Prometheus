// src/ui/screens/ShareScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Upload, Download, Camera, CameraOff, Share2, CheckCircle } from 'lucide-react';
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
        } catch { /* ignore */ }
      }
    });
  }, []);

  const handleDownloadFile = () => {
    const blob = new Blob([packString], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `offline_lessons_${Date.now()}.pack`; a.click();
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
    if (isScanning) { setIsScanning(false); return; }
    setIsScanning(true);
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      const scanner = new Html5QrcodeScanner('qr-reader-container', { fps: 10, qrbox: { width: 200, height: 200 } }, false);
      scanner.render(
        async (decodedText) => {
          const added = await data.importPack(decodedText);
          setImportStatus(`QR Scanned! Added ${added} lesson(s).`);
          scanner.clear(); setIsScanning(false);
        },
        () => {}
      );
    } catch {
      setImportStatus('Camera scanner not available. Please use file upload.');
      setIsScanning(false);
    }
  };

  return (
    <div style={{
      padding: '24px 16px 96px', maxWidth: '560px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* Header */}
      <div className="anim-slide-up" style={{ textAlign: 'center' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '16px',
          background: 'var(--accent-blue-l)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <Share2 size={22} style={{ color: 'var(--accent-blue)' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {i18n.t('share')}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Share lessons peer-to-peer via QR code or file — no internet needed
        </p>
      </div>

      {/* Success toast */}
      {importStatus && (
        <div className="anim-slide-up" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--accent-teal-l)', border: '1px solid var(--accent-teal)',
          borderRadius: '12px', padding: '12px 16px',
          fontSize: '13px', fontWeight: 700, color: 'var(--accent-teal)',
        }}>
          <CheckCircle size={15} /> {importStatus}
        </div>
      )}

      {/* Export card */}
      <div className="anim-slide-up card-lift" style={{
        animationDelay: '0.08s',
        background: 'var(--bg-card)', borderRadius: '20px',
        padding: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={15} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {i18n.t('exportTitle')}
          </h3>
        </div>

        {qrDataUrl ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            background: 'var(--bg-muted)', borderRadius: '14px', padding: '16px',
            border: '1px solid var(--border)',
          }}>
            <img src={qrDataUrl} alt="Lesson Pack QR Code" style={{ width: '200px', height: '200px', borderRadius: '10px' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Scan on another phone to receive lessons
            </span>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Pack is optimised for file sharing (too large for QR).
          </p>
        )}

        <button
          onClick={handleDownloadFile}
          className="btn-press"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px', borderRadius: '14px',
            background: 'var(--text-primary)', color: 'var(--bg-base)',
            fontWeight: 700, fontSize: '13px', border: 'none',
            cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Download size={14} /> {i18n.t('downloadPack')}
        </button>
      </div>

      {/* Import card */}
      <div className="anim-slide-up card-lift" style={{
        animationDelay: '0.16s',
        background: 'var(--bg-card)', borderRadius: '20px',
        padding: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={15} style={{ color: 'var(--accent-teal)' }} />
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {i18n.t('scanTitle')}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={toggleScanner}
            className="btn-press"
            aria-label={isScanning ? 'Close QR scanner' : 'Open QR scanner'}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '16px 12px', borderRadius: '14px',
              background: isScanning ? 'var(--accent-amber-l)' : 'var(--accent-blue-l)',
              border: `1px solid ${isScanning ? 'var(--accent-amber)' : 'var(--border)'}`,
              color: isScanning ? 'var(--accent-amber)' : 'var(--accent-blue)',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer',
            }}
          >
            {isScanning ? <CameraOff size={20} /> : <Camera size={20} />}
            {isScanning ? 'Close Scanner' : 'Scan QR'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press"
            aria-label="Upload pack file"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '16px 12px', borderRadius: '14px',
              background: 'var(--bg-muted)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
            }}
          >
            <Upload size={20} />
            {i18n.t('uploadPack')}
          </button>
        </div>

        <input
          type="file" ref={fileInputRef} onChange={handleFileUpload}
          accept=".pack,.json,.txt" style={{ display: 'none' }}
        />

        {isScanning && (
          <div id="qr-reader-container" style={{
            borderRadius: '14px', overflow: 'hidden',
            border: '1px solid var(--border)', marginTop: '4px',
          }} />
        )}
      </div>
    </div>
  );
};
