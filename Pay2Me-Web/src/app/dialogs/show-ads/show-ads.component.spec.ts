import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdsComponent } from './show-ads.component';

describe('ShowAdsComponent', () => {
  let component: ShowAdsComponent;
  let fixture: ComponentFixture<ShowAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
