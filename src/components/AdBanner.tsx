import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = "" 
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Small delay to ensure container has width and DOM is ready
    const timer = setTimeout(() => {
      if (adRef.current && !pushedRef.current) {
        // Check if the element is actually visible and has width
        const { width } = adRef.current.getBoundingClientRect();
        
        // Only push if width > 0 and it hasn't been processed yet
        if (width > 0 && !adRef.current.getAttribute('data-adsbygoogle-status')) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true;
          } catch (e) {
            console.error("AdSense error:", e);
          }
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`ad-container my-8 overflow-hidden rounded-xl bg-slate-100/50 flex items-center justify-center min-h-[100px] border border-dashed border-slate-200 relative ${className}`}>
      {/* Placeholder for when ads are not loading or in development */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Advertisement</span>
      </div>
      
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', minHeight: '100px' }}
        data-ad-client="ca-pub-9439085694769474"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
