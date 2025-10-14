import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-salao-de-jogos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './salao-de-jogos.html',
  styleUrls: ['./salao-de-jogos.css']
})
export class SalaoDeJogosComponent implements OnInit, OnDestroy {
  
  localInfo = {
    nome: 'Salão de Jogos' 
  };
  
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = '20:00 - 22:00';

  agendamentos: Date[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService, 
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      this.agendamentos = agendamentos
        .filter(ag => ag.local === this.localInfo.nome && ag.status === 'ativo')
        .map(ag => new Date(ag.data));
      
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
    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDiaDoMes; i++) {
      this.diasDoMes.push({ dia: '', isOutroMes: true });
    }

    for (let i = 1; i <= ultimoDiaDoMes; i++) {
      const data = new Date(ano, mes, i);
      // **ALTERAÇÃO AQUI**: Adicionada a verificação de data passada
      this.diasDoMes.push({
        dia: i,
        data: data,
        isHoje: this.isHoje(data),
        isAgendado: this.isAgendado(data),
        isPassado: this.isPassado(data) // Nova propriedade
      });
    }
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
  }

  // **NOVO MÉTODO**: Verifica se a data é anterior a hoje
  isPassado(data: Date): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data < hoje;
  }

  isAgendado(data: Date): boolean {
    return this.agendamentos.some(ag => 
      ag.getDate() === data.getDate() &&
      ag.getMonth() === data.getMonth() &&
      ag.getFullYear() === data.getFullYear()
    );
  }

  selecionarDia(dia: any) {
    // **ALTERAÇÃO AQUI**: Impede o clique em dias agendados ou passados
    if (dia.dia && !dia.isAgendado && !dia.isPassado) {
      this.selectedDate = dia.data;
    }
  }

  // **NOVO MÉTODO**: Para navegar entre os meses
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
        message: `A sua reserva para o ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}
