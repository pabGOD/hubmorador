import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  nome: string;
}

export interface Notification {
  title: string;
  message: string;
  time: string;
  read: boolean;
  route?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService { // A classe começa aqui...
  private currentUserSource = new BehaviorSubject<User | null>({ nome: 'Morador' });
  currentUser$ = this.currentUserSource.asObservable();

  private notificationsSource = new BehaviorSubject<Notification[]>([
    {
      title: 'Reserva Confirmada!',
      message: 'Seu agendamento para o Salão de Festas foi confirmado.',
      time: 'há 5 minutos',
      read: false,
      route: '/meus-agendamentos'
    },
    {
      title: 'Novo Aviso',
      message: 'Manutenção da piscina na próxima segunda-feira.',
      time: 'há 2 horas',
      read: false,
      route: '/avisos'
    },
    {
      title: 'Lembrete',
      message: 'Reunião de condóminos amanhã.',
      time: 'há 1 dia',
      read: true,
      route: '/avisos'
    }
  ]);
  notifications$ = this.notificationsSource.asObservable();

  constructor() { }

  login(userData: User) {
    this.currentUserSource.next(userData);
  }

  addNotification(notification: Omit<Notification, 'time' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      time: 'agora',
      read: false
    };
    const currentNotifications = this.notificationsSource.getValue();
    this.notificationsSource.next([newNotification, ...currentNotifications]);
  }

  getUnreadNotificationsCount(): number {
    return this.notificationsSource.getValue().filter(n => !n.read).length;
  }

  markAllAsRead() {
    const currentNotifications = this.notificationsSource.getValue();
    const readNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSource.next(readNotifications);
  }

  markAsRead(notificationIndex: number) {
    const currentNotifications = this.notificationsSource.getValue();
    const updatedNotifications = currentNotifications.map((notification: Notification, index: number) => {
      if (index === notificationIndex) {
        return { ...notification, read: true };
      }
      return notification;
    });
    this.notificationsSource.next(updatedNotifications);
  }

} // <-- ESTA CHAVE FINAL ESTAVA FALTANDO!