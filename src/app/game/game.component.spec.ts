import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { GameComponent } from './game.component';
import { Settings } from '../settings';
import { DataService } from '../services/data.service';
import { FlagService } from '../services/flag.service';
import { dataServiceStub, flagServiceStub } from '../services/service.stubs';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ GameComponent ],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: FlagService, useValue: flagServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component.settings = new Settings();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
