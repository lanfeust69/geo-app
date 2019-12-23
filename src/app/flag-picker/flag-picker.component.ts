import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FlagService, SvgMap } from '../services/flag.service';

const grid = [
  [1, 2, 3, 4, 77, 78, 79, 80],
  [8, 7, 6, 5, 76, 75, 74, 73],
  [9, 10, 11, 12, 69, 70, 71, 72],
  [16, 15, 14, 13, 68, 67, 66, 65],
  [17, 18, 19, 20, 61, 62, 63, 64],
  [24, 23, 22, 21, 60, 59, 58, 57],
  [25, 26, 27, 28, 51, 52, 53, 56],
  [32, 31, 30, 29, 50, 49, 54, 55],
  [33, 36, 37, 40, 41, 48, 47, 46],
  [34, 35, 38, 39, 42, 43, 44, 45]
];

const gridWalk: [number, number][] = [];
grid.forEach((a, r) => a.forEach((v, c) => gridWalk[v - 1] = [r, c]));

@Component({
  selector: 'geo-flag-picker',
  templateUrl: './flag-picker.component.html',
  styleUrls: ['./flag-picker.component.css']
})
export class FlagPickerComponent implements OnInit {
  @Output() flagClicked = new EventEmitter<string>();

  flagsGrid: SafeHtml[][] = Array.from(Array(10), _ => []);
  flagsIds: string[][] = Array.from(Array(10), _ => []);

  constructor(private _flagService: FlagService, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this._flagService.getAll().subscribe(allFlags => {
      const byGroup: string[][] = [];
      const allIsoCodes = Object.keys(allFlags);
      allIsoCodes.forEach(isoCode => {
        const group = allFlags[isoCode].group;
        (byGroup[group] ? byGroup[group] : byGroup[group] = []).push(isoCode);
      });
      // flush each group
      byGroup.forEach(g => {
        for (let i = 0; i < g.length - 1; i++) {
          const j = i + Math.floor(Math.random() * (g.length - i));
          const tmp = g[i];
          g[i] = g[j];
          g[j] = tmp;
        }
      });
      // sort by decreasing size
      byGroup.sort((a, b) => b.length - a.length);
      // simple algo : a "snake" walk of the grid that keep groups reasonably packed
      // TODO : see if we can use variants of https://codeincomplete.com/posts/bin-packing/ for something prettier
      let curPos = 0;
      for (const group of byGroup) {
        for (const isoCode of group) {
          const [r, c] = gridWalk[curPos % gridWalk.length];
          const cc = c + 8 * (Math.floor(curPos / gridWalk.length));
          this.flagsIds[r][cc] = isoCode;
          const svg = allFlags[isoCode].svg.replace('viewBox', 'width="60px", height="40px" viewBox');
          this.flagsGrid[r][cc] = this._sanitizer.bypassSecurityTrustHtml(svg);
          curPos++;
        }
      }
    });
  }

  onClicked(i: number, j: number, event) {
    event.stopPropagation();
    this.flagClicked.next(this.flagsIds[i][j]);
  }
}
