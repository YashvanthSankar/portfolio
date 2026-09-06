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
  const description = doc?.summary ?? 'Know where your money goes. Track spending, add income and save for the things that matter. Get LilMoney for Android. iPhone coming soon.';
  const url = `${legalBase}${key ? `/${key}` : ''}`;
  const images = [{ url: 'https://yashvanth.com/lilmoney-icon-v2.png', width: 1254, height: 1254, alt: 'LilMoney — blue ribbon L logo' }];
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'LilMoney', images }, twitter: { card: 'summary', title, description, images } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const key = slug?.[0] as LegalPage | undefined;
  if (slug && (slug.length > 1 || (key && !Object.hasOwn(legalDocuments, key)))) notFound();
  const doc = key ? legalDocuments[key] : null;
  return <div className={s.site} data-littlemoney><div className={s.container}>
    <header className={s.header}><Link href="/lilmoney" className={s.brand}><Image src="/lilmoney-mark-v2.png" width={44} height={44} alt="" priority />LilMoney</Link><nav className={s.nav} aria-label="LilMoney"><Link href="/lilmoney#download">Get the app</Link><Link href="/lilmoney/support">Help</Link></nav></header>
    <main id="main-content">{doc && key ? <article className={s.legal}>
      <Link href="/lilmoney" className={s.link}><ArrowLeft size={16} />Back to LilMoney</Link><h1>{doc.title}</h1><p>{doc.summary}</p><p className={s.small}>Updated {legalUpdated} · Yashvanth S</p>
      <nav className={s.contents} aria-label="On this page">{doc.sections.map(([title], i) => <a href={`#section-${i}`} key={title}>{title}</a>)}</nav>
      {doc.sections.map(([title, body], i) => <section key={title} id={`section-${i}`}><h2>{title}</h2><p>{body}</p></section>)}
      <a className={s.button} href={`mailto:${legalEmail}?subject=${encodeURIComponent(key === 'delete-account' ? 'Delete my LilMoney account' : 'LilMoney support')}`}>{key === 'delete-account' ? 'Email a deletion request' : 'Contact us'}<ArrowUpRight size={18} /></a>
      <p className={s.small} style={{ marginTop:16 }}>Or email {legalEmail} directly.</p>
    </article> : <>
      <section className={s.hero}><div><h1>Know where<br />your money <span className={s.accent}>goes.</span></h1><p className={s.lead}>A simple app to track your spending, income and savings.</p><a href="#download" className={s.button}>Get LilMoney for Android<ArrowDownToLine size={18} /></a><p className={s.small} style={{ marginTop:16 }}>iPhone coming soon</p><div className={s.reassurance}><ShieldCheck size={18} /><span>No bank connection needed.</span></div></div>
      <div className={s.preview} aria-label="Example of a LilMoney money summary"><div className={s.phone}><div className={s.previewHeader}><span className={s.previewBrand}><Image src="/lilmoney-mark-v2.png" width={28} height={28} alt="" />LilMoney</span><span className={s.exampleBadge}>Your month</span></div><div className={s.balance}><span className={s.small}>Income minus spending</span><strong>₹8,450</strong><div className={s.inout}><div><span className={s.small}>Money in</span><b>₹12,000</b></div><div><span className={s.small}>Money out</span><b>₹3,550</b></div></div></div><p className={s.activityLabel}>Recent entries</p><div className={s.entry}><span>Freelance work</span><b className={s.accent}>+₹2,000</b></div><div className={s.entry}><span>Groceries</span><b>−₹450</b></div><div className={s.entry}><span>Lunch with friends</span><b>−₹180</b></div><div className={s.savingPreview}><Target size={19} /><span>Trip savings</span></div></div><p className={s.previewLabel}>Example amounts · not a bank balance</p></div></section>
      <section className={s.section} aria-labelledby="features"><div className={s.sectionHeading}><h2 id="features">Your money, in one place.</h2></div><div className={s.grid}>{[{ icon:Plus, title:'Add income and spending', body:'Enter an amount and choose a category.' },{ icon:ChartNoAxesCombined, title:'See your spending', body:'See where your money goes with simple charts and a list of your entries.' },{ icon:Target, title:'Keep track of savings', body:'Set a savings goal or a spending limit. Change it anytime.' }].map(({ icon:Icon,title,body }) => <div className={s.feature} key={title}><span className={s.featureIcon}><Icon size={23} /></span><h3>{title}</h3><p>{body}</p></div>)}</div></section>
      <section id="download" className={`${s.section} ${s.downloadSection}`}><div className={s.sectionHeading}><h2>Get LilMoney</h2></div><DownloadCards /></section>
      <section className={s.privacyStrip}><span className={s.featureIcon}><ShieldCheck size={24} /></span><div><h2>You decide what to share.</h2><p>No reading your messages. No moving your money.<br />Just the income and spending you choose to add.</p></div><Link className={s.link} href="/lilmoney/privacy">Your privacy<ArrowUpRight size={16} /></Link></section>
    </>}</main>
    <footer className={s.footer}><div><Link href="/lilmoney" className={s.brand}><Image src="/lilmoney-mark-v2.png" width={32} height={32} alt="" />LilMoney</Link><p className={s.small}>Developed by Yashvanth S</p></div><nav className={s.footerLinks} aria-label="Legal and support">{(Object.keys(legalDocuments) as LegalPage[]).map(key => <Link key={key} href={`/lilmoney/${key}`}>{legalDocuments[key].title}</Link>)}</nav></footer>
  </div></div>;
}
