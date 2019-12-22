import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Settings } from '../settings';
import { Stats } from '../stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private _currentSettings: Settings = new Settings();
  private _allStats: Map<string, Stats>;

  getCurrentSettings(): Settings {
    return this._currentSettings;
  }

  setCurrentSettings(settings: Settings) {
    this._currentSettings = { ...settings };
  }

  getStats(settings: Settings): Observable<Stats> {
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
    // and use complete settings for key
    const toRename: [string, string][] = [];
    this._allStats.forEach((stats: Stats, key: string) => {
      const settings = JSON.parse(key);
      if (!('showName' in settings)) {
        // old QuerySettings object, replaced with same Settings as for play
        // no way to have a real info for showXxx : just pretend everything is false,
        // so that we can query old stats, but will never be updated
        const newSettings: Settings = {
          playScope: settings.scope,
          showName: false,
          queryName: settings.name,
          showCapital: false,
          queryCapital: settings.capital,
          showLocation: false,
          queryLocation: settings.location,
          showFlag: false,
          queryFlag: settings.flag,
          showNext: 'next' in settings ? settings.next : false
        };
        toRename.push([key, JSON.stringify(newSettings)]);
      }
      if (stats.gamesTiming.sum > 0)
        return;
      stats.gamesTiming.sum = stats.gamesTiming.average * stats.nbGames;
      Object.keys(stats.countryTimings).forEach(c =>
        stats.countryTimings[c].sum = stats.countryTimings[c].average * stats.nbGames);
    });
    toRename.forEach(([oldKey, newKey]) => {
      this._allStats.set(newKey, this._allStats.get(oldKey));
      this._allStats.delete(oldKey);
    });
  }
}
