import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Piscina } from './piscina';

describe('Piscina', () => {
  let component: Piscina;
  let fixture: ComponentFixture<Piscina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Piscina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Piscina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
