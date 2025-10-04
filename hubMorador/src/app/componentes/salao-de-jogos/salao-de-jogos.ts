import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salao-de-jogos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './salao-de-jogos.html',
  styleUrls: ['./salao-de-jogos.css']
})
export class SalaoDeJogosComponent implements OnInit {
  
  localInfo = {
    nome: 'Salão de Jogos' 
  };
  
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = '20:00 - 22:00'; // Default time

  // Example bookings for this specific area
  agendamentos = [
    new Date(2025, 9, 20),
    new Date(2025, 9, 21),
  ];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.gerarCalendario();
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
      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para o ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });

      alert(`Agendamento para o ${this.localInfo.nome} confirmado com sucesso!`);
      
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}
