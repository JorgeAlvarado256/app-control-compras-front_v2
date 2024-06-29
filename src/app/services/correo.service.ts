import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cotizacion } from '../interfaces/cotizacionInterface';
import { Proveedor } from '../interfaces/proveedorInterface';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  agregarProveedorCotizacion(idCotizacion: number, idProveedor: number): Observable<any> {
    const url = `${this.apiUrl}/agregarProveedorCotizacion/${idCotizacion}/${idProveedor}`;
    return this.http.post<any>(url, {});
  }
}

