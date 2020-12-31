import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { FlagPickerComponent } from './flag-picker/flag-picker.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { DataService } from './services/data.service';
import { FlagService } from './services/flag.service';
import { dataServiceStub, flagServiceStub } from './services/service.stubs';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatMenuModule, MatSelectModule, RouterTestingModule ],
      declarations: [
        AppComponent, FlagPickerComponent, GameComponent, HomeComponent, SettingsComponent
      ],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: FlagService, useValue: flagServiceStub }
      ]
    }).compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
