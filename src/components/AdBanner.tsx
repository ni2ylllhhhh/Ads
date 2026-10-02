import React, { useState, useEffect, useRef } from 'react';

interface AdBannerProps {
  index: number;
}

export const AdBanner: React.FC<AdBannerProps> = ({ index }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasError, setHasError] = useState(false);

  // Alternate banners: even index gets key 1, odd index gets key 2
  const adKey = index % 2 === 0
    ? 'a3b363fb834c96728d56dc453a7ad4dd'
    : '9120e6932cff4b0757e097740b2e83a4';

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
      width: 300px;
      height: 250px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://glamourpicklessteward.com/${adKey}/invoke.js"></script>
</body>
</html>`;

  return (
    <div className="w-[300px] h-[250px] bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden flex flex-col items-center justify-center relative shadow-xs">
      <iframe
        ref={iframeRef}
        srcDoc={adHtml}
        title={`Advertisement Banner #${index + 1}`}
        width="300"
        height="250"
        scrolling="no"
        className="w-[300px] h-[250px] border-0 select-none"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-400 bg-neutral-100">
          <span className="font-semibold text-neutral-500 mb-1">বিজ্ঞাপন #{index + 1}</span>
          <span>300 × 250 Ad Banner</span>
        </div>
      )}
    </div>
  );
};
