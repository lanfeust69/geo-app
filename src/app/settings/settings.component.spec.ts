import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { SettingsComponent } from './settings.component';
import { PlayScope, Settings } from '../settings';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatCheckboxModule, MatDialogModule, MatSelectModule ],
      declarations: [ SettingsComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: new Settings() }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // default values
    expect(component.settings.playScope).toBe('All');
    expect(component.showFlag).toBe(true);
    expect(component.queryLocation).toBe(true);
  });

  ['Name', 'Capital', 'Location'].forEach(property => {
    it(`should not show ${property} when queried`, () => {
      component[`show${property}`] = true;
      component[`query${property}`] = true;
      expect(component[`show${property}`]).toBe(false);
    });
    it(`should not query ${property} when showed`, () => {
      component[`query${property}`] = true;
      component[`show${property}`] = true;
      expect(component[`query${property}`]).toBe(false);
    });
  });
});
