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

Repozitorij i Vercel projekat su namjenski za ovaj demo. Ako GitHub integracija ne poveže projekat, direktni Vercel deployment treba dokumentovati zasebno uz konkretan URL i commit.
