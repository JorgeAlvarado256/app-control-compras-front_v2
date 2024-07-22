import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

  private getHeaders(): Observable<HttpHeaders> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!token) {
          return throwError('Token de autenticación no disponible');
        }
        return of(new HttpHeaders().set('Authorization', `Bearer ${token}`));
      })
    );
  }

  private getToken(): Observable<string | null> {
    const token = this.authService.getToken();
    return of(token);
  }

  agregarCotizacion(cotizacion: Cotizacion): Observable<any> {
    const url = `${this.apiUrl}/enviarSolicitudCotizacion`;
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post<any>(url, cotizacion, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  obtenerPedidosNoRegistrados(): Observable<any[]> {
    const endpoint = `${this.apiUrl}/cotizaciones-no-registrado`;
    return this.http.get<any[]>(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  obtenerCotizaciones(nivelDetalle: 'completo' | 'conDetalles' | 'pedidosCotizados'): Observable<Cotizacion[]> {
    const url = `${this.apiUrl}/informacionCotizaciones/${nivelDetalle}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cotizacion[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerDetallesCotizacion(): Observable<DetalleCotizacion[]> {
    return this.http.get<DetalleCotizacion[]>(`${this.apiUrl}/detalles`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerPedidos(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/obtenerPedidos`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerPedidosCotizados(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/obtenerPedidosCotizados`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerSolicitudes(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/obtenerSolicitudes`).pipe(
      catchError(this.handleError)
    );
  }

  agregarProveedorCotizacion(idCotizacion: number, idProveedor: number, rutUsuario: string, estadoSeguimiento: string, solicitud: any): Observable<any> {
    const url = `${this.apiUrl}/agregarProveedorCotizacion/${idCotizacion}/${idProveedor}/${rutUsuario}`;
    const body = { estadoSeguimiento, solicitud };
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.put(url, body, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  actualizarEstadoDetalleCotizaciones(idCotizacion: number, idProveedor: number): Observable<any> {
    const url = `${this.apiUrl}/cotizaciones/${idCotizacion}/proveedores/${idProveedor}`;
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.put(url, {}, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  guardarSolicitudCotizacion(solicitud: any): Observable<any> {
    const url = `${this.apiUrl}/guardar-solicitud-cotizacion`;
    return this.http.post(url, solicitud).pipe(
      catchError(this.handleError)
    );
  }

  actualizarPedido(idCotizacion: number): Observable<any> {
    const url = `${this.apiUrl}/${idCotizacion}/pedido`;
    return this.http.put(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    const url = `${this.apiUrl}/proveedores`;
    return this.http.get<Proveedor[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  enviarSolicitudCotizacion(solicitud: any): Observable<any> {
    const url = `${this.apiUrl}/solicitudCotizacion`;
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post(url, solicitud, { headers }).pipe(
          catchError(this.handleError)
        )
      )
    );
  }

  async descargarCotizacion(detalle: any): Promise<void> {
    try {
      const response: any = await this.http.get(`/descargar-adjuntos/${detalle.rut_usuario}`).toPromise();
      if (response && response.archivo_pdf) {
        window.open(response.archivo_pdf, '_blank');
      } else {
        console.error('Error al descargar el archivo PDF');
      }
    } catch (error) {
      console.error('Error al descargar el archivo PDF:', error);
    }
  }
}
