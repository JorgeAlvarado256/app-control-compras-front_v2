export interface Usuario {
  id_usuario: number;
  rut_empresa: string;
  rut_usuario: string;
  contraseña: string;
  nombre_usuario: string;
  cod_rol: number;
  id_departamento: number;
  email_usuario?: string | null;
}
