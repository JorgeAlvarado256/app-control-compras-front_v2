import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.guard';
import { SolicitanteComponent } from './components/solicitanteComponent/solicitante.component';
import { LoginComponent } from './components/loginComponent/login.component';
import { ProductoComponent } from './components/productoComponent/producto.component';
import {JefaturaComponent} from './components/jefaturaComponent/jefatura.component';
import {Sub_jefaturaComponent} from './components/sub_jefaturaComponent/Sub_jefatura.component';
import { AdquisidorComponent} from './components/adquisidor/adquisidor.component';
import {GerenciaComponent} from './components/gerencia/gerencia.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // Ruta por defecto
  { path: 'solicitante',component: SolicitanteComponent ,
    children: [
      { path: '', component: ProductoComponent },
      { path: 'productos', component: ProductoComponent },
   
    ] ,
    canActivate: [AuthGuard] 
  }, // Ruta para solicitantes
  //ruta para adquisidor
  { path: 'adquisidor', component: AdquisidorComponent, 
    canActivate: [AuthGuard]  
  }, // Ruta para operador
  { path: 'sub_jefatura', component: Sub_jefaturaComponent, 
    canActivate: [AuthGuard] 
  }, // Ruta para jefatura
  { path: 'jefatura', component: JefaturaComponent, 
    canActivate: [AuthGuard] 
  }, // Ruta para jefatura
  // Ruta para gerencia
  { path: 'gerencia', component: GerenciaComponent,
    canActivate: [AuthGuard]  
  }, 
  // { path: 'administrador', component: AdministradorComponent }, // Ruta para administrador
  //{ path: '**', redirectTo: '/login', pathMatch: 'full' }, // Redirección en caso de ruta no válida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//Exportamos las rutas
//export const routingComponents = [LoginComponent, SolicitanteComponent, ProductoComponent]