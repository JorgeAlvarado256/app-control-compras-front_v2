import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';

import { ProductoComponent } from './components/productoComponent/producto.component';
import { LoginComponent } from './components/loginComponent/login.component';
import { SolicitanteComponent } from './components/solicitanteComponent/solicitante.component';
import { AuthService } from './services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmpresaComponent } from './components/empresa/empresa.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { PantallaCargaComponent } from './components/pantallaCarga/pantallaCarga.component';
import { JefaturaComponent } from './components/jefaturaComponent/jefatura.component';
import { AdquisidorComponent } from './components/adquisidor/adquisidor.component';
import { IndicatorCardComponent } from './components/indicadores/indicator-card.component';
import { GerenciaComponent } from './components/gerencia/gerencia.component';
import { AppRoutingModule } from './app-routing.module';
import { CotizacionService } from './services/cotizacionService/cotizacion.service';


defineLocale('es', esLocale); // Importa el idioma español para las fechas

@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    LoginComponent,
    SolicitanteComponent,
    EmpresaComponent,
    PantallaCargaComponent,
    JefaturaComponent,
    AdquisidorComponent,
    IndicatorCardComponent,
    GerenciaComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    MatIconModule,
    BsDatepickerModule.forRoot(),
    MatTooltipModule,
    TooltipModule
  ],
  providers: [DatePipe, AuthService, CotizacionService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class AppModule { }
