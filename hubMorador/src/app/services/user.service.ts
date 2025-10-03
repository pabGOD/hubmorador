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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSource = new BehaviorSubject<User | null>({ nome: 'Morador' });
  currentUser$ = this.currentUserSource.asObservable();

  private notificationsSource = new BehaviorSubject<Notification[]>([
    { title: 'Novo Aviso', message: 'Manutenção da piscina na próxima segunda-feira.', time: 'há 2 horas', read: false },
    { title: 'Lembrete', message: 'Reunião de condóminos amanhã.', time: 'há 1 dia', read: true }
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
  
  // --- NOVA FUNÇÃO PARA MARCAR NOTIFICAÇÕES COMO LIDAS ---
  markAllAsRead() {
    const currentNotifications = this.notificationsSource.getValue();
    const readNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSource.next(readNotifications);
  }
}

