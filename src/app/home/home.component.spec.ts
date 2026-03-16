import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule, MatIconModule, MatMenuModule, FlagPickerComponent, GameComponent, HomeComponent],
            providers: [
                { provide: DataService, useValue: dataServiceStub },
                { provide: FlagService, useValue: flagServiceStub },
                provideRouter([])
            ]
        });
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        // probably no real point in test without the `detectChanges()`, but the angular components
        // embedded in a SVG `foreignObject` don't work in tests...
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
