import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { QuerySettings, Stats } from '../stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private _currentQuerySettings: QuerySettings = new QuerySettings();
  private _allStats = new Map<string, Stats>();

  getCurrentSettings(): QuerySettings {
    return this._currentQuerySettings;
  }

  setCurrentSettings(settings: QuerySettings) {
    this._currentQuerySettings = settings;
  }

  getStats(settings: QuerySettings): Observable<Stats> {
    return of(this._allStats.get(JSON.stringify(settings)));
  }

  updateStats(stats: Stats): void {
    const key = JSON.stringify(stats.settings);
    if (this._allStats.has(key))
      this._allStats.get(key).merge(stats);
    else
      this._allStats.set(key, stats);
  }
}
