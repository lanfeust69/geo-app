import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlagPickerComponent } from './flag-picker.component';
import { FlagService } from '../services/flag.service';
import { flagServiceStub } from '../services/service.stubs';

describe('FlagPickerComponent', () => {
  let component: FlagPickerComponent;
  let fixture: ComponentFixture<FlagPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagPickerComponent ],
      providers:    [ { provide: FlagService, useValue: flagServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
