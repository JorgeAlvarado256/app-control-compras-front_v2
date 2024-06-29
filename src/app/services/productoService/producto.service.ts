import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = environment.apiUrl;
  private productos = "/obtenerProductos";
  //'http://localhost:3000/api/v1/obtenerProductos'; //
  private obtenerProductos = '/obtenerProductos';
  private obtenerProductoPorId = '/obtenerProductoPorId';

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.productos);
  }
  listarProducto(codigoCategoria: string): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+this.productos, codigoCategoria);
  }
  listarProductoPorId(id_producto: number): Observable<any> {
    const idProductoParam = { id_producto };
    return this.http.get(this.apiUrl+this.obtenerProductoPorId+'/'+idProductoParam);
  }
  getProductosPorCategoria():Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.obtenerProductos);
  }
}
