import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'any'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getAuthToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.authService.logout();
         Swal.fire('Tu sesión ha caducado', 'Inicia sesión nuevamente.', "warning").then(() => {
          this.router.navigate(['auth/login']);
        });
        return true;
      } else {
        this.authService.logout();
        this.router.navigate(['auth/login']);
        return false;
      }
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
