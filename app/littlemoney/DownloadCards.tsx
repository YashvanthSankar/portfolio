'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Smartphone } from 'lucide-react';
import { legalEmail } from '@/data/littlemoney-legal';
import s from './littlemoney.module.css';

type Release = { available: boolean; version?: string; downloadRequests?: number | null };
const api = process.env.NEXT_PUBLIC_LILMONEY_API_URL?.replace(/\/$/, '');
const endpoint = api && /^https:\/\//.test(api) ? `${api}/api/releases/android` : null;
export function DownloadCards() {
  const [release, setRelease] = useState<Release>({ available: false });
  const [ios, setIos] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  useEffect(() => {
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (!endpoint) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(endpoint, { signal: controller.signal, credentials: 'omit' }).then(async res => {
      if (!res.ok) throw new Error('Release unavailable');
      const value = await res.json() as Release;
      if (typeof value.available === 'boolean') setRelease(value);
    }).catch(() => {}).finally(() => clearTimeout(timeout));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);
  async function download() {
    if (!endpoint || lock.current || ios) return;
    lock.current = true; setBusy(true); setError('');
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(endpoint, { method: 'POST', credentials: 'omit', signal: controller.signal });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Could not start the download. Please try again.');
      const url = new URL(result.downloadUrl);
      if (url.protocol !== 'https:' || !url.pathname.toLowerCase().endsWith('.apk')) throw new Error('The download link is unavailable. Please contact support.');
      if (result.counted && typeof release.downloadRequests === 'number') setRelease(old => ({ ...old, downloadRequests: (old.downloadRequests ?? 0) + 1 }));
      window.location.assign(url.href);
    } catch (err) { setError(err instanceof Error && err.name !== 'AbortError' ? err.message : 'The connection took too long. Please try again.'); }
    finally { clearTimeout(timeout); lock.current = false; setBusy(false); }
  }
  return <div className={s.downloads}>
    <div className={s.card}>
      <span className={s.badge}>{release.available ? `Android · v${release.version}` : 'Release in preparation'}</span>
      <div className={s.downloadTitle}><Smartphone size={24} /><h3>LilMoney for Android</h3></div>
      <p className={s.downloadText}>{release.available ? 'Download the APK, then open the file on your Android phone to install LilMoney.' : 'A direct APK download will be available here when the standalone release is ready. The current development build is not a public release.'}</p>
      {release.available && !ios ? <button type="button" className={s.button} onClick={() => void download()} disabled={busy}>{busy ? 'Starting download…' : 'Download Android APK'}<ArrowDownToLine size={18} /></button> : ios ? <p className={s.small}>You’re on an iPhone or iPad. The iPhone app is coming soon; an APK cannot be installed on this device.</p> : <a className={s.link} href={`mailto:${legalEmail}?subject=LilMoney%20Android%20early%20access`}>Ask about Android early access<ArrowUpRight size={16} /></a>}
      {release.available && typeof release.downloadRequests === 'number' && <div className={s.downloadCount} aria-live="polite"><strong>{new Intl.NumberFormat('en-IN').format(release.downloadRequests)}</strong><span>APK download requests</span><small>Requests started here, not verified installs or unique people.</small></div>}
      {error && <p role="alert" className={s.downloadError}>{error}</p>}
    </div>
    <div className={s.card}><span className={s.badge}>Coming soon</span><div className={s.downloadTitle}><Smartphone size={24} /><h3>LilMoney for iPhone</h3></div><p className={s.downloadText}>The iPhone version is in development. Installation details will be shared here when it is ready.</p><a className={s.link} href={`mailto:${legalEmail}?subject=LilMoney%20iPhone%20updates`}>Ask about iPhone updates<ArrowUpRight size={16} /></a></div>
  </div>;
}
