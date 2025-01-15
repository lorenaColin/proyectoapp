import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { AuthGuardService } from './components/services/auth-guard.service';

const routes: Routes = [
  { path: 'auth',
    loadChildren: () => import('./components/authentication/authentication.module').then(m => m.AuthenticationModule),
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
  { path: 'dashboard', component: ContentLayoutComponent },
  { path: '**', redirectTo: 'auth' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
