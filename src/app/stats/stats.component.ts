import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { StatsService } from '../services/stats.service';
import { QuerySettings, Stats } from '../stats';
import { allPlayScopes, PlayScope } from '../settings';

class CountryTiming {
  country: string;
  last: number;
  average: number;
  min: number;
  max: number;
}

@Component({
  selector: 'geo-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements AfterViewInit, OnInit {
  playScopes: PlayScope[] = allPlayScopes;

  querySettings: QuerySettings = new QuerySettings();
  stats: Stats;
  dataSource: MatTableDataSource<CountryTiming>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private _statsService: StatsService) { }

  ngOnInit() {
    this.querySettings = this._statsService.getCurrentSettings();
    this.loadStats();
  }

  ngAfterViewInit() {
    // dataSource may already have been created (because stats fetched quickly),
    // but the MatSort child was not available then
    if (this.dataSource && !this.dataSource.sort && this.sort)
      this.dataSource.sort = this.sort;
  }

  loadStats() {
    this._statsService.getStats(this.querySettings).subscribe(stats => {
      this.stats = stats;
      if (!stats)
        return;
      const countryTimings = Object.keys(stats.countryTimings).sort().map(c => ({
        country: c,
        last: stats.countryTimings[c].last,
        average: stats.countryTimings[c].average,
        min: stats.countryTimings[c].min,
        max: stats.countryTimings[c].max
      }));
      this.dataSource = new MatTableDataSource(countryTimings);
      if (this.sort)
        this.dataSource.sort = this.sort;
    });
  }

  onChanged() {
    this.loadStats();
  }

  getShortTime(timeMs: number): string {
    return (timeMs / 1000).toFixed(3);
  }

  getLongTime(timeMs: number): string {
    let res = '';
    if (timeMs >= 3600000) {
      res += Math.floor(timeMs / 3600000) + 'h ';
      timeMs = timeMs % 3600000;
    }
    if (res || timeMs >= 60000) {
      res += Math.floor(timeMs / 60000) + 'm ';
      timeMs = timeMs % 60000;
    }
    res += (Math.floor(timeMs / 100) / 10) + 's';
    return res;
  }

  getLastGameColor(timing: CountryTiming) {
    if (timing.last < timing.average)
      return 'green';
    if (timing.last > timing.average)
      return 'red';
    return 'black';
  }

  getLastGameTrend(timing: CountryTiming) {
    if (timing.last === timing.min)
      return '\u272A';
    if (timing.last === timing.max)
      return '\u26D2';
    if (timing.last < timing.average - 250)
      return '\u21A1';
    if (timing.last < timing.average - 50)
      return '\u2198';
    if (timing.last > timing.average + 250)
      return '\u219F';
    if (timing.last > timing.average + 50)
      return '\u2197';
    return '\u2192';
  }
}
