import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user.service';
// 1. Importar o Router para podermos navegar no final
import { Router } from '@angular/router';

@Component({
  selector: 'app-piscina',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './piscina.html',
  styleUrls: ['./piscina.css']
})
export class PiscinaComponent implements OnInit {
  
  // --- ALTERAÇÃO PRINCIPAL ---
  // Agora, toda a informação específica deste local está num único objeto.
  // Quando copiar este código para o "salao-de-festas.ts", só precisa de mudar aqui!
  localInfo = {
    nome: 'Piscina' 
  };
  
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = '10:00 - 12:00';

  agendamentos = [
    new Date(2025, 9, 10),
    new Date(2025, 9, 15),
    new Date(2025, 9, 22),
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
      // Usamos 'this.localInfo.nome' para que a mensagem seja dinâmica
      this.userService.addNotification({
        title: 'Reserva Confirmada!',
        message: `A sua reserva para a ${this.localInfo.nome} no dia ${this.selectedDate.toLocaleDateString()} (${this.selectedTime}) foi efetuada.`
      });

      alert(`Agendamento para a ${this.localInfo.nome} confirmado com sucesso!`);
      
      // Bónus: Após o agendamento, navegamos para a página "Meus Agendamentos"
      this.router.navigate(['/meus-agendamentos']);
    }
  }
}

