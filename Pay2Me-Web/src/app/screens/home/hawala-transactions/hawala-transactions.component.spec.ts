import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawalaTransactionsComponent } from './hawala-transactions.component';

describe('HawalaTransactionsComponent', () => {
  let component: HawalaTransactionsComponent;
  let fixture: ComponentFixture<HawalaTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawalaTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HawalaTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
