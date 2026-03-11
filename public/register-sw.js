if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        // Force update to ensure we don't get stuck with the old 403-cached version
        registration.update();
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
