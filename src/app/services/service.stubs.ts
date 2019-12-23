import { of } from 'rxjs';

import { DataService } from './data.service';
import { FlagService } from './flag.service';

export const dataServiceStub: Partial<DataService> = {
  getCountries: () => of({
      au: { isoCode: 'au', name: 'Australie', capitals: ['Canberra'], flag: 'Australia.svg', continent: 'Oceania', rank: 1, flagGroup: 1 },
      fr: { isoCode: 'fr', name: 'France', capitals: ['Paris'], flag: 'France.svg', continent: 'Europe', rank: 2, flagGroup: 1 }
    })
};

const allFlags = {
  au: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5">
      <text>Flag of Australia</text></svg>`,
    group: 1
  },
  fr: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <text>Flag of France</text></svg>`,
    group: 0
  }
};

export const flagServiceStub: Partial<FlagService> = {
  getAll: () => of(allFlags),
  getSvg: code => of(code === 'au' ? allFlags.au.svg : code === 'fr' ? allFlags.fr.svg : undefined)
};
