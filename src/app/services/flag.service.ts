import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, of, forkJoin } from 'rxjs';
import { map, publish } from 'rxjs/operators';

import { DataService } from './data.service';

export interface FlagData {
  svg: string;
  group: number;
}
export interface SvgMap { [index: string]: FlagData; }

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private _svgs: SvgMap;
  private _getAll: ConnectableObservable<SvgMap>;

  constructor(private _http: HttpClient, private _dataService: DataService) { }

  getSvg(countryCode: string, width?: number, height?: number): Observable<string> {
    let replace = 'viewBox';
    if (height) {
      replace = `height="${height}px" ` + replace;
    }
    if (width) {
      replace = `width="${width}px" ` + replace;
    }
    if (this._svgs)
      return of(this.uniqueClipPath(this._svgs[countryCode].svg.replace('viewBox', replace)));
    return this.getAll().pipe(map(res => this.uniqueClipPath(res[countryCode].svg.replace('viewBox', replace))));
  }

  getAll(): Observable<SvgMap> {
    if (this._svgs)
      return of(this._svgs);
    if (this._getAll)
      return this._getAll;
    this._getAll = forkJoin([this._http.get('assets/allFlags', { responseType: 'text' }), this._dataService.getCountries()])
    .pipe(
      map(result => {
        const data = result[0];
        const countries = result[1];
        const svgs: SvgMap = {};
        let curSvg = '';
        let curCountry = '';
        for (const line of data.split(/\r*\n/)) {
          const match = /flag_of:(\w+)/.exec(line);
          if (match) {
            if (curCountry)
              svgs[curCountry] = { svg: curSvg, group: countries[curCountry].flagGroup };
            curCountry = match[1];
            curSvg = '';
            continue;
          }
          curSvg += line + '\n';
        }
        svgs[curCountry] = { svg: curSvg, group: countries[curCountry].flagGroup };
        this._svgs = svgs;
        this._getAll = null;
        return svgs;
      }),
      publish()) as ConnectableObservable<SvgMap>;  // need cast until https://github.com/ReactiveX/rxjs/issues/2972 is resolved
    this._getAll.connect();
    return this._getAll;
  }

  // allow flags from getAll() and getSvg() to be displayed simultaneously : the ids must be unique
  private uniqueClipPath(svg: string): string {
    return svg.replace(/id="([^"]+)"/g, 'id="_$1"')
      .replace(/url\(#([^\)]+)\)/g, 'url(#_$1)')
      .replace(/href="#([^\"]+)"/g, 'href="#_$1"');
  }
}
