import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs/observable/interval';

interface Country {
  isoCode: string;
  name: string;
  capitals: string[];
  flag: string;
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
        const [name, capital, flag, isoCode] = line.split(/;/);
        if (!isoCode)
          continue;
        if (isoCode in this.countries) {
          this.countries[isoCode].capitals.push(capital);
        } else {
          this.isoCodes.push(isoCode);
          this.countries[isoCode] = { isoCode, name, capitals: [capital], flag: `assets/flags/${flag}.svg` };
        }
      }
      this.scores = this.isoCodes.map(_ => 1);
      this.sumScores = this.scores.length;
      this.setRandomCountry();
    });
    interval(500).subscribe(_ => this.setTime());
  }

  setCountry(countryCode: string) {
    const country = this.countries[countryCode];
    this.country = country.name;
    this.capital = country.capitals.join(' ou ');
    this.flag = country.flag;
    this.highlightCountry("");
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

  onHelp(event: MouseEvent) {
    this.highlightCountry(this.isoCodes[this.current]);
    this.scores[this.current] += 3;
    this.sumScores += 3;
    this.nbHelp++;
  }

  setTime() {
    if (!this.started || this.sumScores === 0)
      return;
    const elapsed = Math.floor(new Date().getTime() - this.started.getTime()) / 1000;
    this.time = `${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toLocaleString(undefined, {minimumIntegerDigits: 2})}`;
  }
}
