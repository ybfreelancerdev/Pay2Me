import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLimitComponent } from './user-limit.component';

describe('UserLimitComponent', () => {
  let component: UserLimitComponent;
  let fixture: ComponentFixture<UserLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
