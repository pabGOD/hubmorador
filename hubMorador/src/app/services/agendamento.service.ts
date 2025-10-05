import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Agendamento {
  id: number;
  local: string;
  icone: string;
  data: Date;
  horario: string;
  status: 'ativo' | 'concluido' | 'cancelado';
  codigo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private agendamentosKey = 'hubmorador_agendamentos';
  private agendamentosSubject = new BehaviorSubject<Agendamento[]>(this.carregarAgendamentos());
  
  agendamentos$ = this.agendamentosSubject.asObservable();

  constructor() {}

  private carregarAgendamentos(): Agendamento[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const agendamentosSalvos = localStorage.getItem(this.agendamentosKey);
      return agendamentosSalvos ? JSON.parse(agendamentosSalvos) : this.getAgendamentosIniciais();
    }
    return this.getAgendamentosIniciais();
  }

  private getAgendamentosIniciais(): Agendamento[] {
  return [
    {
      id: 1,
      local: 'Salão de Festas',
      icone: 'https://cdn-icons-png.flaticon.com/512/3222/3222696.png',
      data: new Date(2025, 9, 28),
      horario: '19:00 - 23:00',
      status: 'ativo',
      codigo: 'SF-2025-001'
    },
    {
      id: 2,
      local: 'Piscina',
      icone: 'https://cdn-icons-png.flaticon.com/512/309/309403.png',
      data: new Date(2025, 9, 20),
      horario: '14:00 - 16:00',
      status: 'concluido',
      codigo: 'PI-2025-045'
    },
    {
      id: 3,
      local: 'Sala de Cinema',
      icone: 'https://cdn-icons-png.flaticon.com/512/3163/3163769.png',
      data: new Date(2025, 9, 25),
      horario: '20:00 - 22:00',
      status: 'ativo',
      codigo: 'SC-2025-078'
    }
  ];
}

  private salvarAgendamentos(agendamentos: Agendamento[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
    }
    this.agendamentosSubject.next(agendamentos);
  }

  adicionarAgendamento(novoAgendamento: Omit<Agendamento, 'id' | 'codigo' | 'status'>): void {
    const agendamentos = this.carregarAgendamentos();
    
    const agendamento: Agendamento = {
      ...novoAgendamento,
      id: this.gerarNovoId(agendamentos),
      codigo: this.gerarCodigo(novoAgendamento.local),
      status: 'ativo'
    };

    agendamentos.push(agendamento);
    this.salvarAgendamentos(agendamentos);
  }

  private gerarNovoId(agendamentos: Agendamento[]): number {
    return agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1;
  }

  private gerarCodigo(local: string): string {
    const prefixos: { [key: string]: string } = {
      'Piscina': 'PI',
      'Salão de Festas': 'SF',
      'Salão de Jogos': 'SJ',
      'Sala de Cinema': 'SC',
      'Quadra de Futebol': 'QF'
    };

    const prefixo = prefixos[local] || 'AG';
    const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const ano = new Date().getFullYear();

    return `${prefixo}-${ano}-${numero}`;
  }

  getAgendamentos(): Agendamento[] {
    return this.carregarAgendamentos();
  }

  cancelarAgendamento(id: number): void {
    const agendamentos = this.carregarAgendamentos();
    const index = agendamentos.findIndex(a => a.id === id);
    
    if (index !== -1) {
      agendamentos[index].status = 'cancelado';
      this.salvarAgendamentos(agendamentos);
    }
  }
}