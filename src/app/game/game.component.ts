import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { interval } from 'rxjs';

import { Countries, Country, DataService } from '../services/data.service';
import { FlagService } from '../services/flag.service';
import { StatsService } from '../services/stats.service';
import { PlayScope, Settings } from '../settings';
import { Stats, Timing } from '../stats';

@Component({
  // tslint:disable-next-line:component-selector : necessary to embed the component in svg
  selector: '[geo-game]',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() settings: Settings;
  @Output() highlightCountryEvent = new EventEmitter<string>();
  @Output() zoomFlagEvent = new EventEmitter<string>();
  @Output() showFlagPickerEvent = new EventEmitter<boolean>();
  @Output() showPreviewEvent = new EventEmitter<string>();

  @ViewChild('inputNameElem', { static: false }) inputNameElement: ElementRef;
  @ViewChild('inputCapitalElem', { static: false }) inputCapitalElement: ElementRef;

  current: number;
  nextCountry = -1;
  country: Country;
  flagSvg: SafeHtml;

  isoCodes: string[] = [];
  countries: Countries = {};
  flagsReady = false;
  ready = false;

  playScope: PlayScope = 'All';
  isPlaying = false;
  showAll = true;
  scores: number[];
  sumScores: number;
  started: Date;
  countryStarted: Date;
  time: string;
  currentStats: Stats;
  nbErrors = 0;
  nbHelp = 0;

  inputName = '';
  nameFound = false;
  inputCapital = '';
  capitalFound = false;
  locationFound = false;
  flagFound = false;

  constructor(
    private _dataService: DataService,
    private _flagService: FlagService,
    private _statsService: StatsService,
    private _sanitizer: DomSanitizer,
    private _ngZone: NgZone) {}

  ngOnInit() {
    this._dataService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.isoCodes = Object.keys(countries);
      if (this.flagsReady)
        this.ready = true;
    });
    this._flagService.getAll().subscribe(_ => {
      this.flagsReady = true;
      if (this.isoCodes.length > 0)
        this.ready = true;
    });
    // usual dance so that protractor doesn't wait forever for this
    this._ngZone.runOutsideAngular(() =>
      interval(500).subscribe(_ => this._ngZone.run(() => this.setTime())));
  }

  setCountry(countryCode: string) {
    this.country = this.countries[countryCode];

    this._flagService.getSvg(countryCode, 290, 200).subscribe(svg => {
      this.flagSvg = this._sanitizer.bypassSecurityTrustHtml(svg);
    });

    if (!this.isPlaying) {
      this.highlightCountry(countryCode);
      return;
    }
    this.showAll = false;
    if (this.settings.showLocation)
      this.highlightCountry(countryCode);
    else
      this.highlightCountry('');
    if (this.settings.queryName) {
      if (this.inputNameElement)
        this.inputNameElement.nativeElement.focus();
    } else if (this.settings.queryCapital) {
      if (this.inputCapitalElement)
        this.inputCapitalElement.nativeElement.focus();
    }
  }

  highlightCountry(countryCode: string) {
    this.highlightCountryEvent.next(countryCode);
  }

  setRandomCountry() {
    if (this.sumScores === 0)
      return;
    let next = -1;
    if (this.nextCountry !== -1) {
      if (this.sumScores > 1) {
        // assume will be found
        this.sumScores--;
        this.scores[this.nextCountry]--;
        next = this.drawRandomCountry();
        this.scores[this.nextCountry]++;
        this.sumScores++;
      }
      this.current = this.nextCountry;
      this.nextCountry = next;
    } else {
      // most likely is start of game (else error on last one)
      this.nextCountry = this.drawRandomCountry();
      this.setRandomCountry();
    }
    this.inputName = '';
    this.nameFound = false;
    this.inputCapital = '';
    this.capitalFound = false;
    this.locationFound = false;
    this.flagFound = false;
    this.setCountry(this.isoCodes[this.current]);
    this.showPreviewEvent.next(this.nextCountry === -1 ? '' : this.isoCodes[this.nextCountry]);
    this.countryStarted = new Date();
  }

  drawRandomCountry(): number {
    const r = Math.floor(Math.random() * this.sumScores) + 1;
    let i = 0;
    let s = this.scores[i];
    while (s < r) {
      i++;
      s += this.scores[i];
    }
    return i;
  }

  countryClicked(countryCode: string) {
    if (!this.isPlaying) {
      this.setCountry(countryCode);
      this.highlightCountry(countryCode);
      return;
    }
    if (!this.settings.queryLocation || this.locationFound)
      return;

    if (countryCode === this.isoCodes[this.current]) {
      this.locationFound = true;
      this.highlightCountry(countryCode);
      this.checkNext();
    } else {
      this.scores[this.current]++;
      this.sumScores++;
      this.nbErrors++;
    }
  }

  showFlagPicker() {
    this.showFlagPickerEvent.next(true);
  }

  flagClicked(countryCode: string) {
    if (countryCode === this.isoCodes[this.current]) {
      this.flagFound = true;
      this.showFlagPickerEvent.next(false);
      this.checkNext();
    }
  }

  checkName() {
    if (this.inputName !== this.country.name)
      return;
    this.nameFound = true;
    if (this.settings.queryCapital && !this.capitalFound)
      this.inputCapitalElement.nativeElement.focus();
    this.checkNext();
  }

  checkCapital() {
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
    if (this.settings.queryFlag && !this.flagFound)
      return;
    this.scores[this.current]--;
    this.sumScores--;
    const elapsed = new Date().getTime() - this.countryStarted.getTime();
    this.currentStats.countryTimings[this.country.name] = new Timing(elapsed);
    if (this.sumScores === 0) {
      this.isPlaying = false;
      this.showAll = true;
      this.nextCountry = -1;
      const gameTime = Math.floor(new Date().getTime() - this.started.getTime());
      this.currentStats.gamesTiming = new Timing(gameTime);
      this._statsService.updateStats(this.currentStats);
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
    this.nextCountry = -1;
  }

  play() {
    this.playScope = this.settings.playScope;
    this.isPlaying = true;
    this.currentStats = new Stats(this.settings);
    this.started = new Date();
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

  get showFlag() {
    return this.settings.showFlag || this.showAll || (this.settings.queryFlag && this.flagFound);
  }
}
