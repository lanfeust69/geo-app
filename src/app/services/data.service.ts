import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Country {
  isoCode: string;
  name: string;
  capitals: string[];
  flag: string;
  continent: string;
  rank: number;
}

export interface Countries { [index: string]: Country; }

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _countries: Countries;
  constructor(private _http: HttpClient) { }

  getCountries(): Observable<Countries> {
    if (this._countries)
      return of(this._countries);
    return this._http.get('assets/data.csv', { responseType: 'text' }).pipe(map(data => {
      const countries: Countries = {};
      for (const line of data.split(/\r?\n/)) {
        const [name, capital, flag, isoCode, continent, rank] = line.split(/;/);
        if (!isoCode)
          continue;
        if (isoCode in countries) {
          countries[isoCode].capitals.push(capital);
        } else {
          countries[isoCode] = { isoCode, name, capitals: [capital], flag: `assets/flags/${flag}.svg`, continent, rank: +rank };
        }
      }
      this._countries = countries;
      return countries;
    }));
  }
}
