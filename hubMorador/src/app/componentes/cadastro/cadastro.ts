import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// 1. Importar o nosso novo UserService
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
  currentStep = 1;
  step1Form!: FormGroup;
  step2Form!: FormGroup;

  // 2. Injetar o UserService no construtor, para além dos outros
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.step1Form = this.fb.group({
        nome: ['', Validators.required],
        apartamento: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
    });
    this.step2Form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.step1Form.valid) {
      this.currentStep = 2;
    } else {
      this.step1Form.markAllAsTouched();
    }
  }

  prevStep() {
    this.currentStep = 1;
  }

  onSubmit() {
    // 3. Garantir que ambos os formulários são válidos antes de continuar
    if (this.step1Form.valid && this.step2Form.valid) {
      // 4. Chamar a função 'login' do serviço, passando o nome do novo utilizador
      this.userService.login({ nome: this.step1Form.value.nome });
      // 5. Navegar para o dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Se algum formulário for inválido, marca todos os campos para mostrar os erros
      this.step1Form.markAllAsTouched();
      this.step2Form.markAllAsTouched();
    }
  }
}

