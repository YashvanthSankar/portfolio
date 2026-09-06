'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Smartphone } from 'lucide-react';
import { legalEmail } from '@/data/littlemoney-legal';
import s from './littlemoney.module.css';

type Release = { available: boolean; version?: string; downloadRequests?: number | null };
const api = process.env.NEXT_PUBLIC_LILMONEY_API_URL?.replace(/\/$/, '');
const endpoint = api && /^https:\/\//.test(api) ? `${api}/api/releases/android` : null;
const loginReady = process.env.NEXT_PUBLIC_LILMONEY_LOGIN_READY === 'true';
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
      <span className={s.badge}>{release.available ? 'Ready for Android' : 'Coming soon'}</span>
      <div className={s.downloadTitle}><Smartphone size={24} /><h3>LilMoney for Android</h3></div>
      <p className={s.downloadText}>{release.available ? 'Your everyday money, a little easier to keep track of. Download directly to your phone.' : 'We’re getting your download ready. Check back shortly.'}</p>
      {release.available && !loginReady && <p className={s.downloadText}>Early access: we’re finishing our sign-in checks.</p>}
      {release.available && !ios ? <button type="button" className={s.button} onClick={() => void download()} disabled={busy}>{busy ? 'Starting download…' : 'Download for Android'}<ArrowDownToLine size={18} /></button> : ios ? <p className={s.small}>On an iPhone? Your version is coming soon.</p> : <a className={s.link} href={`mailto:${legalEmail}?subject=LilMoney%20Android%20early%20access`}>Ask us a question<ArrowUpRight size={16} /></a>}
      {release.available && typeof release.downloadRequests === 'number' && <div className={s.downloadCount} aria-live="polite"><strong>{new Intl.NumberFormat('en-IN').format(release.downloadRequests)}</strong><span>downloads started</span><small>Times the download was started—not the number of installs.</small></div>}
      {error && <p role="alert" className={s.downloadError}>{error}</p>}
      {release.available && !ios && <details className={s.installHelp}><summary className={s.link}>Need help installing?</summary><ol><li>Tap Download, then open the file from your phone’s Downloads.</li><li>If your phone asks, allow this browser to install LilMoney. Keep Play Protect on.</li><li>Open LilMoney and sign in with Google.</li></ol><p className={s.small}>Tried an earlier test version? You may need to uninstall it first. Entries saved to your account will still be there when you sign back in.</p></details>}
    </div>
    <div className={s.card}><span className={s.badge}>Coming soon</span><div className={s.downloadTitle}><Smartphone size={24} /><h3>LilMoney for iPhone</h3></div><p className={s.downloadText}>The same simple money habits, on your iPhone. We’re working on it.</p><a className={s.link} href={`mailto:${legalEmail}?subject=LilMoney%20iPhone%20updates`}>Ask about the iPhone app<ArrowUpRight size={16} /></a></div>
  </div>;
}
