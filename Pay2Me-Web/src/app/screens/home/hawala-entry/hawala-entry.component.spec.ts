import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawalaEntryComponent } from './hawala-entry.component';

describe('HawalaEntryComponent', () => {
  let component: HawalaEntryComponent;
  let fixture: ComponentFixture<HawalaEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawalaEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HawalaEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
