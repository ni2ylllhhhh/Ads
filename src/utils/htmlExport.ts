/**
 * Standalone HTML and SVG generator for the Stopwatch Timer.
 * Produces clean, dependency-free HTML that opens directly in any browser.
 */

export interface StandaloneHtmlOptions {
  initialValue: string | number;
  initialUnit: 'seconds' | 'minutes';
  includeTimerJs: boolean;
  theme: 'white';
}

export function generatePureSvg(options: {
  value?: string | number;
  progressPercent?: number; // 0 to 100
  showNotches?: boolean;
} = {}): string {
  const { value = '59', progressPercent = 100, showNotches = false } = options;

  // ViewBox: 0 0 500 540
  const cx = 250;
  const cy = 295;
  const r = 175;
  const rIn = 120;
  const rOut = 168;

  // Compute 12 tick marks (every 30 deg)
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = cx + Math.sin(angle) * (r - 7);
    const y1 = cy - Math.cos(angle) * (r - 7);
    const x2 = cx + Math.sin(angle) * (r - 22);
    const y2 = cy - Math.cos(angle) * (r - 22);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#1E293B" stroke-width="7" stroke-linecap="round" />`;
  }).join('\n      ');

  const angleDeg = Math.min(360, Math.max(0.1, (progressPercent / 100) * 360));
  const angleRad = (angleDeg * Math.PI) / 180;
  const largeArcFlag = angleDeg > 180 ? 1 : 0;

  const startX_out = cx;
  const startY_out = cy - rOut;
  const endX_out = cx + Math.sin(angleRad) * rOut;
  const endY_out = cy - Math.cos(angleRad) * rOut;

  const endX_in = cx + Math.sin(angleRad) * rIn;
  const endY_in = cy - Math.cos(angleRad) * rIn;
  const startX_in = cx;
  const startY_in = cy - rIn;

  const sectorPath = `M ${startX_out.toFixed(1)} ${startY_out.toFixed(1)}
    A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${endX_out.toFixed(1)} ${endY_out.toFixed(1)}
    L ${endX_in.toFixed(1)} ${endY_in.toFixed(1)}
    A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${startX_in.toFixed(1)} ${startY_in.toFixed(1)}
    Z`;

  const isGoGo = typeof value === 'string' && value.toLowerCase().includes('go');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 540" width="100%" height="100%" fill="none" style="display: block; max-width: 480px; margin: 0 auto; user-select: none;">
  <defs>
    <linearGradient id="flameArc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00" />
      <stop offset="50%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#DC2626" />
    </linearGradient>
    <linearGradient id="ringFlame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="100%" stop-color="#B91C1C" />
    </linearGradient>
    <linearGradient id="numRedBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="42%" stop-color="#DC2626" />
      <stop offset="58%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <radialGradient id="numGreenGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0.92" />
      <stop offset="55%" stop-color="#047857" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="numBlueGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.92" />
      <stop offset="55%" stop-color="#1E40AF" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="numWhiteGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="45%" stop-color="#F8FAFC" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="numDarkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#0F172A" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <filter id="numBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
  </defs>

  <!-- Stopwatch Top Loop & Crown -->
  <g class="stopwatch-top" id="crown-button">
    <!-- Top Loop (Bow ring) -->
    <path d="M 206 62 C 206 32, 294 32, 294 62 C 294 92, 206 92, 206 62 Z" stroke="url(#ringFlame)" stroke-width="15" fill="none" stroke-linejoin="round" />
    <!-- Crown inner button cap -->
    <rect x="237" y="60" width="26" height="28" rx="7" fill="url(#flameArc)" />
    <!-- Collar flange -->
    <rect x="228" y="90" width="44" height="12" rx="4" fill="#C2410C" />
    <!-- Stem connecting to main dial -->
    <rect x="234" y="102" width="32" height="18" rx="2" fill="#C2410C" />
  </g>

  <!-- Left Angled Push Button with Red Light -->
  <g transform="rotate(-45 250 295)" class="stopwatch-btn-left">
    <rect x="242" y="94" width="16" height="24" rx="2" fill="#EA580C" />
    <rect x="236" y="82" width="28" height="14" rx="5" fill="#EF4444" />
    <circle cx="250" cy="89" r="3" fill="#FFFFFF" />
  </g>

  <!-- Right Angled Push Button with Blue Light -->
  <g transform="rotate(45 250 295)" class="stopwatch-btn-right">
    <rect x="242" y="94" width="16" height="24" rx="2" fill="#EA580C" />
    <rect x="236" y="82" width="28" height="14" rx="5" fill="#3B82F6" />
    <circle cx="250" cy="89" r="3" fill="#FFFFFF" />
  </g>

  <!-- Main Stopwatch Dial Outer Ring -->
  <circle cx="250" cy="295" r="175" stroke="url(#ringFlame)" stroke-width="15" fill="none" />

  <!-- 12 Dial Tick Marks -->
  <g class="ticks">
      ${ticks}
  </g>

  <!-- Progress Sector Arc (Orange to Red) -->
  <path id="progress-arc" d="${sectorPath.trim()}" fill="url(#flameArc)" />

  <!-- Deep Green, Dark, Blue & White Lights behind number inside dial -->
  <g class="num-lights">
    <ellipse cx="250" cy="312" rx="76" ry="54" fill="url(#numDarkGlow)" filter="url(#numBlur)" />
    <ellipse cx="210" cy="295" rx="68" ry="60" fill="url(#numGreenGlow)" filter="url(#numBlur)" class="siren-green" />
    <ellipse cx="290" cy="295" rx="68" ry="60" fill="url(#numBlueGlow)" filter="url(#numBlur)" class="siren-blue" />
    <circle cx="250" cy="282" r="40" fill="url(#numWhiteGlow)" filter="url(#numBlur)" class="siren-white" />
    <circle cx="202" cy="252" r="6.5" fill="#059669" class="siren-green" />
    <circle cx="298" cy="252" r="6.5" fill="#1D4ED8" class="siren-blue" />
    <circle cx="250" cy="245" r="5.5" fill="#FFFFFF" class="siren-white" />
    <circle cx="250" cy="342" r="4.5" fill="#020617" />
  </g>

  <!-- Center Value "30" or "GO GO" in Red-Blue Gradient -->
  <text id="timer-display" x="250" y="${isGoGo ? 320 : 334}" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="${isGoGo ? 72 : 124}" font-weight="900" fill="url(#numRedBlue)" letter-spacing="${isGoGo ? 1 : -3}" style="text-transform: uppercase;">
    ${value}
  </text>
</svg>`;
}

export function generateStandaloneHtml(options: {
  initialSeconds?: number;
  title?: string;
  isInteractive?: boolean;
} = {}): string {
  const {
    initialSeconds = 59,
    title = '৫৯ সেকেন্ড কাউন্টডাউন টাইমার ও বিজ্ঞাপন',
    isInteractive = true,
  } = options;

  const svgContent = generatePureSvg({ value: initialSeconds, progressPercent: (initialSeconds / 59) * 100, showNotches: false });

  // Generate 20 alternating ad slots (even = key 1, odd = key 2)
  const adSlots = Array.from({ length: 20 }, (_, i) => {
    const key = i % 2 === 0 ? 'a3b363fb834c96728d56dc453a7ad4dd' : '9120e6932cff4b0757e097740b2e83a4';
    return `
      <div class="ad-slot">
        <iframe
          srcdoc="<!DOCTYPE html><html><head><meta charset='utf-8'><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fafafa;display:flex;align-items:center;justify-content:center;width:300px;height:250px;overflow:hidden;}</style></head><body><script>atOptions={'key':'${key}','format':'iframe','height':250,'width':300,'params':{}};</script><script src='https://glamourpicklessteward.com/${key}/invoke.js'></script></body></html>"
          width="300"
          height="250"
          frameborder="0"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        ></iframe>
      </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&display=swap" rel="stylesheet">
  <!-- Social Bar Ads (3x) -->
  <script src="https://glamourpicklessteward.com/84/b6/6d/84b66d54cac3afa4ca9375365f68b717.js"></script>
  <script src="https://glamourpicklessteward.com/84/b6/6d/84b66d54cac3afa4ca9375365f68b717.js"></script>
  <script src="https://glamourpicklessteward.com/84/b6/6d/84b66d54cac3afa4ca9375365f68b717.js"></script>
  <!-- Tag Ads (3x) -->
  <script src="https://quge5.com/88/tag.min.js" data-zone="289707" async data-cfasync="false"></script>
  <script src="https://quge5.com/88/tag.min.js" data-zone="289707" async data-cfasync="false"></script>
  <script src="https://quge5.com/88/tag.min.js" data-zone="289707" async data-cfasync="false"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #ffffff;
      color: #111111;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      user-select: none;
    }
    /* Fixed Top Timer Bar without background box (lowered further for social ads) */
    .top-header {
      position: fixed;
      top: 84px;
      left: 0;
      right: 0;
      z-index: 999;
      background: transparent;
      padding: 4px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    }
    .timer-container {
      width: 100%;
      max-width: 190px;
      cursor: pointer;
      pointer-events: auto;
      position: relative;
    }
    /* Red and Blue Ambient Lights (লাল ও নীল বাতি) */
    .glow-light {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
    }
    .glow-green {
      left: -25px;
      top: 10px;
      background: radial-gradient(circle, rgba(5, 150, 105, 0.75) 0%, rgba(5, 150, 105, 0) 70%);
      filter: blur(16px);
      animation: deepPulseGreen 1.2s ease-in-out infinite alternate;
    }
    .glow-blue {
      right: -25px;
      top: 10px;
      background: radial-gradient(circle, rgba(29, 78, 216, 0.8) 0%, rgba(29, 78, 216, 0) 70%);
      filter: blur(16px);
      animation: deepPulseBlue 1.2s ease-in-out infinite alternate;
    }
    .glow-white {
      left: 50%;
      top: 15px;
      transform: translateX(-50%);
      width: 70px;
      height: 70px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
      filter: blur(12px);
      animation: deepPulseWhite 1.5s ease-in-out infinite alternate;
    }
    @keyframes deepPulseGreen {
      0% { opacity: 0.95; transform: scale(1.18); }
      100% { opacity: 0.3; transform: scale(0.86); }
    }
    @keyframes deepPulseBlue {
      0% { opacity: 0.3; transform: scale(0.86); }
      100% { opacity: 0.95; transform: scale(1.18); }
    }
    @keyframes deepPulseWhite {
      0% { opacity: 0.9; transform: scale(1.2); }
      100% { opacity: 0.25; transform: scale(0.75); }
    }
    .siren-green {
      animation: deepPulseGreen 1.2s ease-in-out infinite alternate;
      transform-origin: center;
      transform-box: fill-box;
    }
    .siren-blue {
      animation: deepPulseBlue 1.2s ease-in-out infinite alternate;
      transform-origin: center;
      transform-box: fill-box;
    }
    .siren-white {
      animation: deepPulseWhite 1.5s ease-in-out infinite alternate;
      transform-origin: center;
      transform-box: fill-box;
    }
    /* Main Ads Stream */
    .ads-container {
      max-width: 680px;
      margin: 0 auto;
      padding-top: 340px;
      padding-bottom: 80px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      align-items: center;
    }
    .ad-slot {
      width: 300px;
      height: 250px;
      background: #f8f8f8;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <!-- Fixed Top Countdown Timer with Deep Green, Blue & White Lights -->
  <header class="top-header">
    <div class="timer-container" id="timer-container" title="৩০ সেকেন্ড টাইমার">
      <div class="glow-light glow-green"></div>
      <div class="glow-light glow-blue"></div>
      <div class="glow-light glow-white"></div>
      ${svgContent}
    </div>
  </header>

  <!-- 20 Alternating Ad Banners -->
  <main class="ads-container">
    ${adSlots}
  </main>

  ${isInteractive ? `
  <script>
    let remaining = ${initialSeconds};
    let isRunning = true;
    let timerId = null;

    const displayEl = document.getElementById('timer-display');
    const arcEl = document.getElementById('progress-arc');
    const container = document.getElementById('timer-container');

    // Auto Countdown Loop (Shows 'go go' when time finishes)
    function updateDisplay(val) {
      const isGo = typeof val === 'string' && val.toLowerCase().includes('go');
      if (displayEl) {
        displayEl.textContent = val;
        if (isGo) {
          displayEl.setAttribute('font-size', '72');
          displayEl.setAttribute('y', '320');
          displayEl.setAttribute('letter-spacing', '1');
        } else {
          displayEl.setAttribute('font-size', '124');
          displayEl.setAttribute('y', '334');
          displayEl.setAttribute('letter-spacing', '-3');
        }
      }
      if (arcEl) {
        const ratio = isGo ? 0 : (val / 59);
        const cx = 250, cy = 295, rOut = 168, rIn = 120;
        const angleDeg = Math.max(0.1, ratio * 360);
        const angleRad = (angleDeg * Math.PI) / 180;
        const endX_out = cx + Math.sin(angleRad) * rOut;
        const endY_out = cy - Math.cos(angleRad) * rOut;
        const endX_in = cx + Math.sin(angleRad) * rIn;
        const endY_in = cy - Math.cos(angleRad) * rIn;
        const path = \`M \${cx} \${cy - rOut}
          A \${rOut} \${rOut} 0 0 1 \${endX_out.toFixed(1)} \${endY_out.toFixed(1)}
          L \${endX_in.toFixed(1)} \${endY_in.toFixed(1)}
          A \${rIn} \${rIn} 0 0 0 \${cx} \${cy - rIn}
          Z\`;
        arcEl.setAttribute('d', path);
      }
    }

    function startTimer() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        if (remaining > 1) {
          remaining--;
          updateDisplay(remaining);
        } else {
          remaining = 0;
          isRunning = false;
          stopTimer();
          updateDisplay('go go');
        }
      }, 1000);
    }

    function stopTimer() {
      if (timerId) clearInterval(timerId);
      timerId = null;
    }

    // Restart timer when clicking clock if finished
    if (container) {
      container.addEventListener('click', () => {
        if (remaining === 0) {
          remaining = ${initialSeconds};
          isRunning = true;
          startTimer();
          updateDisplay(remaining);
        }
      });
    }

    // Clean reset on refresh/load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Start timer initially on refresh/load
    startTimer();

    // Pause timer and scroll when user leaves website/tab, resume when returning
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        stopTimer();
      } else {
        if (remaining > 0) {
          isRunning = true;
          startTimer();
        }
      }
    });

    window.addEventListener('pagehide', () => {
      isRunning = false;
      stopTimer();
    });

    window.addEventListener('pageshow', () => {
      if (remaining > 0) {
        isRunning = true;
        startTimer();
      }
    });

    // Continuous Auto Scroll across 30 Seconds (Pauses when away)
    let scrollDirection = 1;
    let isPausing = false;
    let lastTime = performance.now();

    function autoScroll(now) {
      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      // Only scroll when user is actively on this website
      if (isRunning && !isPausing) {
        const currentY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll > 10) {
          // Exactly 59 seconds (59000ms) to scroll full page
          const speed = (maxScroll / 59000) * delta;

          if (scrollDirection === 1) {
            if (currentY >= maxScroll - 3) {
              isPausing = true;
              setTimeout(() => {
                scrollDirection = -1;
                isPausing = false;
                lastTime = performance.now();
              }, 800);
            } else {
              window.scrollBy(0, speed);
            }
          } else {
            if (currentY <= 3) {
              isPausing = true;
              setTimeout(() => {
                scrollDirection = 1;
                isPausing = false;
                lastTime = performance.now();
              }, 800);
            } else {
              window.scrollBy(0, -speed);
            }
          }
        }
      }
      requestAnimationFrame(autoScroll);
    }

    requestAnimationFrame(autoScroll);
  </script>
  ` : ''}
</body>
</html>`;
}
