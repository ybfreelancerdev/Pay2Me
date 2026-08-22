import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawalaLogsComponent } from './hawala-logs.component';

describe('HawalaLogsComponent', () => {
  let component: HawalaLogsComponent;
  let fixture: ComponentFixture<HawalaLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawalaLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HawalaLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
