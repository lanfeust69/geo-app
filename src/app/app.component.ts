import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
export class AppComponent implements OnInit {
  country: string;
  capital: string;
  flag: string;

  isoCodes: string[] = [];
  countries: { [index: string]: Country } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('assets/data.csv', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/\r?\n/)) {
        const [name, capital, flag, isoCode] = line.split(/;/);
        if (isoCode in this.countries) {
          this.countries[isoCode].capitals.push(capital);
        } else {
          this.isoCodes.push(isoCode);
          this.countries[isoCode] = { isoCode, name, capitals: [capital], flag: `assets/flags/${flag}.svg` };
        }
      }
      this.setRandomCountry();
    });
  }

  setRandomCountry() {
    const i = Math.floor(Math.random() * this.isoCodes.length);
    const country = this.countries[this.isoCodes[i]];
    this.country = country.name;
    this.capital = country.capitals.join(' ou ');
    this.flag = country.flag;
  }
}
