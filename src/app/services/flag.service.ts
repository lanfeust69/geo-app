import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, of } from 'rxjs';
import { map, publish } from 'rxjs/operators';

export interface SvgMap { [index: string]: string; }

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private _svgs: SvgMap;
  private _getAll: ConnectableObservable<SvgMap>;

  constructor(private _http: HttpClient) { }

  getSvg(countryCode: string, width?: number, height?: number): Observable<string> {
    let replace = 'viewBox';
    if (height) {
      replace = `height="${height}px" ` + replace;
    }
    if (width) {
      replace = `width="${width}px" ` + replace;
    }
    if (this._svgs)
      return of(this._svgs[countryCode].replace('viewBox', replace));
    return this.getAll().pipe(map(res => res[countryCode]));
  }

  getAll(): Observable<SvgMap> {
    if (this._svgs)
      return of(this._svgs);
    if (this._getAll)
      return this._getAll;
    this._getAll = this._http.get('assets/allFlags', { responseType: 'text' }).pipe(
      map(data => {
        const svgs: SvgMap = {};
        let curSvg = '';
        let curCountry = '';
        for (const line of data.split(/\r*\n/)) {
          const match = /flag_of:(\w+)/.exec(line);
          if (match) {
            if (curCountry)
              svgs[curCountry] = curSvg;
            curCountry = match[1];
            curSvg = '';
            continue;
          }
          curSvg += line + '\n';
        }
        svgs[curCountry] = curSvg;
        this._svgs = svgs;
        this._getAll = null;
        return svgs;
      }),
      publish()) as ConnectableObservable<SvgMap>;  // need cast until https://github.com/ReactiveX/rxjs/issues/2972 is resolved
    this._getAll.connect();
    return this._getAll;
  }
}
