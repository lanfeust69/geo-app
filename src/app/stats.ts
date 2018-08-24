import { PlayScope, Settings } from './settings';

export class QuerySettings {
  scope: PlayScope = 'All';
  name = false;
  capital = false;
  location = true;
  flag = false;

  constructor(settings?: Settings) {
    if (!settings)
      return;
    this.scope = settings.playScope;
    this.name = settings.queryName;
    this.capital = settings.queryCapital;
    this.location = settings.queryLocation;
    this.flag = settings.queryFlag;
  }
}

export class Timing {
  min: number;
  max: number;
  average: number;

  constructor(t: number) { this.min = this.max = this.average = t; }
}

export class Stats {
  readonly settings: QuerySettings;
  nbGames = 1;
  gamesTiming: Timing;
  countryTimings: { [index: string]: Timing } = {};

  constructor(settings: Settings) {
    this.settings = new QuerySettings(settings);
  }

  merge(other: Stats) {
    if (Object.keys(this.settings).some(k => this.settings[k] !== other.settings[k]))
      throw new Error('Cannot merge stats with different query settings');
    const countries = Object.keys(this.countryTimings);
    if (Object.keys(other.countryTimings).length !== countries.length || countries.some(c => !(c in other.countryTimings)))
      throw new Error('Cannot merge stats with different timings');
    const nbGames = this.nbGames + other.nbGames;
    this.gamesTiming.min = Math.min(this.gamesTiming.min, other.gamesTiming.min);
    this.gamesTiming.max = Math.max(this.gamesTiming.max, other.gamesTiming.max);
    const totalGamesTime = this.gamesTiming.average * this.nbGames + other.gamesTiming.average * other.nbGames;
    this.gamesTiming.average = Math.floor(totalGamesTime / nbGames);
    countries.forEach(c => {
      this.countryTimings[c].min = Math.min(this.countryTimings[c].min, other.countryTimings[c].min);
      this.countryTimings[c].max = Math.max(this.countryTimings[c].max, other.countryTimings[c].max);
      const totalTime = this.countryTimings[c].average * this.nbGames + other.countryTimings[c].average * other.nbGames;
      this.countryTimings[c].average = Math.floor(totalTime / nbGames);
    });
    this.nbGames = nbGames;
  }
}
