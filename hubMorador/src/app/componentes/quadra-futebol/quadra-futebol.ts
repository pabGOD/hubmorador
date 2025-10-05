import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import localePt from '@angular/common/locales/pt';

// Registrar o locale pt-BR para que os pipes de data funcionem em português
registerLocaleData(localePt);

// Interface para um dia do calendário, para deixar o código mais seguro
interface DiaCalendario {
  dia: number | string;
  data: Date | null;
  isOutroMes?: boolean;
  isHoje?: boolean;
  isAgendado?: boolean;
}

@Component({
  selector: 'app-quadra-futebol',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './quadra-futebol.html',
  styleUrls: ['./quadra-futebol.css'], // Recomendo usar o CSS próprio
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }] // Garante o pipe em português
})
export class QuadraFutebolComponent implements OnInit {
  
  localInfo = {
    nome: 'Quadra de Futebol'
  };
  
  mesAtual: Date = new Date();
  diasDoMes: DiaCalendario[] = [];
  selectedDate: Date | null = null;
  selectedTime: string = '08:00 - 10:00';

  // Usando um Set para verificar agendamentos de forma mais eficiente
  agendamentos: Set<number> = new Set([
    new Date(2025, 9, 5).setHours(0,0,0,0),
    new Date(2025, 9, 12).setHours(0,0,0,0),
    new Date(2025, 9, 19).setHours(0,0,0,0),
    new Date(2025, 9, 26).setHours(0,0,0,0),
  ]);

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.gerarCalendario();
  }

  gerarCalendario() {
    this.diasDoMes = [];
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();
    
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

    // Preenche os dias do mês anterior
    for (let i = primeiroDiaSemana; i > 0; i--) {
        const dia = ultimoDiaMesAnterior - i + 1;
        const data = new Date(ano, mes - 1, dia);
        this.diasDoMes.push({ dia, data, isOutroMes: true });
    }

    // Preenche os dias do mês atual
    for (let i = 1; i <= ultimoDiaMes; i++) {
      const data = new Date(ano, mes, i);
      this.diasDoMes.push({
        dia: i,
        data: data,
        isHoje: this.isHoje(data),
        isAgendado: this.isAgendado(data),
      });
    }

    // Preenche os dias do próximo mês para completar a grade
     const ultimoDiaSemana = new Date(ano, mes, ultimoDiaMes).getDay();
     for (let i = 1; i < 7 - ultimoDiaSemana; i++) {
        const data = new Date(ano, mes + 1, i);
        this.diasDoMes.push({ dia: i, data, isOutroMes: true });
    }
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.setHours(0,0,0,0) === hoje.setHours(0,0,0,0);
  }

  isAgendado(data: Date): boolean {
    return this.agendamentos.has(data.setHours(0,0,0,0));
  }
  
  // FUNÇÃO ADICIONADA
  isPassado(data: Date | null): boolean {
    if (!data) return true;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
    return data < hoje;
  }

  selecionarDia(dia: DiaCalendario) {
    if (dia.data && !dia.isAgendado && !this.isPassado(dia.data)) {
      this.selectedDate = dia.data;
    }
  }

  // FUNÇÃO ADICIONADA
  mudarMes(offset: number): void {
    this.mesAtual.setMonth(this.mesAtual.getMonth() + offset);
    this.mesAtual = new Date(this.mesAtual); // Cria nova instância para o Angular detectar a mudança
    this.gerarCalendario();
  }

  confirmarAgendamento() {
    if (this.selectedDate && this.selectedTime) {
      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para a ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });
      
      // Adiciona o novo agendamento à lista para que ele apareça como bloqueado
      this.agendamentos.add(this.selectedDate.setHours(0,0,0,0));
      this.gerarCalendario(); // Regenera o calendário para mostrar o dia como agendado
      this.selectedDate = null; // Limpa a seleção
      
      alert(`Agendamento para a ${this.localInfo.nome} confirmado com sucesso!`);
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}

