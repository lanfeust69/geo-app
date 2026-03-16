import { Component, Input, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Countries, Country, DataService } from '../services/data.service';
import { FlagService } from '../services/flag.service';
import { Settings } from '../settings';

@Component({
  // necessary to embed the component in svg
  selector: '[geo-preview]', // eslint-disable-line @angular-eslint/component-selector
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  private _dataService = inject(DataService);
  private _flagService = inject(FlagService);
  private _sanitizer = inject(DomSanitizer);

  @Input() settings: Settings;

  _country: Country;
  flagSvg: SafeHtml;

  isoCodes: string[] = [];
  countries: Countries = {};
  flagsReady = false;
  ready = false;

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
  }

  get country(): string {
    return this._country.isoCode;
  }

  @Input()
  set country(countryCode: string) {
    if (!countryCode) {
      this._country = null;
      this.flagSvg = '';
      return;
    }
    this._country = this.countries[countryCode];
    this._flagService.getSvg(countryCode, 145, 100).subscribe(svg => {
      this.flagSvg = this._sanitizer.bypassSecurityTrustHtml(svg);
    });
  }
}
