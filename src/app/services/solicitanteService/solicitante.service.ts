import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitanteService {

  private apiUrl = environment.apiUrl;
  private categoriasLogin = "/obtenerCategoriasProductosPorEmpresa";
  private obtenerDepartamento = "/obtenerDepartamento"
  

  constructor(private http: HttpClient) {}

  getCategorias(rut_empresa: string): Observable<any[]> {
    const rutEmpresaParam = { rut_empresa };
    return this.http.post<any[]>(this.apiUrl+this.categoriasLogin, rutEmpresaParam);
  }
  getDepartamento(id_departamento: number): Observable<any>{
    const idDepartamentoParam = { id_departamento };
    return this.http.post<any>(this.apiUrl+this.obtenerDepartamento, idDepartamentoParam);
  }
}
