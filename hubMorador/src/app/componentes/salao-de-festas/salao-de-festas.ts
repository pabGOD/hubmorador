import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs'; // 1. Importar o Subscription

@Component({
  selector: 'app-salao-de-festas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './salao-de-festas.html',
  styleUrls: ['./salao-de-festas.css']
})
export class SalaoDeFestasComponent implements OnInit, OnDestroy {
  
  localInfo = {
    nome: 'Salão de Festas'
    // 2. Removemos o 'icone' daqui, pois o serviço já sabe qual é.
  };
  
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  selectedDate: Date | null = null;
  selectedTime: string = '19:00 - 23:00';

  // Esta lista agora será preenchida dinamicamente pelo serviço
  agendamentos: Date[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService, 
    private agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega os agendamentos reais do serviço para popular o calendário
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      this.agendamentos = agendamentos
        .filter(ag => ag.local === this.localInfo.nome && ag.status === 'ativo')
        .map(ag => new Date(ag.data));
      
      this.gerarCalendario(); // Gera o calendário com os dias corretos já marcados
    });
  }

  ngOnDestroy(): void {
    // Evita vazamento de memória ao sair do componente
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
      // 3. Criamos o objeto sem a propriedade 'icone'
      const novoAgendamento = {
        local: this.localInfo.nome,
        data: this.selectedDate,
        horario: this.selectedTime
      };

      // O serviço se encarrega de adicionar o ícone correto
      this.agendamentoService.adicionarAgendamento(novoAgendamento);

      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para o ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}