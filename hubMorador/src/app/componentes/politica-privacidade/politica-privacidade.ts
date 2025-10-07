import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ADICIONAR ESTA LINHA

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  imports: [RouterModule], // ADICIONAR RouterModule AQUI
  templateUrl: './politica-privacidade.html',
  styleUrl: './politica-privacidade.css'
})
export class PoliticaPrivacidadeComponent {
  // O nome da classe deve ser exatamente este
}