import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PlayScope, Settings } from '../settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  playScopes: PlayScope[] = ['All', 'Top 100', 'Top 50', 'Africa', 'America', 'Asia', 'Europe', 'Oceania'];

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public settings: Settings) { }

    get showName() {
      return this.settings.showName;
    }
    set showName(value: boolean) {
      this.settings.showName = value;
      if (value && this.settings.queryName)
        this.settings.queryName = false;
    }
    get queryName() {
      return this.settings.queryName;
    }
    set queryName(value: boolean) {
      this.settings.queryName = value;
      if (value && this.settings.showName)
        this.settings.showName = false;
    }

    get showCapital() {
      return this.settings.showCapital;
    }
    set showCapital(value: boolean) {
      this.settings.showCapital = value;
      if (value && this.settings.queryCapital)
        this.settings.queryCapital = false;
    }
    get queryCapital() {
      return this.settings.queryCapital;
    }
    set queryCapital(value: boolean) {
      this.settings.queryCapital = value;
      if (value && this.settings.showCapital)
        this.settings.showCapital = false;
    }

    get showLocation() {
      return this.settings.showLocation;
    }
    set showLocation(value: boolean) {
      this.settings.showLocation = value;
      if (value && this.settings.queryLocation)
        this.settings.queryLocation = false;
    }
    get queryLocation() {
      return this.settings.queryLocation;
    }
    set queryLocation(value: boolean) {
      this.settings.queryLocation = value;
      if (value && this.settings.showLocation)
        this.settings.showLocation = false;
    }

    get showFlag() {
      return this.settings.showFlag;
    }
    set showFlag(value: boolean) {
      this.settings.showFlag = value;
      if (value && this.settings.queryFlag)
        this.settings.queryFlag = false;
    }
    get queryFlag() {
      return this.settings.queryFlag;
    }
    set queryFlag(value: boolean) {
      this.settings.queryFlag = value;
      if (value && this.settings.showFlag)
        this.settings.showFlag = false;
    }
}
