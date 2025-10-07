import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
// A interface 'Notification' já vem do serviço, então está tudo certo
import { UserService, User, Notification } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;

  userInfo: User | null = null;
  notifications: Notification[] = [];
  unreadNotificationsCount = 0;
  showNotifications = false;
  private subscriptions = new Subscription();
  carouselImages = [
    { src: 'https://images.pexels.com/photos/7234313/pexels-photo-7234313.jpeg', alt: 'Sala de cinema moderna', title: 'Sala de cinema', subtitle: 'Espaços pensados para o seu bem-estar.' },
    { src: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', alt: 'Piscina do condomínio', title: 'Área da Piscina', subtitle: 'Grande inauguração da nova hidromassagem!' },
    { src: 'https://images.pexels.com/photos/34120676/pexels-photo-34120676.jpeg', alt: 'Quadra de futebol', title: 'Quadra de Futebol', subtitle: 'Quadra novinha em folha! A reforma está concluída. Venha se divertir!' }
  ];
  
  locaisPopulares = [
    { nome: 'Piscina', descricao: 'Relaxe e aproveite o sol', imagem: 'https://images.pexels.com/photos/1147124/pexels-photo-1147124.jpeg', rota: '/piscina' },
    { nome: 'Salão de Jogos', descricao: 'Diversão para todas as idades', imagem: 'https://images.pexels.com/photos/16074/pexels-photo.jpg', rota: '/salao-de-jogos' },
    { nome: 'Quadra de Futebol', descricao: 'Mantenha-se em forma', imagem: 'https://images.pexels.com/photos/9765649/pexels-photo-9765649.jpeg', rota: '/agendamentos' },
    { nome: 'Salão de Festas', descricao: 'Perfeito para encontros', imagem: 'https://images.pexels.com/photos/8153964/pexels-photo-8153964.jpeg', rota: '/agendamentos' }
  ];

  proximosAgendamentos = [ { local: 'Salão de Festas', data: 'Amanhã, 19:00 - 23:00' } ];
  avisos = [ { titulo: 'Manutenção da Piscina', data: '10/10' }, { titulo: 'Festa de São João', data: '23/06' } ];

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

  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  toggleNotifications() { 
    this.showNotifications = !this.showNotifications;
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications')) {
      this.showNotifications = false;
    }
  }

  handleNotificationClick(notification: Notification, index: number, event: Event) {
    event.stopPropagation();
    
    if (!notification.read) {
      // Esta função será corrigida no próximo passo (ver explicação abaixo)
      this.markNotificationAsRead(index);
    }

    this.navigateBasedOnNotification(notification);
    
    this.showNotifications = false;
  }

  private markNotificationAsRead(index: number) {
    const updatedNotifications = [...this.notifications];
    if (!updatedNotifications[index].read) {
      updatedNotifications[index] = { ...updatedNotifications[index], read: true };
    }
  }

  // --- ALTERAÇÃO PRINCIPAL: LÓGICA DE NAVEGAÇÃO SIMPLIFICADA ---
  private navigateBasedOnNotification(notification: Notification) {
    // Se a notificação tiver uma rota definida, navegue para ela.
    if (notification.route) {
      this.router.navigate([notification.route]);
    } else {
      // Se não tiver, vai para uma rota padrão.
      // Isso garante que o app não quebre com notificações antigas.
      console.warn('Notificação sem rota definida. Usando rota padrão.');
      this.router.navigate(['/meus-agendamentos']);
    }
  }

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.userService.markAllAsRead();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.scrollToSlide('next');
    }, 5000);
  }

  scrollToSlide(direction: 'prev' | 'next') {
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