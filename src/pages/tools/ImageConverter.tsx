import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PhotoIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../../components/Seo';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useLanguage } from '../../lib/lang-context';
import { Button } from '../../components/ui/button';

type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

interface ConvertedResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: OutputFormat;
}

export function ImageConverter() {
  const { t, localePath } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ConvertedResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Tools', href: localePath('/tools') },
    { label: 'Client-Side Image Converter' },
  ];

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, GIF, BMP).');
      return;
    }

    setSelectedFile(file);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = objectUrl;
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(h * aspectRatio));
    }
  };

  const processImage = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const w = targetWidth > 0 ? targetWidth : img.naturalWidth;
      const h = targetHeight > 0 ? targetHeight : img.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // If converting to JPEG, paint white background for transparent pixels
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          if (result?.url) URL.revokeObjectURL(result.url);
          const convertedUrl = URL.createObjectURL(blob);
          setResult({
            blob,
            url: convertedUrl,
            size: blob.size,
            width: w,
            height: h,
            format: outputFormat,
          });
          setIsProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : quality / 100
      );
    } catch {
      setIsProcessing(false);
    }
  }, [selectedFile, previewUrl, targetWidth, targetHeight, outputFormat, quality, result]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [previewUrl, result]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getExtension = (mime: OutputFormat) => {
    switch (mime) {
      case 'image/webp':
        return 'webp';
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'webp';
    }
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
    const ext = getExtension(result.format);
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `${originalName}-questo.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sizeReduction =
    selectedFile && result
      ? Math.round(((selectedFile.size - result.size) / selectedFile.size) * 100)
      : null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <Seo
        title="Client-Side Image Converter & Compressor — Zero Server Upload | Questo Tools"
        description="Convert, compress, and resize images directly in your browser. Supports WebP, PNG, JPEG with 100% privacy, zero latency, and zero server uploads."
        pathname="/tools/image-converter"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Client-Side Web API • Zero Server Cost • Complete Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-editorial-text">
          Image Converter &amp; Optimization Engine
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          Instantly transform, compress, and resize high-resolution images in your browser using the HTML5 Canvas and Blob API. No files are ever sent to an external server.
        </p>
      </div>

      {/* Main Tool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & Upload */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-editorial-border hover:border-editorial-text/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-editorial-surface/40 hover:bg-editorial-surface/80 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <PhotoIcon className="w-12 h-12 mx-auto text-editorial-muted group-hover:text-editorial-text transition-colors" />
            <p className="mt-3 text-sm font-semibold text-editorial-text font-sans">
              Click to select an image or drag &amp; drop
            </p>
            <p className="text-xs text-editorial-muted mt-1 font-mono">
              Supports PNG, JPG, WebP, GIF, SVG, BMP (Up to 50MB)
            </p>
          </div>

          {selectedFile && (
            <div className="space-y-5 bg-editorial-surface border border-editorial-border rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <span className="text-xs font-mono uppercase text-editorial-muted">Source Details</span>
                <span className="text-xs font-mono font-medium text-editorial-text">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-editorial-muted block font-sans">
                  Target Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image/webp', 'image/jpeg', 'image/png'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-2 px-3 text-xs font-mono uppercase rounded-lg border transition-all cursor-pointer ${
                        outputFormat === fmt
                          ? 'bg-editorial-text text-editorial-bg border-editorial-text font-bold'
                          : 'bg-editorial-bg text-editorial-text border-editorial-border hover:border-editorial-text'
                      }`}
                    >
                      {fmt.replace('image/', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider (for lossy formats) */}
              {outputFormat !== 'image/png' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider text-editorial-muted font-sans">
                      Compression Quality
                    </span>
                    <span className="font-mono font-bold text-editorial-text">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-editorial-text cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-editorial-muted">
                    <span>Smallest File</span>
                    <span>Balanced (85%)</span>
                    <span>Highest Quality</span>
                  </div>
                </div>
              )}

              {/* Dimensions Resizer */}
              {originalDimensions && (
                <div className="space-y-3 pt-2 border-t border-editorial-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-editorial-muted font-sans">
                      Dimensions (px)
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-editorial-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspectRatio}
                        onChange={(e) => setLockAspectRatio(e.target.checked)}
                        className="rounded border-editorial-border accent-editorial-text"
                      />
                      <span className="font-sans text-[11px]">Lock Ratio</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-editorial-muted block mb-1">Width</span>
                      <input
                        type="number"
                        min="1"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-editorial-text focus:outline-hidden focus:border-editorial-text"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-editorial-muted block mb-1">Height</span>
                      <input
                        type="number"
                        min="1"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-full bg-editorial-bg border border-editorial-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-editorial-text focus:outline-hidden focus:border-editorial-text"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Processing In Browser...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    Convert &amp; Optimize Now
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Preview & Results */}
        <div className="lg:col-span-7">
          {previewUrl ? (
            <div className="space-y-6">
              <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-editorial-text">
                    Interactive Image Canvas
                  </h3>
                  {result && (
                    <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Optimized Locally
                    </span>
                  )}
                </div>

                {/* Image Preview Container */}
                <div className="relative rounded-lg overflow-hidden border border-editorial-border bg-editorial-bg flex items-center justify-center min-h-[280px] max-h-[460px] p-2">
                  <img
                    src={result ? result.url : previewUrl}
                    alt="Image Preview"
                    className="max-h-[440px] max-w-full object-contain rounded-sm"
                  />
                </div>

                {/* Conversion Stats Banner */}
                {result && selectedFile && (
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-editorial-bg border border-editorial-border text-center">
                    <div>
                      <span className="text-[10px] font-mono text-editorial-muted uppercase block">Original</span>
                      <span className="text-sm font-mono font-bold text-editorial-text">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-editorial-muted uppercase block">Converted</span>
                      <span className="text-sm font-mono font-bold text-editorial-text">
                        {formatFileSize(result.size)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-editorial-muted uppercase block">Reduction</span>
                      <span
                        className={`text-sm font-mono font-bold ${
                          sizeReduction && sizeReduction > 0 ? 'text-emerald-500' : 'text-editorial-text'
                        }`}
                      >
                        {sizeReduction && sizeReduction > 0 ? `-${sizeReduction}%` : 'Lossless'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Download Button */}
                {result && (
                  <Button
                    onClick={handleDownload}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 me-2" />
                    Download Converted Image ({getExtension(result.format).toUpperCase()})
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center rounded-xl border border-editorial-border bg-editorial-surface/30 p-8 text-center text-editorial-muted">
              <DocumentDuplicateIcon className="w-12 h-12 mb-3 text-editorial-muted/40" />
              <p className="font-serif text-base text-editorial-text">No image selected</p>
              <p className="text-xs font-mono max-w-sm mt-1">
                Upload any JPG, PNG, or WebP file to begin converting and compressing with 100% browser privacy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Documentation & E-E-A-T Guide */}
      <div className="pt-8 border-t border-editorial-border grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-editorial-muted">
        <div className="space-y-2">
          <h4 className="font-semibold uppercase tracking-wider text-editorial-text">Sub-Second Execution</h4>
          <p className="font-serif text-sm leading-relaxed">
            All transformations occur on the local device via HTML5 canvas bitmap memory buffers. Zero network latency and zero bandwidth footprint.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold uppercase tracking-wider text-editorial-text">Modern Next-Gen Formats</h4>
          <p className="font-serif text-sm leading-relaxed">
            Convert legacy PNG and JPEG formats to WebP to reduce web asset payload size by up to 80% while retaining structural visual fidelity.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold uppercase tracking-wider text-editorial-text">Strict Privacy Assurance</h4>
          <p className="font-serif text-sm leading-relaxed">
            Your images are processed purely inside your browser runtime. No data is stored, cached, or transmitted across any remote server.
          </p>
        </div>
      </div>
    </div>
  );
}
