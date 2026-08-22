import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InprocessRequestComponent } from './inprocess-request.component';

describe('InprocessRequestComponent', () => {
  let component: InprocessRequestComponent;
  let fixture: ComponentFixture<InprocessRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InprocessRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InprocessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
