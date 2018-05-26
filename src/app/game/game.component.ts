import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';

interface Country {
  isoCode: string;
  name: string;
  capitals: string[];
  flag: string;
  continent: string;
  rank: number;
}

@Component({
  selector: '[app-game]',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Output() highlightCountryEvent = new EventEmitter<string>();
  @Output() zoomFlagEvent = new EventEmitter<string>();

  withCountry = false;
  withCapital = false;
  current: number;
  country: string;
  capital: string;
  flag: string;

  isoCodes: string[] = [];
  countries: { [index: string]: Country } = {};

  playScopes = ['All', 'Top 100', 'Top 50', 'Africa', 'America', 'Asia', 'Europe', 'Oceania'];
  playScope = 'All';
  scores: number[];
  sumScores: number;
  started: Date;
  time: string;
  nbErrors = 0;
  nbHelp = 0;

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this._http.get('assets/data.csv', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/\r?\n/)) {
        const [name, capital, flag, isoCode, continent, rank] = line.split(/;/);
        if (!isoCode)
          continue;
        if (isoCode in this.countries) {
          this.countries[isoCode].capitals.push(capital);
        } else {
          this.isoCodes.push(isoCode);
          this.countries[isoCode] = { isoCode, name, capitals: [capital], flag: `assets/flags/${flag}.svg`, continent, rank: +rank };
        }
      }
      this.play();
    });
    interval(500).subscribe(_ => this.setTime());
  }

  setCountry(countryCode: string) {
    const country = this.countries[countryCode];
    this.country = country.name;
    this.capital = country.capitals.join(' ou ');
    this.flag = country.flag;
    this.highlightCountry('');
  }

  highlightCountry(countryCode: string) {
    this.highlightCountryEvent.next(countryCode);
  }

  setRandomCountry() {
    if (this.sumScores === 0)
      return;
    const r = Math.floor(Math.random() * this.sumScores) + 1;
    let i = 0;
    let s = this.scores[i];
    while (s < r) {
      i++;
      s += this.scores[i];
    }
    this.current = i;
    this.setCountry(this.isoCodes[this.current]);
  }

  countryClicked(contryCode: string) {
    if (!this.started) {
      this.started = new Date();
    }
    if (this.sumScores === 0) {
      this.setCountry(contryCode);
      this.highlightCountry(contryCode);
    } else {
      if (contryCode === this.isoCodes[this.current]) {
        this.scores[this.current]--;
        this.sumScores--;
        this.setRandomCountry();
      } else {
        this.scores[this.current]++;
        this.sumScores++;
        this.nbErrors++;
      }
    }
  }

  help() {
    this.highlightCountry(this.isoCodes[this.current]);
    this.scores[this.current] += 3;
    this.sumScores += 3;
    this.nbHelp++;
  }

  explore() {
    this.highlightCountry(this.isoCodes[this.current]);
    this.started = undefined;
    this.sumScores = 0;
  }

  play() {
    this.started = undefined;
    this.time = undefined;
    const filter = this.getFilter();
    this.scores = this.isoCodes.map(c => filter(this.countries[c]) ? 1 : 0);
    this.sumScores = this.scores.reduce((acc, s) => acc + s);
    this.nbHelp = 0;
    this.nbErrors = 0;
    this.setRandomCountry();
  }

  getFilter(): (Country) => boolean {
    switch (this.playScope) {
      case 'All':
        return (c: Country) => true;
      case 'Top 100':
        return (c: Country) => c.rank <= 100;
      case 'Top 50':
        return (c: Country) => c.rank <= 50;
      case 'Africa':
      case 'America':
      case 'Asia':
      case 'Europe':
      case 'Oceania':
        return (c: Country) => c.continent === this.playScope;
    }
  }

  setTime() {
    if (!this.started || this.sumScores === 0)
      return;
    const elapsed = Math.floor(new Date().getTime() - this.started.getTime()) / 1000;
    this.time = `${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toLocaleString(undefined, {minimumIntegerDigits: 2})}`;
  }
}