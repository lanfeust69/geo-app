import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GameComponent } from '../game/game.component';
import { HelpComponent } from '../help/help.component';
import { SettingsComponent } from '../settings/settings.component';

import { StatsService } from '../services/stats.service';

import { Settings } from '../settings';
import { QuerySettings } from '../stats';

@Component({
  selector: 'geo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('game', { static: false }) game: GameComponent;
  @ViewChild('world', { static: false }) worldElem: ElementRef;

  gameSettings = new Settings();

  showFlagPicker = false;
  highlighted: NodeListOf<Element>;
  flag: string;
  flagZoomed = false;
  vX0 = -40;
  vY0 = 60;
  vW0 = 2780;
  vH0 = 1400;
  vX = 0;
  vY = 0;
  vW = this.vW0;
  vH = this.vH0;

  constructor(private _statsService: StatsService, private _renderer: Renderer2, private _dialog: MatDialog) { }

  ngOnInit() {
    const fromStorage = localStorage.getItem('settings');
    this.gameSettings = fromStorage ? JSON.parse(fromStorage) : new Settings();
    this._statsService.setCurrentSettings(new QuerySettings(this.gameSettings));
  }

  onClick(event: MouseEvent) {
    let current = event.target as HTMLElement;
    while (current) {
      if (current.id && current.id in this.game.countries) {
        const clicked = current.id;
        console.log(this.game.countries[clicked].name);
        this.game.countryClicked(clicked);
        return;
      }
      current = current.parentElement;
    }
    console.log('Not in a country');
  }

  openSettingsDialog(): void {
    const playScope = this.gameSettings.playScope;
    const dialogRef = this._dialog.open(SettingsComponent, {
      data: this.gameSettings
    });

    dialogRef.afterClosed().subscribe(() => {
      this._statsService.setCurrentSettings(new QuerySettings(this.gameSettings));
      localStorage.setItem('settings', JSON.stringify(this.gameSettings));
      if (this.gameSettings.playScope !== playScope && this.game.isPlaying) {
        console.log('The play scope has changed, reset game');
        this.game.play();
      }
    });
  }

  openHelpDialog(): void {
    this._dialog.open(HelpComponent);
  }

  flagClicked(countryCode) {
    if (countryCode)
      this.game.flagClicked(countryCode);
    else
      this.showFlagPicker = false;
  }

  highlightCountry(countryCode) {
    if (this.highlighted) {
      for (let i = 0; i < this.highlighted.length; i++)
        this._renderer.removeClass(this.highlighted[i], 'highlighted');
      this.highlighted = null;
    }
    if (!countryCode)
      return;
    const world = this.worldElem.nativeElement as Element;
    this.highlighted = world.querySelectorAll(`.${countryCode}`);
    for (let i = 0; i < this.highlighted.length; i++)
      this._renderer.addClass(this.highlighted[i], 'highlighted');
  }

  zoomFlag(flag) {
    this.flag = flag;
    this.flagZoomed = true;
  }

  onWheel(event: WheelEvent) {
    const el = this.worldElem.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const relX = event.offsetX / rect.width;
    const relY = event.offsetY / rect.height;
    if (event.deltaY < 0) {
      const dW = this.vW * 0.05;
      this.vW -= dW;
      this.vX += dW * relX;
      const dH = this.vH * 0.05;
      this.vH -= dH;
      this.vY += dH * relY;
    } else {
      const dW = this.vW * 0.05;
      if (this.vW + dW >= this.vW0) {
        this.vX = 0;
        this.vY = 0;
        this.vW = this.vW0;
        this.vH = this.vH0;
        return;
      }
      this.vW += dW;
      this.vX -= dW * relX;
      if (this.vX < 0)
        this.vX = 0;
      if (this.vX + this.vW > this.vW0)
        this.vX = this.vW0 - this.vW;
      const dH = this.vH * 0.05;
      this.vH += dH;
      this.vY -= dH * relY;
      if (this.vY < 0)
        this.vY = 0;
      if (this.vY + this.vH > this.vH0)
        this.vY = this.vH0 - this.vH;
    }
  }

  get viewBox() {
    return `${this.vX0 + this.vX} ${this.vY0 + this.vY} ${this.vW} ${this.vH}`;
  }
}
