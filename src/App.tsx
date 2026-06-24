import { useCallback, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RemoteDataProvider } from './components/RemoteDataProvider';
import { SmartHealthEntry } from './components/SmartHealthEntry';
import { SplashScreen } from './components/SplashScreen';
import { AppRoutes } from './routes/AppRoutes';
import { useAppStore } from './store/appStore';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// Restore URL from 404.html redirect (GitHub Pages SPA routing)
const _404redirect = sessionStorage.getItem('spa-404-redirect');
if (_404redirect) {
  sessionStorage.removeItem('spa-404-redirect');
  try {
    const u = new URL(_404redirect);
    const relative = u.pathname.startsWith(basePath)
      ? u.pathname.slice(basePath.length) || '/'
      : u.pathname;
    window.history.replaceState(null, '', relative + u.search + u.hash);
  } catch {
    // ignore malformed URL
  }
}

function getAppPath() {
  const path = window.location.pathname;

  if (basePath && path.startsWith(basePath)) {
    return path.slice(basePath.length) || '/';
  }

  return path;
}

function App() {
  const setSplashSeen = useAppStore((state) => state.setSplashSeen);
  const appPath = getAppPath();
  const adminPath = appPath.startsWith('/admin');
  const assistantPath = appPath === '/assistant';
  const searchParams = new URLSearchParams(window.location.search);
  const forceSplash = searchParams.get('showSplash') === '1';
  const forceEntry = searchParams.get('showEntry') === '1';
  const [splashDone, setSplashDone] = useState(false);
  const [smartEntryDone, setSmartEntryDone] = useState(false);
  const overlayAllowed = !adminPath && !assistantPath;
  const splashVisible = overlayAllowed && (forceSplash || !splashDone);
  const smartEntryVisible = overlayAllowed && !splashVisible && (forceEntry || !smartEntryDone);
  const completeSplash = useCallback(() => {
    setSplashDone(true);
    setSplashSeen();
  }, [setSplashSeen]);

  return (
    <RemoteDataProvider>
      <SplashScreen autoClose={!forceSplash} onDone={completeSplash} visible={splashVisible} />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
        <SmartHealthEntry force={forceEntry} onDone={() => setSmartEntryDone(true)} visible={smartEntryVisible} />
      </BrowserRouter>
    </RemoteDataProvider>
  );
}

export default App;
