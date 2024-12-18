import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';

const routes: Routes = [
  { path: 'auth',
    loadChildren: () => import('./components/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  { path: 'administration',
    loadChildren: () => import('./components/administration/administration.module').then(m => m.AdministrationModule)
  },
  { path:'invoices',
    loadChildren:()=>import('./components/invoices/invoices.module').then(m => m.InvoicesModule)
  },
  { path: 'dashboard', component: ContentLayoutComponent },
  { path: '**', redirectTo: 'auth' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
