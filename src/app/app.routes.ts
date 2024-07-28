import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ListOfFinancialProductsComponent } from './pages/list-of-financial-products/list-of-financial-products.component';
import { RegistrationFormComponent } from './pages/registration-form/registration-form.component';
import { Page404Component } from './pages/page-404/page-404.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'listado-de-productos-financieros',
        component: ListOfFinancialProductsComponent,
      },
      {
        path: 'formulario-de-registro',
        component: RegistrationFormComponent,
        data: {state: 'new'}
      },
      {
        path: 'editar-producto',
        component: RegistrationFormComponent,
        data: {state: 'edit'}
      },
      {
        path: '',
        redirectTo: 'listado-de-productos-financieros',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'pagina-no-encontrada',
    component: Page404Component,
  },
  {
    path: '**',
    redirectTo: 'pagina-no-encontrada',
    pathMatch: 'full'
  },
];
