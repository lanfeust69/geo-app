import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('game') game: GameComponent;
  @ViewChild('world') worldElem: ElementRef;

  highlighted: NodeListOf<Element>;
  flag: string;
  flagZoomed = false;

  constructor(private _renderer: Renderer2) { }

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

  highlightCountry(countryCode) {
    if (this.highlighted) {
      for (let i = 0; i < this.highlighted.length; i++)
        this._renderer.removeClass(this.highlighted[i], 'highlighted');
      this.highlighted = null;
    }
    const world = this.worldElem.nativeElement as Element;
    this.highlighted = world.querySelectorAll(`.${countryCode}`);
    for (let i = 0; i < this.highlighted.length; i++)
      this._renderer.addClass(this.highlighted[i], 'highlighted');
  }

  zoomFlag(flag) {
    this.flag = flag;
    this.flagZoomed = true;
  }
}
