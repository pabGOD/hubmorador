import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaDeCinema } from './sala-de-cinema';

describe('SalaDeCinema', () => {
  let component: SalaDeCinema;
  let fixture: ComponentFixture<SalaDeCinema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaDeCinema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaDeCinema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
