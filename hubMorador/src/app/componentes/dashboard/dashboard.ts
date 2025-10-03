import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { UserService, User, Notification } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
// 1. Adicionamos a interface 'AfterViewInit'
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;

  // ... (propriedades existentes) ...
  userInfo: User | null = null;
  notifications: Notification[] = [];
  unreadNotificationsCount = 0;
  showNotifications = false;
  private subscriptions = new Subscription();
  carouselImages = [
    { src: 'https://images.pexels.com/photos/7234313/pexels-photo-7234313.jpeg', alt: 'Sala de cinema moderna', title: 'Sala de cinema', subtitle: 'Espaços pensados para o seu bem-estar.' },
    { src: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', alt: 'Piscina do condomínio', title: 'Área da Piscina', subtitle: 'Grande inauguração da nova hidromassagem!' },
    { src: 'https://images.pexels.com/photos/34120676/pexels-photo-34120676.jpeg', alt: 'Quarto de apartamento', title: 'Quadra de Futebol', subtitle: 'Quadra novinha em folha! A reforma está concluída. Venha se divertir!' }
  ];
  proximosAgendamentos = [ { local: 'Salão de Festas', data: 'Amanhã, 19:00 - 23:00' } ];
  avisos = [ { titulo: 'Manutenção da Piscina', data: '10/10' }, { titulo: 'Festa de São João', data: '23/06' } ];


  // 2. Variável para guardar o nosso temporizador
  private autoSlideInterval: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.currentUser$.subscribe(user => this.userInfo = user)
    );
    this.subscriptions.add(
      this.userService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.unreadNotificationsCount = this.userService.getUnreadNotificationsCount();
      })
    );
  }

  // 3. ngAfterViewInit é executado depois de o HTML estar pronto. É o sítio perfeito para iniciar o nosso temporizador.
  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // 4. É MUITO IMPORTANTE limpar o temporizador quando saímos da página para evitar problemas de memória.
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  toggleNotifications() { 
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadNotificationsCount > 0) {
      setTimeout(() => {
        this.userService.markAllAsRead();
      }, 1500);
    }
  }

  // 5. Função que inicia o temporizador para passar os slides
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.scrollToSlide('next');
    }, 5000); // Passa para o próximo slide a cada 5 segundos (5000 ms)
  }

  scrollToSlide(direction: 'prev' | 'next') {
    // ... (função scrollToSlide continua igual) ...
    const element = this.carouselWrapper.nativeElement;
    const slideWidth = element.clientWidth;
    const currentScroll = element.scrollLeft;
    const maxScroll = element.scrollWidth - slideWidth;

    if (direction === 'next') {
      if (currentScroll >= maxScroll - 1) { element.scrollTo({ left: 0, behavior: 'smooth' }); } 
      else { element.scrollBy({ left: slideWidth, behavior: 'smooth' }); }
    } else {
      if (currentScroll === 0) { element.scrollTo({ left: maxScroll, behavior: 'smooth' }); } 
      else { element.scrollBy({ left: -slideWidth, behavior: 'smooth' }); }
    }
  }
}

