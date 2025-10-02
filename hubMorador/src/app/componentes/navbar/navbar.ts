import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // Variável para controlar se o menu está aberto ou fechado
  isSidebarOpen = false;

  // Função para abrir/fechar o menu
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

