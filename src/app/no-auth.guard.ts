import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './components/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class noAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getAuthToken();
    if (token) {

      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
