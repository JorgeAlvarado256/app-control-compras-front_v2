import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Proveedor } from 'src/app/interfaces/proveedorInterface';
import { Cotizacion } from 'src/app/interfaces/cotizacionInterface';
import { DetalleCotizacion } from 'src/app/interfaces/detalleCotizacionInterface';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  agregarCotizacion(cotizacion: Cotizacion): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviarSolicitudCotizacion`, cotizacion)
      .pipe(catchError(this.handleError));
  }

  obtenerCotizaciones(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/obtenerCotizaciones`)
      .pipe(catchError(this.handleError));
  }

  obtenerDetallesCotizacion(): Observable<DetalleCotizacion[]> {
    return this.http.get<DetalleCotizacion[]>(`${this.apiUrl}/detalles`)
      .pipe(catchError(this.handleError));
  }

  obtenerPedidos(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/obtenerPedidos`)
      .pipe(catchError(this.handleError));
  }

  obtenerPedidosCotizados(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/obtenerPedidosCotizados`)
      .pipe(catchError(this.handleError));
  }

  obtenerSolicitudes(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/obtenerSolicitudes`)
      .pipe(catchError(this.handleError));
  }

  agregarProveedorCotizacion(idCotizacion: number, idProveedor: number, rutUsuario: string, estadoSeguimiento: string, solicitud: any): Observable<any> {
    const token = this.authService.getToken(); // Obtener el token desde tu servicio de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.apiUrl}/agregarProveedorCotizacion/${idCotizacion}/${idProveedor}/${rutUsuario}`;
    const body = { estadoSeguimiento, solicitud };

    return this.http.put(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  actualizarEstadoDetalleCotizaciones(idCotizacion: number, idProveedor: number): Observable<any> {
    const token = this.authService.getToken(); // Obtener el token desde tu servicio de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/cotizaciones/${idCotizacion}/proveedores/${idProveedor}`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  guardarSolicitudCotizacion(solicitud: any): Observable<any> {
    const url = `${this.apiUrl}/guardar-solicitud-cotizacion`;
    return this.http.post(url, solicitud)
      .pipe(catchError(this.handleError));
  }

  actualizarPedido(idCotizacion: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idCotizacion}/pedido`, {})
      .pipe(catchError(this.handleError));
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedores`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
