import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

export function useQrTracking() {
  const location = useLocation();
  const recordQrScan = useAppStore((state) => state.recordQrScan);
  const recordQrLocationScan = useAppStore((state) => state.recordQrLocationScan);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qr = params.get('qr') ?? params.get('source');

    if (!qr) {
      return;
    }

    const route = `${location.pathname}${location.search}`;
    const locationResult = recordQrLocationScan(qr, route);

    if (!locationResult.location) {
      recordQrScan(qr, route);
    }
  }, [location.pathname, location.search, recordQrLocationScan, recordQrScan]);
}
