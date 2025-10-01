import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaoDeFestas } from './salao-de-festas';

describe('SalaoDeFestas', () => {
  let component: SalaoDeFestas;
  let fixture: ComponentFixture<SalaoDeFestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaoDeFestas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaoDeFestas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
