import React, { useId } from 'react';

interface StopwatchVectorProps {
  /** The value displayed in the center, e.g. "30", or countdown digits */
  value?: string | number;
  /** Progress ratio from 0 to 1 */
  progress?: number;
  /** Whether the timer is actively running */
  isRunning?: boolean;
  /** Show calibration notches on inner arc */
  showNotches?: boolean;
  /** Click handler for top crown button */
  onCrownClick?: () => void;
  /** Click handler for left angled button (reset) */
  onLeftButtonClick?: () => void;
  /** Click handler for right angled button (start/pause) */
  onRightButtonClick?: () => void;
  /** Click handler for main watch face */
  onFaceClick?: () => void;
  /** Custom class */
  className?: string;
}

export const StopwatchVector: React.FC<StopwatchVectorProps> = ({
  value = '59',
  progress = 1.0,
  isRunning = false,
  showNotches = false,
  onCrownClick,
  onLeftButtonClick,
  onRightButtonClick,
  onFaceClick,
  className = '',
}) => {
  const gradientId = useId();

  // Center coordinates & radius
  const cx = 250;
  const cy = 295;
  const rRing = 175;

  // 12 ticks around the dial
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = cx + Math.sin(angle) * (rRing - 7);
    const y1 = cy - Math.cos(angle) * (rRing - 7);
    const x2 = cx + Math.sin(angle) * (rRing - 22);
    const y2 = cy - Math.cos(angle) * (rRing - 22);
    return { x1, y1, x2, y2, key: i };
  });

  const isGoGo = typeof value === 'string' && value.toLowerCase().includes('go');

  // Mechanical clock needle rotation (0 to 360 degrees based on countdown)
  const currentSec = typeof value === 'number' ? value : 0;
  const needleAngle = isGoGo ? 360 : Math.max(0, Math.min(360, ((59 - currentSec) / 59) * 360));

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 
        Deep Ambient Lights: Green, Deep Dark, Blue & White (সবুজ কাল নীল সাদা গাঢ় বাতি)
      */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Left Glowing Deep Green Light */}
        <div className="absolute -left-7 top-4 w-36 h-36 bg-emerald-600/70 rounded-full blur-2xl animate-glow-green" />
        {/* Right Glowing Deep Blue Light */}
        <div className="absolute -right-7 top-4 w-36 h-36 bg-blue-700/75 rounded-full blur-2xl animate-glow-blue" />
        {/* Center Bright White Accent Light */}
        <div className="absolute inset-x-12 top-6 w-20 h-20 bg-white/80 rounded-full blur-xl animate-glow-white mx-auto" />
        {/* Deep Contrast Obsidian Backdrop */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/30 blur-xl" />
      </div>

      <svg
        viewBox="0 0 500 540"
        className="w-full h-auto max-w-[460px] drop-shadow-md transition-transform duration-150 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Stopwatch timer showing ${value}`}
      >
        <defs>
          {/* Radiant Orange to Red Flame Gradient */}
          <linearGradient id={`${gradientId}-flame`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          {/* Deep Crimson-Orange Ring Gradient */}
          <linearGradient id={`${gradientId}-ring`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Unique Chromatic Neon Gradient for Center Numbers (ইউনিক বহু রঙের গ্রেডিয়েন্ট) */}
          <linearGradient id={`${gradientId}-uniqueNeonNumber`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF000" />
            <stop offset="22%" stopColor="#FF007A" />
            <stop offset="48%" stopColor="#7928CA" />
            <stop offset="76%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00FF87" />
          </linearGradient>

          {/* Aurora Triumph Gradient for GO GO */}
          <linearGradient id={`${gradientId}-goGoAuroraGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF87" />
            <stop offset="50%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#FFE600" />
          </linearGradient>

          {/* Clock Needle Gradient */}
          <linearGradient id={`${gradientId}-needleGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          {/* Neon Drop Glow for Center Number */}
          <filter id={`${gradientId}-numberNeonGlow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF007A" floodOpacity="0.5" />
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#00E5FF" floodOpacity="0.4" />
          </filter>

          {/* Dual-Tone Red & Blue Gradient for Center Numbers */}
          <linearGradient id={`${gradientId}-numberRedBlue`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="42%" stopColor="#DC2626" />
            <stop offset="58%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Deep Color Glow Filters */}
          <filter id={`${gradientId}-greenglow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#059669" floodOpacity="0.9" />
          </filter>
          <filter id={`${gradientId}-blueglow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#1D4ED8" floodOpacity="0.9" />
          </filter>
          <filter id={`${gradientId}-whiteglow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FFFFFF" floodOpacity="0.95" />
          </filter>
          <filter id={`${gradientId}-darkglow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#020617" floodOpacity="0.8" />
          </filter>

          {/* Radial light gradients behind numbers (Deep Green, Blue, White, Black) */}
          <radialGradient id={`${gradientId}-numberGreenGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#047857" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradientId}-numberBlueGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#1E40AF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradientId}-numberWhiteGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="45%" stopColor="#F8FAFC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradientId}-numberDarkGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#0F172A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Number Backlight Blur Filter */}
          <filter id={`${gradientId}-numberBlur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
          </filter>
        </defs>

        {/* Top Loop Bow & Crown (Clickable winder button) */}
        <g
          className="cursor-pointer transition-transform hover:opacity-90 active:scale-95 origin-[250px_60px]"
          onClick={onCrownClick}
          role="button"
          tabIndex={0}
          aria-label="Top Crown Winder Button"
        >
          {/* Loop Ring (Pocket watch bow) */}
          <path
            d="M 204 62 C 204 30, 296 30, 296 62 C 296 94, 204 94, 204 62 Z"
            stroke={`url(#${gradientId}-ring)`}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Crown Button Cap */}
          <rect x="237" y="58" width="26" height="30" rx="7" fill={`url(#${gradientId}-flame)`} />
          {/* Collar Flange */}
          <rect x="228" y="90" width="44" height="12" rx="4" fill="#C2410C" />
          {/* Stem connecting down to dial */}
          <rect x="234" y="102" width="32" height="18" rx="2" fill="#C2410C" />
        </g>

        {/* Left Angled Push Button (-45°) with Red LED indicator light */}
        <g
          transform={`rotate(-45 ${cx} ${cy})`}
          className="cursor-pointer transition-transform hover:opacity-85 active:translate-y-1 origin-[250px_88px]"
          onClick={onLeftButtonClick}
          role="button"
          tabIndex={0}
          aria-label="Left Push Button (Reset)"
        >
          <rect x="242" y="94" width="16" height="24" rx="2" fill="#EA580C" />
          <rect x="235" y="82" width="30" height="14" rx="5" fill="#EF4444" filter={`url(#${gradientId}-redglow)`} />
          {/* Pulsing red beacon pip */}
          <circle cx="250" cy="89" r="3" fill="#FFFFFF" className="animate-pulse" />
        </g>

        {/* Right Angled Push Button (+45°) with Blue LED indicator light */}
        <g
          transform={`rotate(45 ${cx} ${cy})`}
          className="cursor-pointer transition-transform hover:opacity-85 active:translate-y-1 origin-[250px_88px]"
          onClick={onRightButtonClick}
          role="button"
          tabIndex={0}
          aria-label="Right Push Button (Start/Pause)"
        >
          <rect x="242" y="94" width="16" height="24" rx="2" fill="#EA580C" />
          <rect x="235" y="82" width="30" height="14" rx="5" fill="#3B82F6" filter={`url(#${gradientId}-blueglow)`} />
          {/* Pulsing blue beacon pip */}
          <circle cx="250" cy="89" r="3" fill="#FFFFFF" className="animate-pulse" />
        </g>

        {/* Main Dial Area */}
        <g
          className="cursor-pointer group"
          onClick={onFaceClick}
          role="button"
          tabIndex={0}
          aria-label="Click watch to toggle timer"
        >
          {/* Outer Ring with vibrant Orange-Red flame gradient */}
          <circle
            cx={cx}
            cy={cy}
            r={rRing}
            stroke={`url(#${gradientId}-ring)`}
            strokeWidth="15"
            fill="none"
          />

          {/* 12 Inward Tick Marks in Orange-Red */}
          <g>
            {ticks.map((t) => (
              <line
                key={t.key}
                x1={t.x1.toFixed(1)}
                y1={t.y1.toFixed(1)}
                x2={t.x2.toFixed(1)}
                y2={t.y2.toFixed(1)}
                stroke="#EA580C"
                strokeWidth="7"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* 
            Deep Glow Lights behind Countdown Digits: Green, Black, Blue, and White (সবুজ কাল নীল সাদা গাঢ় বাতি)
          */}
          <g className="pointer-events-none">
            {/* Deep Black/Obsidian Base Shadow for high contrast */}
            <ellipse
              cx={cx}
              cy={cy + 18}
              rx="76"
              ry="54"
              fill={`url(#${gradientId}-numberDarkGlow)`}
              filter={`url(#${gradientId}-numberBlur)`}
            />

            {/* Left Deep Green Glowing Light Orb */}
            <ellipse
              cx={cx - 40}
              cy={cy}
              rx="68"
              ry="60"
              fill={`url(#${gradientId}-numberGreenGlow)`}
              filter={`url(#${gradientId}-numberBlur)`}
              className="animate-glow-green"
            />

            {/* Right Deep Blue Glowing Light Orb */}
            <ellipse
              cx={cx + 40}
              cy={cy}
              rx="68"
              ry="60"
              fill={`url(#${gradientId}-numberBlueGlow)`}
              filter={`url(#${gradientId}-numberBlur)`}
              className="animate-glow-blue"
            />

            {/* Center Radiant White Light Core */}
            <circle
              cx={cx}
              cy={cy - 12}
              r="40"
              fill={`url(#${gradientId}-numberWhiteGlow)`}
              filter={`url(#${gradientId}-numberBlur)`}
              className="animate-glow-white"
            />

            {/* Micro Quad Beacon Sparkles (Green, Blue, White, Black) */}
            <circle
              cx={cx - 48}
              cy={cy - 44}
              r="6.5"
              fill="#059669"
              filter={`url(#${gradientId}-greenglow)`}
              className="animate-glow-green"
            />
            <circle
              cx={cx + 48}
              cy={cy - 44}
              r="6.5"
              fill="#1D4ED8"
              filter={`url(#${gradientId}-blueglow)`}
              className="animate-glow-blue"
            />
            <circle
              cx={cx}
              cy={cy - 50}
              r="5.5"
              fill="#FFFFFF"
              filter={`url(#${gradientId}-whiteglow)`}
              className="animate-glow-white"
            />
            <circle
              cx={cx}
              cy={cy + 46}
              r="4.5"
              fill="#020617"
              filter={`url(#${gradientId}-darkglow)`}
            />
          </g>

          {/* Mechanical Clock Needle (ঘড়ির কাঁটা) */}
          <g
            transform={`rotate(${needleAngle}, ${cx}, ${cy})`}
            className="transition-transform duration-150 ease-out pointer-events-none"
          >
            {/* Shadow of needle */}
            <line
              x1={cx}
              y1={cy + 24}
              x2={cx}
              y2={cy - 142}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="4.5"
              strokeLinecap="round"
              transform="translate(2, 3)"
            />
            {/* Tail counterweight */}
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy + 24}
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy + 24} r="5" fill="#DC2626" />

            {/* Main needle shaft */}
            <path
              d={`M ${cx - 2.8} ${cy} L ${cx - 1.2} ${cy - 138} L ${cx} ${cy - 148} L ${cx + 1.2} ${cy - 138} L ${cx + 2.8} ${cy} Z`}
              fill={`url(#${gradientId}-needleGrad)`}
            />

            {/* Glowing Pointer Tip Arrow */}
            <circle
              cx={cx}
              cy={cy - 146}
              r="4"
              fill="#FFF000"
              filter={`url(#${gradientId}-whiteglow)`}
            />

            {/* Center Pivot Hub Cap */}
            <circle cx={cx} cy={cy} r="8.5" fill="#0F172A" stroke="#FF6B00" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="3" fill="#FFFFFF" />
          </g>

          {/* Center Countdown Number or 'GO GO' in Unique Multi-Color Gradient with Tick Animation */}
          <g key={`num-anim-${value}`} className="animate-number-tick pointer-events-none">
            <text
              x={cx}
              y={isGoGo ? cy + 24 : cy + 39}
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontSize={isGoGo ? "72" : "126"}
              fontWeight="900"
              fill={isGoGo ? `url(#${gradientId}-goGoAuroraGrad)` : `url(#${gradientId}-uniqueNeonNumber)`}
              filter={`url(#${gradientId}-numberNeonGlow)`}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              letterSpacing={isGoGo ? "1" : "-4"}
              className="select-none tracking-tighter uppercase drop-shadow-sm"
            >
              {value}
            </text>
          </g>

          {/* Subtle running indicator pip */}
          {isRunning && (
            <circle
              cx={cx}
              cy={cy + 104}
              r="4.5"
              fill="#00E5FF"
              className="animate-ping"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
