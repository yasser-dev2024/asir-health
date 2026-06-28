import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncQrScanToCentralCounter } from '../services/qrAnalyticsService';
import { useAppStore } from '../store/appStore';

function getHashQueryString(hash: string) {
  const rawHash = window.location.hash || hash || '';
  const queryIndex = rawHash.indexOf('?');
  if (queryIndex < 0) {
    return '';
  }

  return rawHash.slice(queryIndex + 1);
}

export function useQrTracking() {
  const location = useLocation();
  const recordQrScan = useAppStore((state) => state.recordQrScan);
  const recordQrLocationScan = useAppStore((state) => state.recordQrLocationScan);

  useEffect(() => {
    const search = location.search || getHashQueryString(location.hash);
    const params = new URLSearchParams(search);
    const hasLocationQr = params.has('qr');
    const qr = params.get('qr') ?? params.get('source');
    const qrName = params.get('qrName') ?? '';

    if (!qr) {
      return;
    }

    const route = window.location.href;
    const locationResult = hasLocationQr
      ? recordQrLocationScan(qr, route, qrName)
      : ({ counted: false } as ReturnType<typeof recordQrLocationScan>);
    const counted =
      locationResult.location || locationResult.external ? locationResult.counted : recordQrScan(qr, route);

    if (counted) {
      void syncQrScanToCentralCounter(locationResult.slug ?? locationResult.location?.slug ?? qr, route).catch(() => undefined);
    }
  }, [location.pathname, location.search, location.hash, recordQrLocationScan, recordQrScan]);
}
