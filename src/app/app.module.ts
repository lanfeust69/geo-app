import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatDividerModule, MatIconModule, MatSelectModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';
import { FlagPickerComponent } from './flag-picker/flag-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    SettingsComponent,
    FlagPickerComponent
  ],
  entryComponents: [SettingsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
