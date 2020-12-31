import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { FlagPickerComponent } from '../flag-picker/flag-picker.component';
import { GameComponent } from '../game/game.component';
import { HomeComponent } from './home.component';
import { DataService } from '../services/data.service';
import { FlagService } from '../services/flag.service';
import { dataServiceStub, flagServiceStub } from '../services/service.stubs';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatDialogModule, MatIconModule, MatMenuModule ],
      declarations: [ FlagPickerComponent, GameComponent, HomeComponent ],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: FlagService, useValue: flagServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
