import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// 1. Importar o NavbarComponent para que este ficheiro o conheça.
import { NavbarComponent } from './componentes/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Adicionar o NavbarComponent aqui.
  imports: [CommonModule, RouterOutlet, NavbarComponent], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}

