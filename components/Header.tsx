'use client';
import { useEffect, useRef, useState } from 'react';
import { business } from '../business';
import { ArrowUp } from './Icons';

const links = [['#usluge','Usluge'], ['#kako-do-ispisa','Kako do ispisa'], ['#upiti','Cijene i upiti'], ['#lokacija','Lokacija']];
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return <header className="site-header" id="vrh"><div className="header-inner shell">
    <a className="brand" href="#vrh" aria-label="COPY Art, na početak" onClick={()=>setOpen(false)}><span className="brand-copy">COPY</span><span className="brand-art">Art<span className="brand-dot">.</span></span></a>
    <nav id="mobile-nav" className={open ? 'nav is-open' : 'nav'} aria-label="Glavna navigacija">{links.map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}<a className="nav-call" href={`tel:${business.phoneHref}`} onClick={()=>setOpen(false)}>Pozovi <ArrowUp size={16}/></a></nav>
    <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open?'Zatvori meni':'Otvori meni'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(v=>!v)}><span/><span/></button>
  </div></header>;
}
