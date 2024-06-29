import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = environment.apiUrl;
  private categoriasLogin = "/obtenerEmpresa";

  constructor(private http: HttpClient) {}

  getEmpresa(rut_empresa: string): Observable<any> {
    const rutEmpresaParam = { rut_empresa };
    return this.http.post<any[]>(this.apiUrl+this.categoriasLogin, rutEmpresaParam);
  }
}
