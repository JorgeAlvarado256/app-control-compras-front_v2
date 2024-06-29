import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnularPedidoService {

  private apiUrl = environment.apiUrl;
  private anularOrdenPedido = '/anularOrdenPedido'
  constructor(private http: HttpClient) { }

  anularPedido(id_orden_pedido_cabecera: number):Observable<any> {
    const pedidoDetalleData = { id_orden_pedido_cabecera };
    return this.http.post(this.apiUrl+this.anularOrdenPedido, pedidoDetalleData);
  }
}
