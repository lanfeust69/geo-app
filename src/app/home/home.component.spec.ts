import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatIconModule } from '@angular/material';

import { GameComponent } from '../game/game.component';
import { HomeComponent } from './home.component';
import { DataService } from '../services/data.service';
import { FlagService } from '../services/flag.service';
import { dataServiceStub, flagServiceStub } from '../services/service.stubs';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatDialogModule, MatIconModule ],
      declarations: [ GameComponent, HomeComponent ],
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
