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
      icone: 'https://cdn-icons-png.flaticon.com/512/309/309403.png',
      descricao: 'Ideal para toda a família.',
      cor: '#3498db',
      rota: '/piscina' 
    },
    { 
      nome: 'Salão de Festas', 
      id: 'salao-festas',
      icone: 'https://cdn-icons-png.flaticon.com/512/603/603123.png',
      descricao: 'Perfeito para celebrações.',
      cor: '#e74c3c',
      rota: '/salao-de-festas' 
    },
    { 
      nome: 'Salão de Jogos', 
      id: 'salao-jogos',
      icone: 'https://cdn-icons-png.flaticon.com/512/1048/1048958.png',
      descricao: 'Diversão garantida.',
      cor: '#2ecc71',
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
      icone: 'https://cdn-icons-png.flaticon.com/512/869/869423.png',
      descricao: 'Para partidas emocionantes.',
      cor: '#f39c12',
      rota: '/quadra-futebol' 
    }
  ];
}