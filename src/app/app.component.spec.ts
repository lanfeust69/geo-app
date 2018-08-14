import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialogModule, MatIconModule, MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { DataService } from './services/data.service';
import { FlagService } from './services/flag.service';
import { dataServiceStub, flagServiceStub } from './services/service.stubs';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatSelectModule ],
      declarations: [
        AppComponent, GameComponent, HomeComponent, SettingsComponent
      ],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: FlagService, useValue: flagServiceStub }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
