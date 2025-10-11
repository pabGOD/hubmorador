import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// 1. Importamos o AgendamentoService e o Subscription para o calendário dinâmico
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

  // Esta lista agora será preenchida dinamicamente pelo serviço
  agendamentos: Date[] = [];
  private subscription: Subscription = new Subscription();

  // 2. Injetamos o AgendamentoService no construtor
  constructor(
    private userService: UserService, 
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    // (BÔNUS) Buscamos os agendamentos reais do serviço para popular o calendário
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      this.agendamentos = agendamentos
        // Filtramos para pegar apenas os agendamentos deste local específico
        .filter(ag => ag.local === this.localInfo.nome && ag.status === 'ativo')
        // Mapeamos para ter apenas a lista de datas
        .map(ag => new Date(ag.data));
      
      // Geramos o calendário com os dias já marcados como agendados
      this.gerarCalendario();
    });
  }

  ngOnDestroy(): void {
    // Boa prática para evitar vazamento de memória
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
      // 3. Criamos o objeto e chamamos o serviço para salvar o novo agendamento
      const novoAgendamento = {
        local: this.localInfo.nome,
        data: this.selectedDate,
        horario: this.selectedTime
        // Não precisamos mais passar o 'icone', o serviço faz isso sozinho!
      };

      this.agendamentoService.adicionarAgendamento(novoAgendamento);

      // A lógica de notificação e redirecionamento continua a mesma
      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para o ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });

      // alert(`Agendamento para o ${this.localInfo.nome} confirmado com sucesso!`);
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}