import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { StopwatchVector } from './components/StopwatchVector';
import { AdBanner } from './components/AdBanner';
import { generateStandaloneHtml } from './utils/htmlExport';

export default function App() {
  // 30-second auto countdown state (displays 'go go' when time ends)
  const [displayNumber, setDisplayNumber] = useState<number | string>(30);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<1 | -1>(1); // 1 = down, -1 = up
  const isPausingAtEndRef = useRef<boolean>(false);

  // Toggle timer (no sound) - restarts from 30 if finished
  const handleToggle = useCallback(() => {
    if (isFinished) {
      setIsFinished(false);
      setDisplayNumber(30);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  }, [isFinished]);

  // Reset to original 30 (no sound)
  const handleReset = useCallback(() => {
    setIsFinished(false);
    setIsRunning(true);
    setDisplayNumber(30);
  }, []);

  // On every page refresh / load, reset scroll to top and ensure timer starts fresh at 30
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setDisplayNumber(30);
    setIsFinished(false);
    setIsRunning(true);
  }, []);

  // Pause timer & scrolling when user leaves tab/website, resume on return
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      } else {
        if (!isFinished) {
          setIsRunning(true);
        }
      }
    };

    const handlePageHide = () => {
      setIsRunning(false);
    };

    const handlePageShow = () => {
      if (!isFinished) {
        setIsRunning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [isFinished]);

  // 30-second countdown loop: when finished, stays on 'go go'
  useEffect(() => {
    if (!isRunning || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setDisplayNumber((prev) => {
        if (typeof prev === 'number') {
          if (prev <= 1) {
            setIsFinished(true);
            setIsRunning(false);
            return 'go go'; // When time is finished, "go go" is written!
          }
          return prev - 1;
        }
        return 'go go';
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isFinished]);

  // Dynamic progress arc for the 30-second scale (0 to 30/60 = 0.50)
  const progressRatio = typeof displayNumber === 'number' ? displayNumber / 60 : 0;

  // Auto-scroll loop: calibrated to complete scrolling across 30 seconds
  // Pauses when user is away from this website
  useEffect(() => {
    let lastTime = performance.now();

    const step = (now: number) => {
      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      // Only scroll when timer is actively running (user is on this website)
      if (isRunning && !isPausingAtEndRef.current) {
        const currentY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll > 10) {
          // Speed: traverses total scroll distance in exactly 30 seconds (30,000 ms)
          const speedPerMs = maxScroll / 30000;
          const dy = speedPerMs * delta;

          if (scrollDirectionRef.current === 1) {
            // Scrolling downwards
            if (currentY >= maxScroll - 3) {
              isPausingAtEndRef.current = true;
              setTimeout(() => {
                scrollDirectionRef.current = -1;
                isPausingAtEndRef.current = false;
                lastTime = performance.now();
              }, 800);
            } else {
              window.scrollBy({ top: dy, behavior: 'auto' });
            }
          } else {
            // Scrolling upwards
            if (currentY <= 3) {
              isPausingAtEndRef.current = true;
              setTimeout(() => {
                scrollDirectionRef.current = 1;
                isPausingAtEndRef.current = false;
                lastTime = performance.now();
              }, 800);
            } else {
              window.scrollBy({ top: -dy, behavior: 'auto' });
            }
          }
        }
      }

      scrollRafRef.current = requestAnimationFrame(step);
    };

    scrollRafRef.current = requestAnimationFrame(step);

    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isRunning]);

  // Copy standalone HTML code
  const handleCopyCode = async () => {
    try {
      const html = generateStandaloneHtml({
        initialSeconds: 30,
        title: '৩০ সেকেন্ড কাউন্টডাউন টাইমার ও বিজ্ঞাপন',
        isInteractive: true,
      });
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Keyboard shortcut (Space = toggle timer, R = reset, C = copy HTML)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggle();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'KeyC' && (e.ctrlKey || e.metaKey || !e.ctrlKey)) {
        if (e.key === 'c' || e.key === 'C') {
          handleCopyCode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggle, handleReset]);

  // 20 Ad items (alternating one after another)
  const adCount = 20;
  const ads = Array.from({ length: adCount }, (_, i) => i);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center selection:bg-neutral-900 selection:text-white select-none relative">
      {/* 
        Fixed Top Clock:
        Moved further down (top-20 sm:top-24) to give full clearance for social bar ads.
        Orange and Red colors (NO black), glowing red and blue ambient lights.
      */}
      <header className="fixed top-20 sm:top-24 left-0 right-0 z-40 pointer-events-none flex flex-col items-center justify-center py-1 px-4 transition-all">
        {/* Compact Stopwatch Vector */}
        <div className="w-full max-w-[190px] sm:max-w-[210px] flex items-center justify-center pointer-events-auto">
          <StopwatchVector
            value={displayNumber}
            progress={progressRatio}
            isRunning={isRunning}
            showNotches={false}
            onCrownClick={handleToggle}
            onRightButtonClick={handleToggle}
            onLeftButtonClick={handleReset}
            onFaceClick={handleToggle}
          />
        </div>

        {/* Copy HTML Button (No stop-scroll button as per requirement) */}
        <div className="absolute top-1 right-4 flex items-center pointer-events-auto">
          <button
            onClick={handleCopyCode}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="HTML কোড কপি করুন (C)"
            aria-label="Copy HTML Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 
        Main Scrolling Ads Stream:
        Positioned with padding-top to account for the lowered timer.
      */}
      <main className="w-full max-w-4xl pt-80 sm:pt-88 pb-20 px-4 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl place-items-center">
          {ads.map((idx) => (
            <div key={idx} className="flex flex-col items-center">
              <AdBanner index={idx} />
            </div>
          ))}
        </div>
      </main>

      {/* Copy notification toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          HTML কোড কপি হয়েছে!
        </div>
      )}
    </div>
  );
}
