# COPY Art — nezvanični demonstracijski koncept

Samostalni Next.js demo za Kopirnicu COPY Art u Sarajevu. Ovo nije službena stranica. Tipografski znak, ilustracije, paleta i printer su isključivo prijedlog za prezentaciju vlasniku.

## Lokalno pokretanje

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Podaci za potvrdu

`business.ts` sadrži sve promjenjive javne podatke, izvore i status potvrde. Prije službenog korištenja s vlasnikom treba potvrditi kontakt, adresu i ulaz u radnju, usluge, način predaje datoteka, radno vrijeme, cijene i vizuelni identitet. Sati, cijene, e-mail, fotografije i recenzije nisu prikazani kao činjenice.

Google Maps dugme otvara pretragu po punom nazivu i adresi. Tačan Google Maps place ID/pin radnje nije pouzdano potvrđen; korisnik zato dobija napomenu da provjeri ulaz. Ne zamijeniti pretragom samo ulice.

`app/layout.tsx` postavlja `noindex, nofollow`, a `app/robots.ts` zabranjuje indeksiranje. Oznaku nezvaničnog koncepta ukloniti tek uz odobrenje vlasnika.

## Izvori

- [WorldPlaces — Kopirnica COPY Art](https://bosnia-and-herzegovina.worldplaces.me/review/142674878-kopirnica-copy-art.html)
- [Cybo — kopirnice u Sarajevu](https://sl.cybo.com/BA/sarajevo/kopirnica)
- [Centar Skenderija — Privredni grad](https://skenderija.ba/privredni-grad/)

## Objavljivanje

GitHub repozitorij: `monomicmarketing/kopirnica-copy-art-demo`. Vercel projekat: `kopirnica-copy-art-demo` u istom Vercel timu kao Bezistan i RASS.

Pokušaj automatskog povezivanja GitHub repozitorija preko Vercel API-ja vraća `repo_no_access`: Vercel GitHub integracija nema pristup novom repozitoriju. Produkcijski demo je zato direktno objavljen kroz Vercel API slanjem izvornih datoteka iz ovog repozitorija. GitHub push sam po sebi trenutno **ne pokreće** novo objavljivanje. Za kasnije automatsko objavljivanje treba omogućiti Vercel GitHub aplikaciji pristup ovom repozitoriju i povezati ga u postavkama projekta.

Javni URL: https://kopirnica-copy-art-demo.vercel.app/

QA skripte `qa-final.cjs` i `qa-interactions.cjs` koriste instalirani Google Chrome. U PowerShellu: `$env:BASE_URL='https://kopirnica-copy-art-demo.vercel.app/'; $env:QA_LABEL='production-layout'; node qa-final.cjs; $env:QA_LABEL='production-interactions'; node qa-interactions.cjs`. Prva snima i mjeri širine 320–1920 px, druga provjerava animaciju, meni, kontakt, reduced-motion i vrlo uski prikaz. Snimci i izvještaji čuvaju se u ignorisanom direktoriju `qa-shots/`.

Archivo Black i Outfit se poslužuju lokalno iz `public/fonts/`; licence su u istom direktoriju.
