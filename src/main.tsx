import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function AppWithPreloader() {
  useEffect(() => {
    const preloader = document.getElementById('ximnanzas-preloader');
    if (!preloader) return;
    preloader.setAttribute('data-ready', '');
    preloader.setAttribute('aria-hidden', 'true');
    const timer = window.setTimeout(() => preloader.remove(), 300);
    return () => window.clearTimeout(timer);
  }, []);
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithPreloader />
  </StrictMode>
);
