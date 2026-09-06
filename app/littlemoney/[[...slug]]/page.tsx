import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, ChartNoAxesCombined, Plus, ShieldCheck, Target } from 'lucide-react';
import { DownloadCards } from '../DownloadCards';
import { legalBase, legalDocuments, legalEmail, legalUpdated, type LegalPage } from '@/data/littlemoney-legal';
import s from '../littlemoney.module.css';

type Props = { params: Promise<{ slug?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() { return [{ slug: [] }, ...Object.keys(legalDocuments).map(key => ({ slug: [key] }))]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const key = slug?.[0] as LegalPage | undefined;
  const doc = key ? legalDocuments[key] : null;
  const title = doc ? `${doc.title} · LilMoney` : 'LilMoney — Money tracking, made simple';
  const description = doc?.summary ?? 'Track income, spending and savings in a calm, simple mobile app. Android APK release in preparation. iPhone coming soon.';
  const url = `${legalBase}${key ? `/${key}` : ''}`;
  const images = [{ url: 'https://yashvanth.com/littlemoney-brand-512.png', width: 512, height: 512, alt: 'LilMoney — blue ribbon L logo' }];
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'LilMoney', images }, twitter: { card: 'summary', title, description, images } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const key = slug?.[0] as LegalPage | undefined;
  if (slug && (slug.length > 1 || (key && !Object.hasOwn(legalDocuments, key)))) notFound();
  const doc = key ? legalDocuments[key] : null;
  return <div className={s.site} data-littlemoney><div className={s.container}>
    <header className={s.header}><Link href="/littlemoney" className={s.brand}><Image src="/littlemoney-brand-512.png" width={44} height={44} alt="" priority />LilMoney</Link><nav className={s.nav} aria-label="LilMoney"><Link href="/littlemoney#download">Get the app</Link><Link href="/littlemoney/support">Help</Link></nav></header>
    <main id="main-content">{doc && key ? <article className={s.legal}>
      <Link href="/littlemoney" className={s.link}><ArrowLeft size={16} />Back to LilMoney</Link><h1>{doc.title}</h1><p>{doc.summary}</p><p className={s.small}>Updated {legalUpdated} · Yashvanth S</p>
      <nav className={s.contents} aria-label="On this page">{doc.sections.map(([title], i) => <a href={`#section-${i}`} key={title}>{title}</a>)}</nav>
      {doc.sections.map(([title, body], i) => <section key={title} id={`section-${i}`}><h2>{title}</h2><p>{body}</p></section>)}
      <a className={s.button} href={`mailto:${legalEmail}?subject=${encodeURIComponent(key === 'delete-account' ? 'Delete my LilMoney account' : 'LilMoney support')}`}>{key === 'delete-account' ? 'Email a deletion request' : 'Contact us'}<ArrowUpRight size={18} /></a>
      <p className={s.small} style={{ marginTop:16 }}>Or email {legalEmail} directly.</p>
    </article> : <>
      <section className={s.hero}><div><p className={s.eyebrow}>A little less effort. A lot more clarity.</p><h1>Your money.<br />Made simple.</h1><p className={s.lead}>Money in. Money out. Something saved. Keep track of everyday life in one calm, easy-to-use app.</p><a href="#download" className={s.button}>Get LilMoney<ArrowDownToLine size={18} /></a><p className={s.small} style={{ marginTop:16 }}>Android release in preparation · iPhone coming soon</p></div>
      <div className={s.preview} aria-label="Illustrative LilMoney summary with example amounts"><div className={s.phone}><div className={s.previewHeader}><span>LilMoney</span><Plus size={20} color="#285ce7" /></div><div className={s.balance}><span className={s.small}>Income minus spending</span><strong>₹8,450</strong><div className={s.inout}><div><span className={s.small}>Money in</span><b>₹12,000</b></div><div><span className={s.small}>Money out</span><b>₹3,550</b></div></div></div><p style={{ marginTop:24, fontWeight:600 }}>Recent activity</p><div className={s.entry}><span>Freelance work</span><b>+₹2,000</b></div><div className={s.entry}><span>Groceries</span><b>−₹450</b></div><div className={s.entry}><span>Lunch</span><b>−₹180</b></div><p className={s.previewLabel}>Illustration · example amounts, not a bank balance</p></div></div></section>
      <section className={s.section} aria-labelledby="features"><h2 id="features">Everything you need. Nothing in the way.</h2><div className={s.grid}>{[{ icon:Plus, title:'Add it in seconds', body:'Track income or spending with an amount and category. Add a note when you need one.' },{ icon:ChartNoAxesCombined, title:'See where it goes', body:'Browse your activity and see spending by day, month and category. Clear numbers, useful patterns.' },{ icon:Target, title:'Make space for plans', body:'Set a spending limit and keep track of savings goals. A simple guide, without the pressure.' }].map(({ icon:Icon,title,body }) => <div className={s.card} key={title}><Icon size={24} /><h3>{title}</h3><p>{body}</p></div>)}</div></section>
      <section id="download" className={s.section}><h2>A little clarity, in your pocket.</h2><DownloadCards /></section>
      <section className={s.section}><ShieldCheck size={24} color="#285ce7" /><h2 style={{ marginTop:16 }}>Your records. Your choice.</h2><p className={s.lead}>No bank connection needed. No reading your messages. LilMoney records what you choose to add—it doesn’t move your money.</p><Link className={s.link} href="/littlemoney/privacy">How we handle your data<ArrowUpRight size={16} /></Link></section>
    </>}</main>
    <footer className={s.footer}><div><Link href="/littlemoney" className={s.brand}><Image src="/littlemoney-brand-512.png" width={32} height={32} alt="" />LilMoney</Link><p className={s.small}>Developed by Yashvanth S</p></div><nav className={s.footerLinks} aria-label="Legal and support">{(Object.keys(legalDocuments) as LegalPage[]).map(key => <Link key={key} href={`/littlemoney/${key}`}>{legalDocuments[key].title}</Link>)}</nav></footer>
  </div></div>;
}
