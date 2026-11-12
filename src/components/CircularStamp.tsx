export interface CircularStampProps {
  className?: string;
  text?: string;
}

export function CircularStamp({
  className = '',
  text = 'QUESTO MAGAZINE • ISSUE 03 • AUTUMN 2026 •',
}: CircularStampProps) {
  return (
    <div
      className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center select-none group cursor-pointer ${className}`}
      aria-label="Publication edition stamp"
      title="Questo Magazine • Autumn 2026"
    >
      {/* Outer Rotating SVG Circular Typography */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full animate-[spin_20s_linear_infinite] group-hover:[animation-duration:8s] transition-all"
        aria-hidden="true"
      >
        <path
          id="stampCirclePath"
          d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          fill="none"
        />
        <text className="font-sans text-[9px] uppercase tracking-[0.24em] fill-editorial-text font-bold opacity-80">
          <textPath href="#stampCirclePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center 3D Isometric Geometric Wireframe Emblem (as seen in Framer reference) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 rounded-full border border-editorial-border bg-editorial-surface/80 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
          <svg
            className="w-5 h-5 text-editorial-text"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Isometric Cube / Wireframe Layers */}
            <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

