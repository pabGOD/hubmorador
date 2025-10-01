import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importar o Router para fazer a navegação
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class CadastroComponent implements OnInit {
  currentStep = 1;
  step1Form!: FormGroup;
  step2Form!: FormGroup;

  // 2. Injetar o Router no construtor para que possamos usá-lo
  constructor(private fb: FormBuilder, private router: Router) {}

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
    if (this.step2Form.valid) {
      const formData = { ...this.step1Form.value, ...this.step2Form.value };
      console.log('Formulário Válido e Enviado!', formData);

      // 3. Em vez de mostrar o alerta, navegamos para o dashboard!
      this.router.navigate(['/dashboard']);

    } else {
      this.step2Form.markAllAsTouched();
    }
  }
}

