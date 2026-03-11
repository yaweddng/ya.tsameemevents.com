import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Force update check when app becomes visible
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            registration.update();
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    // Reload when new service worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// Auto-update mechanism
let currentVersion = '';
const checkVersion = async () => {
  try {
    const res = await fetch('/api/version?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (!currentVersion) {
      currentVersion = data.version;
    } else if (currentVersion !== data.version) {
      console.log('New version detected. Reloading...');
      window.location.reload();
    }
  } catch (e) {
    console.error('Failed to check version:', e);
  }
};

// Check version periodically and on visibility change
setInterval(checkVersion, 5 * 60 * 1000); // Every 5 minutes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkVersion();
  }
});
// Initial check
checkVersion();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
