import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { QuerySettings, Stats } from '../stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private _currentQuerySettings: QuerySettings = new QuerySettings();
  private _allStats: Map<string, Stats>;

  getCurrentSettings(): QuerySettings {
    return this._currentQuerySettings;
  }

  setCurrentSettings(settings: QuerySettings) {
    this._currentQuerySettings = settings;
  }

  getStats(settings: QuerySettings): Observable<Stats> {
    this.checkLoaded();
    return of(this._allStats.get(JSON.stringify(settings)));
  }

  updateStats(stats: Stats): void {
    this.checkLoaded();
    const key = JSON.stringify(stats.settings);
    if (this._allStats.has(key))
      this._allStats.get(key).merge(stats);
    else
      this._allStats.set(key, stats);
    localStorage.setItem('stats', JSON.stringify(Array.from(this._allStats.entries())));
  }

  checkLoaded() {
    if (this._allStats)
      return;
    const fromStorage = localStorage.getItem('stats');
    this._allStats = fromStorage ?
      new Map<string, Stats>(JSON.parse(fromStorage).map(([k, v]) => [k, Object.assign(new Stats(), v)]))
      : new Map<string, Stats>();
    // now keeping sum of times instead of average (better handling of rounding)
    this._allStats.forEach((stats: Stats, _: string) => {
      if (stats.gamesTiming.sum > 0)
        return;
      stats.gamesTiming.sum = stats.gamesTiming.average * stats.nbGames;
      Object.keys(stats.countryTimings).forEach(c =>
        stats.countryTimings[c].sum = stats.countryTimings[c].average * stats.nbGames);
    });
  }
}
