'use client';
import { useState } from 'react';
import { business } from '../business';
import { ArrowUp } from './Icons';

const links = [['#usluge','Usluge'], ['#kako-do-ispisa','Kako do ispisa'], ['#upiti','Cijene i upiti'], ['#lokacija','Lokacija']];
export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header" id="vrh"><div className="header-inner shell">
    <a className="brand" href="#vrh" aria-label="COPY Art, na početak"><span className="brand-copy">COPY</span><span className="brand-art">Art<span className="brand-dot">.</span></span></a>
    <nav id="mobile-nav" className={open ? 'nav is-open' : 'nav'} aria-label="Glavna navigacija">{links.map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}<a className="nav-call" href={`tel:${business.phoneHref}`}>Pozovi <ArrowUp size={16}/></a></nav>
    <button className="menu-toggle" type="button" aria-label={open?'Zatvori meni':'Otvori meni'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(v=>!v)}><span/><span/></button>
  </div></header>;
}
