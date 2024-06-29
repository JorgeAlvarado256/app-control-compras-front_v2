import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  rutUsuario: string = '';
  password: string = '';
  errorMessage: string = '';
  moduloRol: string = '';
  usuario!: Usuario;
  isLoggedIn: boolean = false;
  mostrarCarga: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    //this.iniciarSesion();
  }

  iniciarSesion() {
    this.mostrarCarga = true;
    this.authService.login(this.rutUsuario, this.password).subscribe({
      next: (data) => {
        // Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso');
        this.authService.setToken(data.token); // Guarda el token recibido
        this.usuario = data as Usuario;
        this.moduloRol = getModuloRol(this.usuario.cod_rol);
        this.authService.isLogIn();
        this.mostrarCarga = false;
        this.router.navigate([this.moduloRol], { state: { usuario: data } });
      },
      error: (error) => {
        // Error durante el inicio de sesión
        console.error('Error al iniciar sesión', error);
        if (error.status === 401) {
          // Error de autenticación: credenciales inválidas
          this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu RUT y contraseña.';
        } else {
          // Otro tipo de error
          this.errorMessage = 'Ha ocurrido un error al iniciar sesión. Por favor, intenta nuevamente más tarde.';
        }
        this.mostrarCarga = false;
      }
    });
  }
  
  getIsLoggedIn() {
    return !!this.usuario;
  }  
}

function getModuloRol(cod_rol: number): string {
  switch (cod_rol) {
    case 1:
      // Código para el rol ADMINISTRADOR
      return '/administrador';
    case 2:
      // Código para el rol OPERADOR
      return '/operador';
    case 3:
      // Código para el rol SOLICITANTE
      return '/solicitante';
    case 4:
      // Código para el rol JEFATURA
      return '/jefatura';
    case 5:
      // Código para el rol ADQUISIDOR
      return '/adquisidor';
    case 6:
      // Código para el rol GERENCIA
      return '/gerencia';
    default:
      // Código para cualquier otro valor de cod_rol
      return '/rolNoReconocido';
  }
}
