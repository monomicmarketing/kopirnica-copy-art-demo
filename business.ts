/** Public listing data, awaiting confirmation by COPY Art. Keep all mutable facts here. */
export const business = {
  name: 'Kopirnica COPY Art',
  phone: '+387 61 207 687',
  phoneHref: '+38761207687',
  place: 'Privredni grad Skenderija',
  address: 'Terezija bb, 71000 Sarajevo',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kopirnica%20COPY%20Art%2C%20Privredni%20grad%20Skenderija%2C%20Terezija%20bb%2C%20Sarajevo',
  services: ['Fotokopiranje', 'Printanje dokumenata', 'Uvezivanje'],
  demoNotice: 'Nezvanični demonstracijski koncept · nije službena stranica',
  verification: {
    contact: 'Javni poslovni imenici; vlasnik nije potvrdio.',
    services: 'Javno navedene djelatnosti; vlasnik nije potvrdio.',
    hours: 'Izvori nisu usaglašeni. Provjeriti telefonom.',
    prices: 'Službeni cjenovnik nije dostupan.',
    maps: 'Google Maps pretraga naziva i adrese; tačan pin lokala nije potvrđen.',
  },
  sources: [
    'https://bosnia-and-herzegovina.worldplaces.me/review/142674878-kopirnica-copy-art.html',
    'https://sl.cybo.com/BA/sarajevo/kopirnica',
  ],
} as const;
