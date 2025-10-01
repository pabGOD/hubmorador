import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadraFutebol } from './quadra-futebol';

describe('QuadraFutebol', () => {
  let component: QuadraFutebol;
  let fixture: ComponentFixture<QuadraFutebol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadraFutebol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadraFutebol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
