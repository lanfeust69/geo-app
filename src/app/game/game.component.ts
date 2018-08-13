import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';

import { PlayScope, Settings } from '../settings';

interface Country {
  isoCode: string;
  name: string;
  capitals: string[];
  flag: string;
  continent: string;
  rank: number;
}

@Component({
  // tslint:disable-next-line:component-selector : necessary to embed the component in svg
  selector: '[app-game]',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() settings: Settings;
  @Output() highlightCountryEvent = new EventEmitter<string>();
  @Output() zoomFlagEvent = new EventEmitter<string>();

  @ViewChild('inputNameElem') inputNameElement: ElementRef;
  @ViewChild('inputCapitalElem') inputCapitalElement: ElementRef;

  current: number;
  country: Country;

  isoCodes: string[] = [];
  countries: { [index: string]: Country } = {};

  playScope: PlayScope = 'All';
  isPlaying = false;
  showAll = false;
  scores: number[];
  sumScores: number;
  started: Date;
  time: string;
  nbErrors = 0;
  nbHelp = 0;

  inputName = '';
  nameFound = false;
  inputCapital = '';
  capitalFound = false;
  locationFound = false;

  constructor(private _http: HttpClient, private _ngZone: NgZone) {}

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
    // usual dance so that protractor doesn't wait forever for this
    this._ngZone.runOutsideAngular(() =>
      interval(500).subscribe(_ => this._ngZone.run(() => this.setTime())));
  }

  setCountry(countryCode: string) {
    this.country = this.countries[countryCode];
    if (!this.isPlaying) {
      this.highlightCountry(countryCode);
      return;
    }
    this.showAll = false;
    if (this.settings.showLocation)
      this.highlightCountry(countryCode);
    else
      this.highlightCountry('');
    if (this.settings.queryName)
      this.inputNameElement.nativeElement.focus();
    else if (this.settings.queryCapital)
      this.inputCapitalElement.nativeElement.focus();
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
    this.inputName = '';
    this.nameFound = false;
    this.inputCapital = '';
    this.capitalFound = false;
    this.locationFound = false;
    this.setCountry(this.isoCodes[this.current]);
  }

  countryClicked(contryCode: string) {
    if (!this.isPlaying) {
      this.setCountry(contryCode);
      this.highlightCountry(contryCode);
      return;
    }
    if (!this.started)
      this.started = new Date();
    if (!this.settings.queryLocation || this.locationFound)
      return;

    if (contryCode === this.isoCodes[this.current]) {
      this.locationFound = true;
      this.highlightCountry(contryCode);
      this.checkNext();
    } else {
      this.scores[this.current]++;
      this.sumScores++;
      this.nbErrors++;
    }
  }

  checkName() {
    if (!this.started)
      this.started = new Date();
    if (this.inputName !== this.country.name)
      return;
    this.nameFound = true;
    if (this.settings.queryCapital && !this.capitalFound)
      this.inputCapitalElement.nativeElement.focus();
    this.checkNext();
  }

  checkCapital() {
    if (!this.started)
      this.started = new Date();
    if (this.country.capitals.indexOf(this.inputCapital) === -1)
      return;
    this.capitalFound = true;
    if (this.settings.queryName && !this.nameFound)
      this.inputNameElement.nativeElement.focus();
    this.checkNext();
  }

  checkNext() {
    if (this.settings.queryName && !this.nameFound)
      return;
    if (this.settings.queryCapital && !this.capitalFound)
      return;
    if (this.settings.queryLocation && !this.locationFound)
      return;
    this.scores[this.current]--;
    this.sumScores--;
    if (this.sumScores === 0) {
      this.isPlaying = false;
      this.showAll = true;
    } else {
      this.setRandomCountry();
    }
  }

  help() {
    this.showAll = true;
    this.highlightCountry(this.isoCodes[this.current]);
    this.scores[this.current] += 3;
    this.sumScores += 3;
    this.nbHelp++;
  }

  explore() {
    this.isPlaying = false;
    this.showAll = true;
    this.highlightCountry(this.isoCodes[this.current]);
    this.started = undefined;
    this.sumScores = 0;
  }

  play() {
    this.playScope = this.settings.playScope;
    this.isPlaying = true;
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
    if (!this.started || !this.isPlaying)
      return;
    const elapsed = Math.floor(new Date().getTime() - this.started.getTime()) / 1000;
    this.time = `${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toLocaleString(undefined, {minimumIntegerDigits: 2})}`;
  }
}
