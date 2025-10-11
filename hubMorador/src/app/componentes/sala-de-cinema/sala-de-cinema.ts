import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// 1. Importar o serviço e o Subscription
import { AgendamentoService } from '../../services/agendamento.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sala-de-cinema',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './sala-de-cinema.html',
  styleUrls: ['./sala-de-cinema.css']
})
export class SalaDeCinemaComponent implements OnInit, OnDestroy {
  
  localInfo = {
    nome: 'Sala de Cinema' 
  };
  
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = '18:00 - 20:00';

  // Esta lista será preenchida dinamicamente
  agendamentos: Date[] = [];
  private subscription: Subscription = new Subscription();

  // 2. Injetar o AgendamentoService
  constructor(
    private userService: UserService, 
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    // Busca os agendamentos reais para popular o calendário
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      this.agendamentos = agendamentos
        .filter(ag => ag.local === this.localInfo.nome && ag.status === 'ativo')
        .map(ag => new Date(ag.data));
      
      this.gerarCalendario(); // Recria o calendário com as datas corretas
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
      this.diasDoMes.push({
        dia: i,
        data: data,
        isHoje: this.isHoje(data),
        isAgendado: this.isAgendado(data),
      });
    }
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
  }

  isAgendado(data: Date): boolean {
    return this.agendamentos.some(ag => 
      ag.getDate() === data.getDate() &&
      ag.getMonth() === data.getMonth() &&
      ag.getFullYear() === data.getFullYear()
    );
  }

  selecionarDia(dia: any) {
    if (dia.dia && !dia.isAgendado) {
      this.selectedDate = dia.data;
    }
  }

  confirmarAgendamento() {
    if (this.selectedDate && this.selectedTime) {
      // 3. Criar o objeto e chamar o serviço para salvar
      const novoAgendamento = {
        local: this.localInfo.nome,
        data: this.selectedDate,
        horario: this.selectedTime
        // O ícone é adicionado automaticamente pelo serviço
      };

      this.agendamentoService.adicionarAgendamento(novoAgendamento);

      // A lógica de notificação e navegação permanece a mesma
      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para a ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}