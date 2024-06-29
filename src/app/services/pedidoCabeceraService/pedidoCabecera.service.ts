import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {PedidoCabecera} from 'src/app/interfaces/pedidoCabeceraInterface';

@Injectable({
  providedIn: 'root'
})
export class PedidoCabeceraService {

  private apiUrl = environment.apiUrl;
  private productos = "/obtenerProductos";
  //'http://localhost:3000/api/v1/obtenerProductos'; 
  private crearOrdenPedidoCabecera = '/crearOrdenPedidoCabecera';

  constructor(private http: HttpClient) {}

  generarPedidoCabecera(pedidoCabecera: PedidoCabecera): Observable<any> {
    return this.http.post<any[]>(this.apiUrl+this.crearOrdenPedidoCabecera, pedidoCabecera);
  }
  listarProducto(codigoCategoria: string): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+this.productos, codigoCategoria);
  }
  listarPedidoCabecera():Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.productos);
  }

  getPedidosByRutAutoriza(rutAutoriza: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orden_pedido_cabecera?rut_autoriza=${rutAutoriza}`);
  }
}
