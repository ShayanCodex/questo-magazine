import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export type AdSlotType = 'above-fold' | 'in-content' | 'sidebar' | 'feed';

// Global flag to control ad banner rendering across the entire site
export const ADS_ENABLED = false;

export interface AdSlotProps {
  slotType: AdSlotType;
  slotId?: string;
  className?: string;
  enabled?: boolean;
}

export function AdSlot({ slotType, slotId, className, enabled = ADS_ENABLED }: AdSlotProps) {
  // Height configurations strictly matching IAB / Google AdSense standards to ensure 0.00 CLS
  const config = {
    'above-fold': {
      minHeight: 'min-h-[90px]',
      dimensions: 'max-w-[728px] h-[90px]',
      label: 'Leaderboard (728x90)',
    },
    'in-content': {
      minHeight: 'min-h-[250px]',
      dimensions: 'max-w-[336px] sm:max-w-[728px] h-[250px]',
      label: 'Editorial Feature (300x250 / Responsive)',
    },
    sidebar: {
      minHeight: 'min-h-[600px]',
      dimensions: 'w-[300px] h-[600px]',
      label: 'Skyscraper (300x600)',
    },
    feed: {
      minHeight: 'min-h-[120px]',
      dimensions: 'w-full h-[120px]',
      label: 'Feed Sponsor (Responsive)',
    },
  }[slotType];

  useEffect(() => {
    if (!enabled) return;
    // If running in browser and window.adsbygoogle is available, attempt push
    try {
      if (typeof window !== 'undefined' && slotId) {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;
        if (Array.isArray(adsbygoogle)) {
          adsbygoogle.push({});
        }
      }
    } catch {
      // Graceful fallback for adblockers / dev environment
    }
  }, [slotId, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center my-8 overflow-hidden rounded-xl border border-editorial-border/60 bg-editorial-surface-subtle/50 transition-all p-3',
        config.minHeight,
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Editorial Ad Label */}
      <div className="w-full flex items-center justify-between pb-1.5 px-2 border-b border-editorial-border/40 text-[10px] font-mono uppercase tracking-wider text-editorial-muted select-none">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent/60 inline-block"></span>
          <span>Advertisement</span>
        </span>
        <span className="opacity-60">{config.label}</span>
      </div>

      {/* Ad Container / Reserved Slot */}
      <div className={cn('flex items-center justify-center w-full relative', config.dimensions)}>
        {slotId ? (
          <ins
            className="adsbygoogle block w-full h-full text-center"
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="text-center p-4 space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-muted block">
              Sponsored Journal Space
            </span>
            <span className="font-serif text-[11px] text-editorial-muted/70 block">
              IAB / Google AdSense Zero-CLS Reserved Container
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdSlot;
