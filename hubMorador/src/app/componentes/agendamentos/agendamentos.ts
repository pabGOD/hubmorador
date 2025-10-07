import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './agendamentos.html',
  styleUrls: ['./agendamentos.css']
})
export class AgendamentosComponent {
  // A lista de locais agora vive aqui
  locais = [
    { 
      nome: 'Piscina', 
      id: 'piscina',
      icone: 'https://img.icons8.com/?size=100&id=XH3AddzHs6tY&format=png&color=000000',
      descricao: 'Ideal para toda a família.',
      cor: '#3498db',
      rota: '/piscina' 
    },
    { 
      nome: 'Salão de Festas', 
      id: 'salao-festas',
      icone: 'https://img.icons8.com/?size=100&id=PEmFcgjhBgKF&format=png&color=000000',
      descricao: 'Perfeito para celebrações.',
      cor: '#cee91fff',
      rota: '/salao-de-festas' 
    },
    { 
      nome: 'Salão de Jogos', 
      id: 'salao-jogos',
      icone: 'https://img.icons8.com/?size=100&id=V1Ja402KSwyz&format=png&color=000000',
      descricao: 'Diversão garantida.',
      cor: '#d22916bc',
      rota: '/salao-de-jogos' 
    },
    { 
      nome: 'Sala de Cinema', 
      id: 'sala-cinema',
      icone: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
      descricao: 'Uma noite diferente.',
      cor: '#9b59b6',
      rota: '/sala-de-cinema' 
    },
    { 
      nome: 'Quadra de Futebol', 
      id: 'quadra-futebol',
      icone: 'https://img.icons8.com/?size=100&id=96VqabWovcJm&format=png&color=000000',
      descricao: 'Para partidas emocionantes.',
      cor: '#6fb53dff',
      rota: '/quadra-futebol' 
    }
  ];
}