import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FlagService, SvgMap } from '../services/flag.service';

@Component({
  selector: 'geo-flag-picker',
  templateUrl: './flag-picker.component.html',
  styleUrls: ['./flag-picker.component.css']
})
export class FlagPickerComponent implements OnInit {
  @Output() flagClicked = new EventEmitter<string>();

  allFlags: SvgMap;
  allIsoCodes: string[];
  flagsGrid: SafeHtml[][] = [];

  constructor(private _flagService: FlagService, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this._flagService.getAll().subscribe(m => {
      this.allFlags = m;
      this.allIsoCodes = Object.keys(m);
      for (let i = 0; i < this.allIsoCodes.length - 1; i++) {
        const j = i + Math.floor(Math.random() * (this.allIsoCodes.length - i));
        const tmp = this.allIsoCodes[i];
        this.allIsoCodes[i] = this.allIsoCodes[j];
        this.allIsoCodes[j] = tmp;
      }
      for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 20; j++) {
          // not 200 flags in unit tests...
          if (i * 20 + j >= this.allIsoCodes.length)
            break;
          const svg = m[this.allIsoCodes[i * 20 + j]].replace('viewBox', 'width="60px", height="40px" viewBox');
          row.push(this._sanitizer.bypassSecurityTrustHtml(svg));
        }
        this.flagsGrid.push(row);
      }
    });
  }

  onClicked(i: number, j: number, event) {
    event.stopPropagation();
    this.flagClicked.next(this.allIsoCodes[i * 20 + j]);
  }
}
