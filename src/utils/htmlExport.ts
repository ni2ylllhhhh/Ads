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

  const isGoGo = typeof value === 'string' && value.toLowerCase().includes('go');
  const currentSec = typeof value === 'number' ? value : (parseInt(String(value), 10) || 0);
  const needleAngle = isGoGo ? 360 : Math.max(0, Math.min(360, ((59 - currentSec) / 59) * 360));

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
    <linearGradient id="needleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF5500" />
      <stop offset="100%" stop-color="#DC2626" />
    </linearGradient>
    <!-- Unique Multi-Color Chromatic Neon Gradient for Numbers -->
    <linearGradient id="uniqueNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF000" />
      <stop offset="22%" stop-color="#FF007A" />
      <stop offset="48%" stop-color="#7928CA" />
      <stop offset="76%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#00FF87" />
    </linearGradient>
    <linearGradient id="goGoAuroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FF87" />
      <stop offset="50%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#FFE600" />
    </linearGradient>
    <filter id="digitNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#FF007A" flood-opacity="0.5" />
      <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#00E5FF" flood-opacity="0.4" />
    </filter>
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

  <!-- Mechanical Clock Hand Needle (ঘড়ির কাঁটা) -->
  <g id="needle-group" transform="rotate(${needleAngle} 250 295)" style="transition: transform 0.15s ease-out; pointer-events: none;">
    <line x1="250" y1="319" x2="250" y2="153" stroke="rgba(0,0,0,0.3)" stroke-width="4.5" stroke-linecap="round" transform="translate(2, 3)" />
    <line x1="250" y1="295" x2="250" y2="319" stroke="#EA580C" stroke-width="4" stroke-linecap="round" />
    <circle cx="250" cy="319" r="5" fill="#DC2626" />
    <path d="M 247.2 295 L 248.8 157 L 250 147 L 251.2 157 L 252.8 295 Z" fill="url(#needleGrad)" />
    <circle cx="250" cy="149" r="4" fill="#FFF000" />
    <circle cx="250" cy="295" r="8.5" fill="#0F172A" stroke="#FF6B00" stroke-width="2.5" />
    <circle cx="250" cy="295" r="3" fill="#FFFFFF" />
  </g>

  <!-- Center Value in Unique Chromatic Neon Gradient with Glow & Outline -->
  <text id="timer-display" x="250" y="${isGoGo ? 320 : 334}" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="${isGoGo ? 72 : 124}" font-weight="900" fill="${isGoGo ? 'url(#goGoAuroraGrad)' : 'url(#uniqueNeonGrad)'}" filter="url(#digitNeonGlow)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" letter-spacing="${isGoGo ? 1 : -3}" style="text-transform: uppercase;">
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

  // User Ad Units configurations (468x60, 300x250, 320x50, 160x300, 160x600)
  const USER_ADS = [
    { key: 'eaa4fef8b0f5d93fee9ae7712f89669a', width: 468, height: 60, name: '468x60 Banner' },
    { key: '04735843ad84a3fe40af2adeae615bcc', width: 300, height: 250, name: '300x250 Medium Rectangle #1 (A)' },
    { key: '9f8dfbea36991768186bae9257ff020f', width: 320, height: 50, name: '320x50 Mobile Leaderboard' },
    { key: 'f805ec9e8c8fed3fd38bf809a245bf29', width: 160, height: 300, name: '160x300 Half Page Skyscraper' },
    { key: '911ee250303f0d466e6e2cab58b077e0', width: 300, height: 250, name: '300x250 Medium Rectangle #2 (B)' },
    { key: '1e697e3aca05db162956807313b69d9c', width: 160, height: 600, name: '160x600 Wide Skyscraper' },
  ];

  // 6 Diverse multi-format ad slots
  const multiSlots = USER_ADS.map((ad) => `
    <div class="ad-slot" style="width: ${ad.width}px; height: ${ad.height}px;">
      <iframe
        srcdoc="<!DOCTYPE html><html><head><meta charset='utf-8'><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fafafa;display:flex;align-items:center;justify-content:center;width:${ad.width}px;height:${ad.height}px;overflow:hidden;}</style></head><body><script>atOptions={'key':'${ad.key}','format':'iframe','height':${ad.height},'width':${ad.width},'params':{}};</script><script src='https://glamourpicklessteward.com/${ad.key}/invoke.js'></script></body></html>"
        width="${ad.width}"
        height="${ad.height}"
        frameborder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      ></iframe>
    </div>
  `).join('\n');

  // 50 Dedicated 300x250 ad slots alternating between Banner A and Banner B (একটা পরে পরে)
  const rectSlots = Array.from({ length: 50 }, (_, i) => {
    const key = i % 2 === 0 ? '04735843ad84a3fe40af2adeae615bcc' : '911ee250303f0d466e6e2cab58b077e0';
    return `
    <div class="ad-slot ad-300-250">
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
      padding-bottom: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .multi-ads {
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: center;
      width: 100%;
      margin-bottom: 24px;
    }
    .grid-300-250 {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .ad-slot {
      background: #f8f8f8;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .ad-300-250 {
      width: 300px;
      height: 250px;
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

  <!-- Diverse Banners + 50 x 300x250 Ads -->
  <main class="ads-container">
    <div class="multi-ads">
      ${multiSlots}
    </div>
    <div class="grid-300-250">
      ${rectSlots}
    </div>
  </main>

  ${isInteractive ? `
  <script>
    let remaining = ${initialSeconds};
    let isRunning = true;
    let timerId = null;

    const displayEl = document.getElementById('timer-display');
    const needleEl = document.getElementById('needle-group');
    const container = document.getElementById('timer-container');

    // Web Audio Synthesizer for Clock Ticking (ঘড়ির কাটার শব্দ)
    let audioCtx = null;
    function getAudio() {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    let tickToggle = false;
    function playClockTick() {
      try {
        const ctx = getAudio();
        if (!ctx) return;
        tickToggle = !tickToggle;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tickToggle ? 1800 : 1420, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.024);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.022);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      } catch (e) {}
    }

    function playChime() {
      try {
        const ctx = getAudio();
        if (!ctx) return;
        const notes = [587.33, 739.99, 880.0];
        const now = ctx.currentTime;
        notes.forEach((freq, idx) => {
          const st = now + idx * 0.14;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0.2, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.5);
        });
      } catch (e) {}
    }

    // Auto Countdown Loop (Shows 'go go' when time finishes)
    function updateDisplay(val) {
      const isGo = typeof val === 'string' && val.toLowerCase().includes('go');
      if (displayEl) {
        displayEl.textContent = val;
        displayEl.setAttribute('fill', isGo ? 'url(#goGoAuroraGrad)' : 'url(#uniqueNeonGrad)');
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
      if (needleEl) {
        const sec = typeof val === 'number' ? val : (parseInt(val, 10) || 0);
        const nAngle = isGo ? 360 : Math.max(0, Math.min(360, ((59 - sec) / 59) * 360));
        needleEl.setAttribute('transform', 'rotate(' + nAngle + ' 250 295)');
      }
    }

    function startTimer() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        if (remaining > 1) {
          remaining--;
          playClockTick();
          updateDisplay(remaining);
        } else {
          remaining = 0;
          isRunning = false;
          stopTimer();
          playChime();
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
        getAudio();
        if (remaining === 0) {
          remaining = ${initialSeconds};
          isRunning = true;
          startTimer();
          updateDisplay(remaining);
        }
      });
    }

    // Unlock audio on first user touch/click
    const unlock = () => { getAudio(); };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    // Clean reset on refresh/load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Start timer initially on refresh/load
    startTimer();

    // Perpetual continuous scrolling state (never stops even after go go appears)
    let isTabActive = true;

    // Pause timer when user leaves website/tab, resume when returning
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabActive = false;
        isRunning = false;
        stopTimer();
      } else {
        isTabActive = true;
        if (remaining > 0) {
          isRunning = true;
          startTimer();
        }
      }
    });

    window.addEventListener('pagehide', () => {
      isTabActive = false;
      isRunning = false;
      stopTimer();
    });

    window.addEventListener('pageshow', () => {
      isTabActive = true;
      if (remaining > 0) {
        isRunning = true;
        startTimer();
      }
    });

    // Continuous Auto Scroll (Traverses in ~11s, completes > 2 full round trips per minute, never stops!)
    let scrollDirection = 1;
    let isPausing = false;
    let lastTime = performance.now();

    function autoScroll(now) {
      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      // Scroll continuously on this page, even after 'go go' arrives!
      if (isTabActive && !isPausing) {
        const currentY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll > 10) {
          // Exactly ~30 seconds (30000ms) to scroll full page (gentle, relaxed, slow smooth pace)
          const speed = (maxScroll / 30000) * delta;

          if (scrollDirection === 1) {
            if (currentY >= maxScroll - 3) {
              isPausing = true;
              setTimeout(() => {
                scrollDirection = -1;
                isPausing = false;
                lastTime = performance.now();
              }, 500);
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
              }, 500);
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
