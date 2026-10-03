import React, { useState, useRef } from 'react';

export interface AdConfig {
  key: string;
  width: number;
  height: number;
  name: string;
}

// 300x250 Ad Unit
export const AD_300x250: AdConfig = {
  key: '04735843ad84a3fe40af2adeae615bcc',
  width: 300,
  height: 250,
  name: '300x250 Medium Rectangle',
};

// All ad units provided by the user:
export const USER_ADS: AdConfig[] = [
  {
    key: 'eaa4fef8b0f5d93fee9ae7712f89669a',
    width: 468,
    height: 60,
    name: '468x60 Banner',
  },
  {
    key: '04735843ad84a3fe40af2adeae615bcc',
    width: 300,
    height: 250,
    name: '300x250 Medium Rectangle #1',
  },
  {
    key: '9f8dfbea36991768186bae9257ff020f',
    width: 320,
    height: 50,
    name: '320x50 Mobile Leaderboard',
  },
  {
    key: 'f805ec9e8c8fed3fd38bf809a245bf29',
    width: 160,
    height: 300,
    name: '160x300 Half Page Skyscraper',
  },
  {
    key: '04735843ad84a3fe40af2adeae615bcc',
    width: 300,
    height: 250,
    name: '300x250 Medium Rectangle #2',
  },
  {
    key: '1e697e3aca05db162956807313b69d9c',
    width: 160,
    height: 600,
    name: '160x600 Wide Skyscraper',
  },
];

interface AdBannerProps {
  index: number;
  customAd?: AdConfig;
}

export const AdBanner: React.FC<AdBannerProps> = ({ index, customAd }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasError, setHasError] = useState(false);

  // Use customAd if passed; otherwise cycle through USER_ADS
  const ad = customAd || USER_ADS[index % USER_ADS.length];

  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${ad.width}px;
      height: ${ad.height}px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key' : '${ad.key}',
      'format' : 'iframe',
      'height' : ${ad.height},
      'width' : ${ad.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://glamourpicklessteward.com/${ad.key}/invoke.js"></script>
</body>
</html>`;

  return (
    <div
      className="bg-neutral-50/90 rounded-xl border border-neutral-200/90 overflow-hidden flex flex-col items-center justify-center relative shadow-xs transition-shadow duration-200 hover:shadow-md max-w-full"
      style={{
        width: `${ad.width}px`,
        height: `${ad.height}px`,
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={adHtml}
        title={`Ad #${index + 1} - ${ad.name}`}
        width={ad.width}
        height={ad.height}
        scrolling="no"
        className="border-0 select-none block"
        style={{
          width: `${ad.width}px`,
          height: `${ad.height}px`,
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-xs text-neutral-400 bg-neutral-100">
          <span className="font-semibold text-neutral-500 mb-1">বিজ্ঞাপন #{index + 1}</span>
          <span>{ad.name}</span>
        </div>
      )}
    </div>
  );
};
