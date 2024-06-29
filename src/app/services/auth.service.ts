import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/usuarioInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private rutaLogin = "/login";
  private rutaObtenerUsuario = "/usuarioAutenticado";
  isLoggedIn = false;
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient) {}

  login(rut_usuario: string, contraseña: string): Observable<any> {
    const loginData = { rut_usuario, contraseña };
    return this.http.post<any>(`${this.apiUrl}${this.rutaLogin}`, loginData).pipe(
      tap(response => {
        // Verificar si se recibe el token en la respuesta
        if (response.token) {
          // Almacenar el token en el almacenamiento local
          localStorage.setItem('token', response.token);
          localStorage.setItem('rut_usuario', response.rut_usuario);

          // Marcar al usuario como autenticado
          this.isLogIn();
        }
      }),
      catchError(this.handleError)
    );
  }


  isLogIn() {
    this.isLoggedIn = true;
  }

  isLogOut() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }

  isAuthenticate() {
    return this.isLoggedIn;
  }

  getCurrentUsuario(): Observable<Usuario> {
    const rut_usuario = localStorage.getItem('rut_usuario');
    if (!rut_usuario) {
      throw new Error('El rut_usuario no está definido en el almacenamiento local');
    }
    return this.http.get<Usuario>(`${this.apiUrl}${this.rutaObtenerUsuario}/${rut_usuario}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error en la autenticación.';
    console.error(errorMessage, error);
    return throwError(errorMessage);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  
}

