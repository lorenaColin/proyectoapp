import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private timeoutId: any;
  private idleTime: number = 1 * 60 * 1000; // minutos de inactividad
  private isWarningShown: boolean = false;

  private inactivitySubject = new Subject<void>();
  inactivity$ = this.inactivitySubject.asObservable();

  constructor() {
    this.startWatching();
  }

  startWatching() {
    console.log("startWatching");
    this.resetTimer();
    window.addEventListener('click', this.resetTimer.bind(this));
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
    window.addEventListener('scroll', this.resetTimer.bind(this));
  }

  stopWatching() {
    console.log("stopWatching");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    window.removeEventListener('click', this.resetTimer.bind(this));
    window.removeEventListener('mousemove', this.resetTimer.bind(this));
    window.removeEventListener('keypress', this.resetTimer.bind(this));
    window.removeEventListener('scroll', this.resetTimer.bind(this));
  }

  resetTimer() {
    console.log("resetTimer");
    clearTimeout(this.timeoutId);

    if (this.isWarningShown) {
      this.isWarningShown = false;
    }

    this.timeoutId = setTimeout(() => {
      this.handleInactivity();
    }, this.idleTime);
  }

  private handleInactivity() {
    console.log("handleInactivity");
    const token = localStorage.getItem('token');
    if (!token) {
      this.stopWatching();
      return;
    }
    this.isWarningShown = true;
    Swal.fire({
      title: 'Inactividad detectada',
      text: 'Tu sesión ha caducado por inactividad.',
      icon: 'warning',
      timer: 1500,
    }).then(() => {
      this.inactivitySubject.next();
    });
  }
}
