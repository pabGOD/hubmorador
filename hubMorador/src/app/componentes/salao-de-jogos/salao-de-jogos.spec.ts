import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaoDeJogos } from './salao-de-jogos';

describe('SalaoDeJogos', () => {
  let component: SalaoDeJogos;
  let fixture: ComponentFixture<SalaoDeJogos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaoDeJogos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaoDeJogos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
