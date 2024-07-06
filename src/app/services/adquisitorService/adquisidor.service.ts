import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {OrdenCompraCabecera} from 'src/app/interfaces/ordenCompraCabecera';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdquisidorService {
  private apiUrl = environment.apiUrl;
  private rutaObtenerPedidosAprobados = '/obtenerPedidosAprobados'
  private actualizarEstado = '/actualizarEstadoPedido';
  private obtenerProveedoresPorRutEmpresa='/obtenerProveedoresPorRutEmpresa';
  private rutaGenerarOrdenCompra = '/guardarOrdenCompra';
  private rutaObtenerOrdenesDeCompraAdquisidor = '/obtenerOrdenesDeCompraAdquisidor';
  private rutaObtenerOrdenesDeCompraGerencia = '/obtenerOrdenesDeCompraGerencia';
  private rutaActualizarCompraDetalleAdquisidor = '/actualizarCompraDetalleAdquisidor';
  private rutaAnularOrdenCabecera = '/anularOrdenCabecera';
  private rutaConfirmarCompraAdquisidor = '/confirmarCompraAdquisidor';
  
  constructor(private http: HttpClient) { }
  
  obtenerPedidosAprobados(rut_empresa: string):Observable<any> {
    const param = {rut_empresa};
    return this.http.post<any[]>(this.apiUrl+this.rutaObtenerPedidosAprobados, param);
  }
  getOrdenesDeCompra(rut_usuario: string):Observable<any> {
    const param = {rut_usuario};
    return this.http.post<any[]>(this.apiUrl+this.rutaObtenerOrdenesDeCompraAdquisidor, param);
  }
  guardarOrdenDeCompra(ordenesDeCompra: any):Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.rutaObtenerPedidosAprobados);
  }
  obtenerProveedor(rut_empresa: string):Observable<any[]> {
    const param = {rut_empresa};
    return this.http.post<any[]>(this.apiUrl+this.obtenerProveedoresPorRutEmpresa, param);
  }
  generarOrdenCompra(ordenCompra: OrdenCompraCabecera): Observable<any[]> {
    // const param = {ordenCompra};
    return this.http.post<any[]>(this.apiUrl+this.rutaGenerarOrdenCompra, ordenCompra);
  }
  obtenerOrdenesDeCompraGerencia(rut_usuario: string):Observable<any> {
    const param = {rut_usuario};
    return this.http.post<any[]>(this.apiUrl+this.rutaObtenerOrdenesDeCompraGerencia, param);
  }
  actualizarCompra(compraDetalle: any[]):Observable<any> {
    const params = { compraDetalle };
    return this.http.post(this.apiUrl+this.rutaActualizarCompraDetalleAdquisidor, params);
  }
  anularCompra(id_orden_compra_cabecera: number):Observable<any> {
    const compraCabeceraData = { id_orden_compra_cabecera };
    return this.http.post(this.apiUrl+this.rutaAnularOrdenCabecera, compraCabeceraData);
  }
  confirmarRecepcionCompra(compraDetalle: any[]):Observable<any> {
    const params = { compraDetalle };
    return this.http.post(this.apiUrl+this.rutaConfirmarCompraAdquisidor, params);
  }


}
