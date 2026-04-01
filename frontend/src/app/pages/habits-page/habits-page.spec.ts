import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsPage } from './habits-page';

describe('HabitsPage', () => {
  let component: HabitsPage;
  let fixture: ComponentFixture<HabitsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
