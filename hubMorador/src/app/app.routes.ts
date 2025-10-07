import { Routes } from '@angular/router';

// Importando todos os seus componentes com os caminhos corretos
import { LoginComponent } from './componentes/login/login';
import { CadastroComponent } from './componentes/cadastro/cadastro';
import { DashboardComponent } from './componentes/dashboard/dashboard';
import { SalaoDeFestasComponent } from './componentes/salao-de-festas/salao-de-festas';
import { PiscinaComponent } from './componentes/piscina/piscina';
import { SalaoDeJogosComponent } from './componentes/salao-de-jogos/salao-de-jogos';
import { SalaDeCinemaComponent } from './componentes/sala-de-cinema/sala-de-cinema';
import { MeusAgendamentosComponent } from './componentes/meus-agendamentos/meus-agendamentos';
import { QuadraFutebolComponent } from './componentes/quadra-futebol/quadra-futebol';
import { AgendamentosComponent } from './componentes/agendamentos/agendamentos';
// CORREÇÃO: Importar com o nome correto da classe
import { PoliticaPrivacidadeComponent } from './componentes/politica-privacidade/politica-privacidade';

export const routes: Routes = [
  // Rota Inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas de acesso
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  // Rotas da aplicação (após o login)
  { path: 'dashboard', component: DashboardComponent },
  { path: 'salao-de-festas', component: SalaoDeFestasComponent },
  { path: 'piscina', component: PiscinaComponent },
  { path: 'salao-de-jogos', component: SalaoDeJogosComponent },
  { path: 'sala-de-cinema', component: SalaDeCinemaComponent },
  { path: 'quadra-futebol', component: QuadraFutebolComponent },
  { path: 'meus-agendamentos', component: MeusAgendamentosComponent },
  { path: 'agendamentos', component: AgendamentosComponent },
  { path: 'politica-privacidade', component: PoliticaPrivacidadeComponent },

  // Rota "Coringa" para rotas inexistentes
  { path: '**', redirectTo: 'login' }
];