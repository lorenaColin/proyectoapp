import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { AuthGuardService } from './components/services/auth-guard.service';
import { noAuthGuard } from './no-auth.guard';

const routes: Routes = [
  { path: 'inicio',
    loadChildren: () => import('./components/inicio/inicio.module').then(m => m.InicioModule),
    canActivate: [noAuthGuard]
  },
  {
    path: 'lealtad',
    loadChildren: () => import('./components/lealtad/lealtad.module').then(m =>m.LealtadModule),
  },
  {
    path: 'herramienta',
    loadChildren: () => import('./components/herramientas/herramientas.module').then(m =>m.HerramientasModule),
  },
  { path: 'auth',
    loadChildren: () => import('./components/authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate: [noAuthGuard]
  },
  { path: 'administration',
    loadChildren: () => import('./components/administration/administration.module').then(m => m.AdministrationModule),
  },
  { path:'invoices',
    loadChildren:()=>import('./components/invoices/invoices.module').then(m => m.InvoicesModule),
  },
  {
    path: 'customers',
    loadChildren:() => import('./components/customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'products',
    loadChildren:() => import('./components/products/products.module').then(m => m.ProductsModule), canActivate: [AuthGuardService],
  },
  {
    path: 'series',
    loadChildren: () => import('./components/series/series.module').then(m => m.SeriesModule),
  },
  {
    path: 'cartaPorte',
    loadChildren: () => import('./components/invoices/cartaPorte/cartaporte.module').then(m =>m.cartaporte),
  },
  {
    path: 'emitidos',
    loadChildren: () => import('./components/emitidos/emitidos.module').then(m =>m.EmitidosModule),
  },
  { path: 'dashboard', component: ContentLayoutComponent },
  { path: '**', redirectTo: 'auth' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
