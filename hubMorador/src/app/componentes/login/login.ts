import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// 1. Importar as ferramentas para formulários reativos
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. Adicionar ReactiveFormsModule para que o HTML entenda as diretivas de formulário
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  // 3. Criar a "caixa" para o nosso formulário de login
  loginForm!: FormGroup;

  // 4. Injetar o FormBuilder (para criar o formulário) e o Router (para navegar)
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // 5. Definir a estrutura e as regras de validação do formulário
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email é obrigatório e deve ser um email válido
      password: ['', Validators.required], // Senha é obrigatória
    });
  }

  // 6. Função para ser chamada quando o formulário for submetido
  onSubmit() {
    if (this.loginForm.valid) {
      // Se o formulário for válido, simula o login e navega para o dashboard
      console.log('Login Válido!', this.loginForm.value);
      this.router.navigate(['/dashboard']);
    } else {
      // Se for inválido, marca todos os campos como "tocados" para mostrar os erros
      this.loginForm.markAllAsTouched();
    }
  }
}

