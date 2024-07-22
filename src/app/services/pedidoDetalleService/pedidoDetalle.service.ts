import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PedidoCabecera } from 'src/app/interfaces/pedidoCabeceraInterface';

@Injectable({
  providedIn: 'root'
})
export class PedidoDetalleService {

  private apiUrl = environment.apiUrl;
  private productos = "/obtenerProductos";
  //'http://localhost:3000/api/v1/obtenerProductos'; 
  private crearOrdenDetalle = '/crearOrdenDetalle';
  private obtenerPedidosUsuario = '/obtenerPedidosUsuario';
  private obtenerPedidosJefatura = '/obtenerPedidosJefatura';
  private actualizarPedidoDetalleJefatura = '/actualizarPedidoDetalleJefatura';

  constructor(private http: HttpClient) {}

  generarPedidoDetalle(pedidoCabecera: PedidoCabecera): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+this.crearOrdenDetalle, pedidoCabecera);
  }
  // obtenerPedidosDetalle(rut_usuario: string): Observable<any> {
  //   return this.http.get(this.apiUrl + this.obtenerPedidosUsuario, { params: { rut_usuario } });
  // }
  obtenerPedidosDetalle(rut_usuario: string): Observable<any> {
    const rutUsuarioParam = { rut_usuario };
    return this.http.post<any>(`${this.apiUrl}${this.obtenerPedidosUsuario}`, rutUsuarioParam);
  }

  obtenerPedidosDetalleJefatura(rut_empresa: string, id_departamento: number): Observable<any> {
    const params = { rut_empresa, id_departamento };
    return this.http.post<any>(`${this.apiUrl}${this.obtenerPedidosJefatura}`, params);
  }
  actualizarPedidoJefatura(pedidoDetalle: any, pedidoCabecera: any){
    const params = { pedidoDetalle, pedidoCabecera };
    return this.http.post(this.apiUrl+this.actualizarPedidoDetalleJefatura, params);
  }
  
}
