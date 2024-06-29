import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoPedidoService {
  private apiUrl = environment.apiUrl;
  private estadoPedido = '/obtenerEstadoPedido'
  private actualizarEstado = '/actualizarEstadoPedido';
  private rutaActualizarEstadoCompra = '/actualizarEstadoCompra';
  private rutaaprobarCompra = '/aprobarCompra';

  constructor(private http: HttpClient) { }

  obtenerEstadoPedido():Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.estadoPedido);
  }
  actualizarEstadoPedido(id_orden_pedido_cabecera: number, estado_seguimiento: string){
    const params = { estado_seguimiento, id_orden_pedido_cabecera };
    return this.http.post(this.apiUrl+this.actualizarEstado, params);
  }
  actualizarEstadoCompra(id_orden_compra_cabecera: number, estado_seguimiento: string){
    const params = { estado_seguimiento, id_orden_compra_cabecera };
    return this.http.post(this.apiUrl+this.rutaActualizarEstadoCompra, params);
  }
  aprobarCompra(datosParams: any){
    return this.http.post(this.apiUrl+this.rutaaprobarCompra, datosParams);
  }
}
