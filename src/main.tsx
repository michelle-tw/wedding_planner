import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts (compiled into the build via Fontsource — no runtime
// CDN calls, so the app stays fully offline-capable). Be Vietnam Pro is
// drawn by a Vietnamese foundry with correct tone-mark hinting; Playfair
// Display carries the wedding-stationery serif elegance for headings and
// includes proper Vietnamese glyph support.
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';

import './index.css';
import './i18n';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
