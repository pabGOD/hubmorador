import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { AgendamentoService, Agendamento } from '../../services/agendamento.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './meus-agendamentos.html',
  styleUrls: ['./meus-agendamentos.css']
})
export class MeusAgendamentosComponent implements OnInit, OnDestroy {
  
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  filtroAtivo: string = 'todos';
  filtroLocal: string = 'todos';
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    // A mágica acontece aqui: ao se inscrever, qualquer mudança no serviço
    // (adicionar, cancelar, excluir) será refletida aqui automaticamente.
    this.subscription = this.agendamentoService.agendamentos$.subscribe(agendamentos => {
      this.agendamentos = agendamentos;
      this.aplicarFiltros();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get agendamentosAtivos(): Agendamento[] {
    return this.agendamentos.filter(a => a.status === 'ativo');
  }

  get agendamentosConcluidos(): Agendamento[] {
    return this.agendamentos.filter(a => a.status === 'concluido');
  }

  filtrarAgendamentos(event: any): void {
    this.filtroAtivo = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorLocal(event: any): void {
    this.filtroLocal = event.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let filtrados = [...this.agendamentos];

    if (this.filtroAtivo !== 'todos') {
      filtrados = filtrados.filter(agendamento => 
        agendamento.status === this.filtroAtivo
      );
    }

    if (this.filtroLocal !== 'todos') {
      filtrados = filtrados.filter(agendamento => 
        // Lógica para corresponder o valor do select ('salao-festas') com o nome do local ('Salão de Festas')
        agendamento.local.toLowerCase().replace(/\s+/g, '-') === this.filtroLocal.toLowerCase()
      );
    }

    this.agendamentosFiltrados = filtrados;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ativo': 'Confirmado',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  cancelarAgendamento(agendamento: Agendamento): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento do ${agendamento.local}?`)) {
      this.agendamentoService.cancelarAgendamento(agendamento.id);
    }
  }

  editarAgendamento(agendamento: Agendamento): void {
    const rotas: { [key: string]: string } = {
      'Piscina': '/piscina',
      'Salão de Festas': '/salao-de-festas',
      'Salão de Jogos': '/salao-de-jogos',
      'Sala de Cinema': '/sala-de-cinema',
      'Quadra de Futebol': '/quadra-futebol'
    };
    
    const rota = rotas[agendamento.local] || '/agendamentos';
    this.router.navigate([rota], { 
      queryParams: { editar: agendamento.id } 
    });
  }

  // **** NOVA FUNÇÃO ADICIONADA AQUI ****
  excluirAgendamento(agendamento: Agendamento): void {
    // Adicionamos uma confirmação para evitar exclusões acidentais.
    const confirmacao = confirm(
      `Tem certeza que deseja EXCLUIR PERMANENTEMENTE o agendamento do local "${agendamento.local}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmacao) {
      this.agendamentoService.excluirAgendamento(agendamento.id);
    }
  }
}