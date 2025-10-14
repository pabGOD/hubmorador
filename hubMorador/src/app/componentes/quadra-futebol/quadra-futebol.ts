import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import localePt from '@angular/common/locales/pt';

// 1. Importar o serviço de agendamento e o Subscription
import { AgendamentoService } from '../../services/agendamento.service';
import { Subscription } from 'rxjs';

registerLocaleData(localePt);

// **ALTERAÇÃO AQUI**: Adicionada a propriedade 'isPassado'
interface DiaCalendario {
  dia: number | string;
  data: Date | null;
  isOutroMes?: boolean;
  isHoje?: boolean;
  isAgendado?: boolean;
  isPassado?: boolean; // Nova propriedade
}

@Component({
  selector: 'app-quadra-futebol',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './quadra-futebol.html',
  styleUrls: ['./quadra-futebol.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class QuadraFutebolComponent implements OnInit, OnDestroy {
  
  localInfo = {
    nome: 'Quadra de Futebol'
  };
  
  mesAtual: Date = new Date();
  diasDoMes: DiaCalendario[] = [];
  selectedDate: Date | null = null;
  selectedTime: string = '08:00 - 10:00';

  agendamentos: Set<number> = new Set();
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService, 
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      const agendamentosNesteLocal = agendamentos
        .filter(ag => ag.local === this.localInfo.nome && ag.status === 'ativo')
        .map(ag => new Date(ag.data).setHours(0, 0, 0, 0));
      
      this.agendamentos = new Set(agendamentosNesteLocal);
      
      this.gerarCalendario();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  gerarCalendario() {
    this.diasDoMes = [];
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();
    
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

    for (let i = primeiroDiaSemana; i > 0; i--) {
        const dia = ultimoDiaMesAnterior - i + 1;
        const data = new Date(ano, mes - 1, dia);
        // **ALTERAÇÃO AQUI**: Adicionada a verificação
        this.diasDoMes.push({ dia, data, isOutroMes: true, isPassado: this.isPassado(data) });
    }

    for (let i = 1; i <= ultimoDiaMes; i++) {
      const data = new Date(ano, mes, i);
      // **ALTERAÇÃO AQUI**: Adicionada a verificação
      this.diasDoMes.push({
        dia: i,
        data: data,
        isHoje: this.isHoje(data),
        isAgendado: this.isAgendado(data),
        isPassado: this.isPassado(data) // Nova propriedade
      });
    }

    const ultimoDiaSemana = new Date(ano, mes, ultimoDiaMes).getDay();
    for (let i = 1; i < 7 - ultimoDiaSemana; i++) {
        const data = new Date(ano, mes + 1, i);
        // **ALTERAÇÃO AQUI**: Adicionada a verificação
        this.diasDoMes.push({ dia: i, data, isOutroMes: true, isPassado: this.isPassado(data) });
    }
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.setHours(0,0,0,0) === hoje.setHours(0,0,0,0);
  }

  isAgendado(data: Date): boolean {
    return this.agendamentos.has(data.setHours(0,0,0,0));
  }
  
  isPassado(data: Date | null): boolean {
    if (!data) return true;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data < hoje;
  }

  selecionarDia(dia: DiaCalendario) {
    // Esta verificação já está correta e impede o clique
    if (dia.data && !dia.isAgendado && !this.isPassado(dia.data)) {
      this.selectedDate = dia.data;
    }
  }

  mudarMes(offset: number): void {
    this.mesAtual.setMonth(this.mesAtual.getMonth() + offset);
    this.mesAtual = new Date(this.mesAtual);
    this.gerarCalendario();
  }

  confirmarAgendamento() {
    if (this.selectedDate && this.selectedTime) {
      const novoAgendamento = {
        local: this.localInfo.nome,
        data: this.selectedDate,
        horario: this.selectedTime
      };

      this.agendamentoService.adicionarAgendamento(novoAgendamento);

      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para a ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });
      
      this.selectedDate = null;
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}
