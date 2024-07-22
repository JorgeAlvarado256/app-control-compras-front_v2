import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para obtener los KPIs de un solicitante
  getKPIsSolicitante(rutUsuario: string): Observable<any> {
    const url = `${this.apiUrl}/kpi/solicitante/${rutUsuario}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getKPIsSolicitante'))
      );
  }

  // Método para obtener los KPIs de un encargado
  getKPIsEncargado(rutUsuario: string): Observable<any> {
    const url = `${this.apiUrl}/kpi/encargado/${rutUsuario}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getKPIsEncargado'))
      );
  }

  // Método para obtener los KPIs de un jefe
  getKPIsJefatura(rutUsuario: string): Observable<any> {
    const url = `${this.apiUrl}/kpi/jefatura/${rutUsuario}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>('getKPIsJefatura'))
      );
  }

  // Método de manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      if (error instanceof HttpErrorResponse) {
        console.error(`HTTP Error: ${error.status} ${error.statusText}`);
      }
      return of(result as T);
    };
  }
}

