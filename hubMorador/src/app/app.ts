import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// REMOVA esta linha se não está usando navbar
// import { NavbarComponent } from './componentes/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  // REMOVA NavbarComponent daqui
  imports: [CommonModule, RouterOutlet], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}