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
  // Variável para a sidebar em ecrãs grandes
  isSidebarOpen = false;
  // Variável para o botão flutuante em ecrãs pequenos
  isFabMenuOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleFabMenu() {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }

  // Função para fechar qualquer menu que esteja aberto ao navegar
  closeMenus() {
    this.isSidebarOpen = false;
    this.isFabMenuOpen = false;
  }
}

