import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';

// Validador personalizado para confirmar senha (MOVIDO PARA FORA DA CLASSE)
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
 const password = control.get('password');
 const confirmPassword = control.get('confirmPassword');
 
 if (password && confirmPassword && password.value !== confirmPassword.value) {
  return { passwordMismatch: true };
 }
 return null;
}

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

 constructor(
  private fb: FormBuilder,
  private router: Router,
  private userService: UserService
 ) {}

 ngOnInit(): void {
  this.step1Form = this.fb.group({
    nome: ['', Validators.required],
    apartamento: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    lgpd: [false, Validators.requiredTrue]
  });
  
  this.step2Form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { 
        // CORREÇÃO: Validador chamado sem o "this."
        validators: passwordMatchValidator 
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
  if (this.step1Form.valid && this.step2Form.valid) {
   const userData = {
    ...this.step1Form.value,
    ...this.step2Form.value,
    lgpdAccepted: true,
    lgpdAcceptedAt: new Date().toISOString()
   };
   
   this.userService.login({ nome: this.step1Form.value.nome });
   this.router.navigate(['/dashboard']);
  } else {
   this.step1Form.markAllAsTouched();
   this.step2Form.markAllAsTouched();
  }
 }
}
