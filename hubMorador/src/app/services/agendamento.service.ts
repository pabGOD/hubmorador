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

// **** LÓGICA DE ÍCONES CENTRALIZADA AQUI ****
// Mapeia o nome do local ao link do ícone correspondente.
const ICONE_POR_LOCAL: { [key: string]: string } = {
  'Piscina': 'https://img.icons8.com/?size=100&id=XH3AddzHs6tY&format=png&color=000000',
  'Salão de Festas': 'https://img.icons8.com/?size=100&id=PEmFcgjhBgKF&format=png&color=000000',
  'Salão de Jogos': 'https://img.icons8.com/?size=100&id=V1Ja402KSwyz&format=png&color=000000',
  'Sala de Cinema': 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
  'Quadra de Futebol': 'https://img.icons8.com/?size=100&id=96VqabWovcJm&format=png&color=000000'
};


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private agendamentosKey = 'hubmorador_agendamentos';
  private agendamentosSubject = new BehaviorSubject<Agendamento[]>(this.carregarAgendamentos());

  agendamentos$ = this.agendamentosSubject.asObservable();

  constructor() { }

  // **** NOVO MÉTODO PÚBLICO PARA OBTER ÍCONES ****
  // Agora outros componentes podem buscar o ícone correto usando este método.
  public getIconeParaLocal(local: string): string {
    return ICONE_POR_LOCAL[local] || 'https://img.icons8.com/?size=100&id=7856&format=png&color=000000'; // Ícone padrão
  }

  private carregarAgendamentos(): Agendamento[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const agendamentosSalvos = localStorage.getItem(this.agendamentosKey);
      if (agendamentosSalvos) {
        const agendamentos = JSON.parse(agendamentosSalvos);
        return agendamentos.map((ag: Agendamento) => ({
          ...ag,
          data: new Date(ag.data)
        }));
      }
      return this.getAgendamentosIniciais();
    }
    return this.getAgendamentosIniciais();
  }

  private getAgendamentosIniciais(): Agendamento[] {
    return [
   
      
    ];
  }

  private salvarAgendamentos(agendamentos: Agendamento[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.agendamentosKey, JSON.stringify(agendamentos));
    }
    this.agendamentosSubject.next(agendamentos);
  }

  adicionarAgendamento(novoAgendamento: Omit<Agendamento, 'id' | 'codigo' | 'status' | 'icone'>): void {
    const agendamentos = this.carregarAgendamentos();

    const agendamento: Agendamento = {
      ...novoAgendamento,
      id: this.gerarNovoId(agendamentos),
      // Atribui o ícone correto automaticamente com base no nome do local
      icone: this.getIconeParaLocal(novoAgendamento.local), 
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

  excluirAgendamento(id: number): void {
    const agendamentos = this.carregarAgendamentos();
    const agendamentosAtualizados = agendamentos.filter(a => a.id !== id);
    this.salvarAgendamentos(agendamentosAtualizados);
  }
}