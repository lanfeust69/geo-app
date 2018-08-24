import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatDividerModule, MatIconModule,
  MatMenuModule, MatSelectModule, MatSortModule, MatTableModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';
import { FlagPickerComponent } from './flag-picker/flag-picker.component';
import { StatsComponent } from './stats/stats.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    SettingsComponent,
    FlagPickerComponent,
    StatsComponent,
    HelpComponent
  ],
  entryComponents: [
    HelpComponent,
    SettingsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
