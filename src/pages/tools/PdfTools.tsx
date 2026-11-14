import { useState, useRef } from 'react';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  PrinterIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../../components/Seo';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useLanguage } from '../../lib/lang-context';
import { Button } from '../../components/ui/button';

export function PdfTools() {
  const { t, localePath } = useLanguage();
  const [activeTab, setActiveTab] = useState<'create' | 'inspect'>('create');

  // Generator State
  const [docTitle, setDocTitle] = useState('Research Monograph: Contemporary Typographic Permanence');
  const [docAuthor, setDocAuthor] = useState('Questo Editorial Council');
  const [docCategory, setDocCategory] = useState('Design & Typography');
  const [docContent, setDocContent] = useState(
    'In an era characterized by rapid ephemerality and transient digital interfaces, typographic permanence stands as a deliberate counterbalance. Drawing inspiration from Swiss International Style and modernist grid theory, this document examines how disciplined letterforms establish timeless editorial weight.'
  );

  // Inspector State
  const [pdfMeta, setPdfMeta] = useState<{
    name: string;
    size: string;
    lastModified: string;
    type: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Tools', href: localePath('/tools') },
    { label: 'In-Browser PDF Suite' },
  ];

  const handlePrintPdf = () => {
    // Generate clean printable document in an isolated iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 25mm 20mm 25mm 20mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #111;
              line-height: 1.6;
              padding: 0;
              margin: 0;
            }
            .header {
              border-bottom: 2px solid #000;
              padding-bottom: 12px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }
            .logo {
              font-weight: 900;
              letter-spacing: -0.05em;
              font-size: 18px;
            }
            .category {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #666;
            }
            h1 {
              font-size: 26px;
              line-height: 1.25;
              margin: 0 0 12px 0;
              font-weight: 800;
              letter-spacing: -0.02em;
            }
            .meta {
              font-size: 12px;
              color: #555;
              margin-bottom: 24px;
            }
            .content {
              font-size: 14px;
              line-height: 1.8;
              text-align: justify;
            }
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              border-top: 1px solid #ddd;
              padding-top: 8px;
              font-size: 10px;
              color: #888;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="logo">QUESTO MAGAZINE</span>
            <span class="category">${docCategory}</span>
          </div>
          <h1>${docTitle}</h1>
          <div class="meta">Authored by <strong>${docAuthor}</strong> • Generated via Questo Client PDF Suite</div>
          <div class="content">
            ${docContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}
          </div>
          <div class="footer">
            <span>Official Questo Editorial Document</span>
            <span>Zero-Server In-Browser Assembly</span>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 500);
  };

  const handleInspectFile = (file: File) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(file.size) / Math.log(k));
    const sizeFormatted = parseFloat((file.size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

    setPdfMeta({
      name: file.name,
      size: sizeFormatted,
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      type: file.type || 'application/pdf',
    });
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <Seo
        title="Zero-Server PDF Suite — In-Browser Document Generator & Inspector | Questo Tools"
        description="Format, generate, print, and inspect PDF documents directly in your browser. 100% private, zero server footprint, lightning-fast execution."
        pathname="/tools/pdf-tools"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero Server Upload • CSS Paged Media • Pure Client Execution</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-editorial-text">
          Client-Side PDF Document Suite
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          Format, inspect, and generate publication-grade PDF documents directly in the browser with precision typography and zero remote server processing.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-editorial-border gap-6 text-xs uppercase tracking-wider font-semibold font-sans">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'create'
              ? 'border-editorial-text text-editorial-text'
              : 'border-transparent text-editorial-muted hover:text-editorial-text'
          }`}
        >
          PDF Document Creator &amp; Print Engine
        </button>
        <button
          onClick={() => setActiveTab('inspect')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'inspect'
              ? 'border-editorial-text text-editorial-text'
              : 'border-transparent text-editorial-muted hover:text-editorial-text'
          }`}
        >
          PDF File Inspector &amp; Metadata Reader
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-6">
            <h3 className="text-sm font-sans uppercase font-semibold text-editorial-text">Document Blueprint</h3>

            <div>
              <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Headline</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-sans text-editorial-text focus:outline-hidden focus:border-editorial-text"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Author</label>
                <input
                  type="text"
                  value={docAuthor}
                  onChange={(e) => setDocAuthor(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-sans text-editorial-text focus:outline-hidden focus:border-editorial-text"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Discipline</label>
                <input
                  type="text"
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-3 py-2 text-xs font-sans text-editorial-text focus:outline-hidden focus:border-editorial-text"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-editorial-muted block mb-1">Monograph Content</label>
              <textarea
                rows={6}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full bg-editorial-bg border border-editorial-border rounded-lg p-3 text-xs font-serif leading-relaxed text-editorial-text focus:outline-hidden focus:border-editorial-text"
              />
            </div>

            <Button
              onClick={handlePrintPdf}
              className="w-full py-3 bg-editorial-text text-editorial-bg hover:opacity-90 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-md"
            >
              <PrinterIcon className="w-4 h-4 me-2" />
              Print or Save as PDF (A4)
            </Button>
          </div>

          {/* Live Preview Paper */}
          <div className="lg:col-span-7">
            <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-editorial-muted">
                <span>Print Layout Preview (A4 Scaled)</span>
                <span>CSS Paged Media</span>
              </div>

              <div className="bg-white text-zinc-900 rounded-lg p-8 sm:p-10 shadow-lg border border-zinc-200 min-h-[460px] space-y-6">
                <div className="border-b-2 border-black pb-3 flex justify-between items-baseline">
                  <span className="font-extrabold tracking-tighter text-sm font-sans">QUESTO MAGAZINE</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-600">{docCategory}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-zinc-950 leading-tight">
                  {docTitle}
                </h2>

                <p className="text-xs font-mono text-zinc-600">
                  Authored by <strong className="text-zinc-900">{docAuthor}</strong> • Generated via Questo Client PDF Suite
                </p>

                <p className="text-sm font-serif leading-relaxed text-zinc-800 text-justify">
                  {docContent}
                </p>

                <div className="pt-8 border-t border-zinc-200 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Official Questo Editorial Document</span>
                  <span>Zero-Server In-Browser Assembly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Inspect Tab */
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleInspectFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-editorial-border hover:border-editorial-text/60 rounded-xl p-10 text-center cursor-pointer transition-colors bg-editorial-surface/40 hover:bg-editorial-surface/80 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleInspectFile(e.target.files[0])}
            />
            <DocumentTextIcon className="w-12 h-12 mx-auto text-editorial-muted group-hover:text-editorial-text transition-colors" />
            <p className="mt-3 text-sm font-semibold text-editorial-text font-sans">
              Select or drop any PDF file to inspect
            </p>
            <p className="text-xs text-editorial-muted mt-1 font-mono">
              Metadata, byte size, and structure are inspected locally without uploading.
            </p>
          </div>

          {pdfMeta && (
            <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-sans uppercase font-semibold text-editorial-text">
                  File Metadata Inspected
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                  <span className="text-[10px] font-mono text-editorial-muted block">File Name</span>
                  <span className="text-xs font-mono font-bold text-editorial-text truncate block">
                    {pdfMeta.name}
                  </span>
                </div>
                <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                  <span className="text-[10px] font-mono text-editorial-muted block">Payload Size</span>
                  <span className="text-xs font-mono font-bold text-editorial-text">{pdfMeta.size}</span>
                </div>
                <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                  <span className="text-[10px] font-mono text-editorial-muted block">Last Modified</span>
                  <span className="text-xs font-mono font-bold text-editorial-text">{pdfMeta.lastModified}</span>
                </div>
                <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg">
                  <span className="text-[10px] font-mono text-editorial-muted block">MIME Type</span>
                  <span className="text-xs font-mono font-bold text-editorial-text">{pdfMeta.type}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
