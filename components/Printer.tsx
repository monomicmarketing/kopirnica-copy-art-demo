'use client';
import { useState } from 'react';
import { Replay } from './Icons';

export default function Printer() {
  const [run, setRun] = useState(0);
  return <div className="printer-module">
    <div className="printer-scene" key={run} role="img" aria-label="Ilustrirani printer ispisuje mini poster COPY Art, print, copy i uvez">
      <div className="printer-shadow"/>
      <div className="printer-body"><div className="printer-top"><span className="printer-top-line"/></div><div className="printer-face"><span className="printer-status"><i/> READY / 01</span><span className="printer-mark">C<span>·</span>A</span><div className="printer-slot"/><span className="printer-button"/></div></div>
      <div className="poster-mask"><div className="poster-output"><div className="poster-ink"><span className="poster-eyebrow">SKENDERIJA / SARAJEVO</span><strong>COPY<br/><em>ART.</em></strong><span className="poster-yellow"/><span className="poster-magenta"/><span className="poster-services">PRINT / COPY / UVEZ</span><span className="poster-edition">01 — NA PAPIRU</span></div></div></div>
      <div className="printer-lip"/>
    </div>
    <button className="replay-button" type="button" onClick={()=>setRun(n=>n+1)}><Replay size={17}/> Ponovi ispis</button>
  </div>;
}
