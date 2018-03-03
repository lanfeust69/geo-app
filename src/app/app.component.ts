import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs/observable/interval';

interface Country {
  isoCode: string;
  name: string;
  capitals: string[];
  flag: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  current: number;
  country: string;
  capital: string;
  flag: string;
  highlighted: NodeListOf<Element>;

  isoCodes: string[] = [];
  countries: { [index: string]: Country } = {};

  scores: number[];
  sumScores: number;
  started: Date;
  time: string;

  @ViewChild('world') worldElem: ElementRef;
  worldSvg: SVGElement;
  worldSvgText: string;

  constructor(private _http: HttpClient, private _renderer: Renderer2) {}

  ngOnInit() {
    this._http.get('assets/world.svg', { responseType: 'text' }).subscribe(svgText => {
      this.worldSvgText = svgText.replace(/<title>[^<]*<\/title>/g, '');
      this.setupWorld();
    });

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

  ngAfterViewInit() {
    this.setupWorld();
  }

  setupWorld() {
    if (!this.worldSvgText || !this.worldElem)
      return;
    const div: HTMLElement = this.worldElem.nativeElement;
    div.innerHTML = this.worldSvgText;
    this.worldSvg = div.querySelector('svg') as SVGElement;
  }

  setCountry(code: string) {
    const country = this.countries[code];
    this.country = country.name;
    this.capital = country.capitals.join(' ou ');
    this.flag = country.flag;
    if (this.highlighted) {
      for (let i = 0; i < this.highlighted.length; i++)
        this._renderer.removeClass(this.highlighted[i], 'highlighted');
      this.highlighted = null;
    }
  }

  highlighCountry(code: string) {
    const world = this.worldElem.nativeElement as Element;
    this.highlighted = world.querySelectorAll(`.${code}`);
    for (let i = 0; i < this.highlighted.length; i++) {
      console.log('highlighting, ', this.highlighted[i]);
      this._renderer.addClass(this.highlighted[i], 'highlighted');
    }
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

  onClick(event: MouseEvent) {
    if (!this.started) {
      this.started = new Date();
    }
    let current = event.target as HTMLElement;
    while (current) {
      if (current.id && current.id in this.countries) {
        const clicked = current.id;
        console.log(this.countries[clicked].name);
        if (this.sumScores === 0) {
          this.setCountry(clicked);
          this.highlighCountry(clicked);
        } else {
          if (clicked === this.isoCodes[this.current]) {
            this.scores[this.current]--;
            this.sumScores--;
            this.setRandomCountry();
          } else {
            this.scores[this.current]++;
            this.sumScores++;
          }
        }
        return;
      }
      current = current.parentElement;
    }
    console.log('Not in a country');
  }

  onHelp(event: MouseEvent) {
    this.highlighCountry(this.isoCodes[this.current]);
    this.scores[this.current] += 3;
    this.sumScores += 3;
  }

  setTime() {
    if (!this.started || this.sumScores === 0)
      return;
    const elapsed = Math.floor(new Date().getTime() - this.started.getTime()) / 1000;
    this.time = `${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toLocaleString(undefined, {minimumIntegerDigits: 2})}`;
  }
}
