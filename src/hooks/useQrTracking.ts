import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncQrScanToCentralCounter } from '../services/qrAnalyticsService';
import { useAppStore } from '../store/appStore';

export function useQrTracking() {
  const location = useLocation();
  const recordQrScan = useAppStore((state) => state.recordQrScan);
  const recordQrLocationScan = useAppStore((state) => state.recordQrLocationScan);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasLocationQr = params.has('qr');
    const qr = params.get('qr') ?? params.get('source');
    const qrName = params.get('qrName') ?? '';

    if (!qr) {
      return;
    }

    const route = `${location.pathname}${location.search}`;
    const locationResult = hasLocationQr
      ? recordQrLocationScan(qr, route, qrName)
      : ({ counted: false } as ReturnType<typeof recordQrLocationScan>);
    const counted =
      locationResult.location || locationResult.external ? locationResult.counted : recordQrScan(qr, route);

    if (counted) {
      void syncQrScanToCentralCounter(locationResult.slug ?? locationResult.location?.slug ?? qr).catch(() => undefined);
    }
  }, [location.pathname, location.search, recordQrLocationScan, recordQrScan]);
}
