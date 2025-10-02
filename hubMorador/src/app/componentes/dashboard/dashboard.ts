import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // 1. Adicionámos mais detalhes a cada local
  locais = [
    { 
      nome: 'Piscina', 
      id: 'piscina',
      icone: 'https://image.flaticon.com/icons/png/512/135/135221.png',
      descricao: 'Relaxe e aproveite o sol de Salvador na nossa piscina. Ideal para toda a família, com áreas para adultos e crianças.',
      rota: '/piscina' 
    },
    { 
      nome: 'Salão de Festas', 
      id: 'salao-festas',
      icone: 'https://image.flaticon.com/icons/png/512/3048/3048325.png',
      descricao: 'O espaço perfeito para as suas celebrações. Equipado com tudo o que precisa para aniversários, reuniões e eventos especiais.',
      rota: '/salao-de-festas' 
    },
    { 
      nome: 'Salão de Jogos', 
      id: 'salao-jogos',
      icone: 'https://image.flaticon.com/icons/png/512/893/893128.png',
      descricao: 'Diversão garantida com mesas de bilhar, matraquilhos e muito mais. Um ótimo lugar para socializar com os vizinhos.',
      rota: '/salao-de-jogos' 
    },
    { 
      nome: 'Sala de Cinema', 
      id: 'sala-cinema',
      icone: 'https://image.flaticon.com/icons/png/512/2798/2798007.png',
      descricao: 'Assista aos seus filmes e séries favoritos numa tela grande com som de cinema. Perfeito para uma noite diferente.',
      rota: '/sala-de-cinema' 
    }
  ];

  // 2. Variável para guardar o local que está selecionado
  selectedLocal: any;

  // 3. ngOnInit é executado quando o componente começa. Selecionamos o primeiro item da lista.
  ngOnInit() {
    this.selectedLocal = this.locais[0];
  }

  // 4. Função para trocar o local selecionado quando clicamos num item do menu
  selectLocal(local: any) {
    this.selectedLocal = local;
  }
}

