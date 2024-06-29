import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditarPedidoService {
  private apiUrl = environment.apiUrl;
  private actualizarPedidoDetalleSolicitante = '/actualizarPedidoDetalleSolicitante'
  constructor(private http: HttpClient) { }

  actualizarPedido(pedidoDetalle: any[]):Observable<any> {
    const pedidoDetalleData = { pedidoDetalle };
    return this.http.post(this.apiUrl+this.actualizarPedidoDetalleSolicitante, pedidoDetalleData);
  }
}
