import { useCallback, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { RemoteDataProvider } from './components/RemoteDataProvider';
import { SmartHealthEntry } from './components/SmartHealthEntry';
import { SplashScreen } from './components/SplashScreen';
import { AppRoutes } from './routes/AppRoutes';
import { useAppStore } from './store/appStore';

function getAppPath() {
  // HashRouter stores the path inside window.location.hash (e.g. "#/admin/")
  return window.location.hash.replace(/^#/, '') || '/';
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
      <HashRouter>
        <AppRoutes />
        <SmartHealthEntry force={forceEntry} onDone={() => setSmartEntryDone(true)} visible={smartEntryVisible} />
      </HashRouter>
    </RemoteDataProvider>
  );
}

export default App;
