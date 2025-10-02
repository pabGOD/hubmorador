import { Component } from '@angular/core';
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
export class DashboardComponent {
  
  // As imagens foram substituídas por links de alta qualidade
  locais = [
    { nome: 'Piscina', imagem: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', rota: '/piscina' },
    { nome: 'Salão de Festas', imagem: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg', rota: '/salao-de-festas' },
    { nome: 'Salão de Jogos', imagem: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg', rota: '/salao-de-jogos' },
    { nome: 'Sala de Cinema', imagem: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg', rota: '/sala-de-cinema' }
  ];

}

