import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

function AppWithPreloader() {
  useEffect(() => {
    const preloader = document.getElementById('ximnanzas-preloader');
    if (!preloader) return;
    const remainingTime = Math.max(0, 4500 - performance.now());
    let removeTimer: number | undefined;
    const fadeTimer = window.setTimeout(() => {
      preloader.setAttribute('data-ready', '');
      preloader.setAttribute('aria-hidden', 'true');
      removeTimer = window.setTimeout(() => preloader.remove(), 500);
    }, remainingTime);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);
  return <App />;
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <AppWithPreloader />
  </ErrorBoundary>,
);

