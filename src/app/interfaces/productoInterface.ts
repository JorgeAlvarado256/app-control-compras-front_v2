import { ProductosPorCategoria } from "./productosPorCategoriaInterface";

export interface Producto {
    id_producto: number;
    rut_empresa: number;
    id_categoria_productos_fk: number;
    nombre_producto: string;
    cantidad: number;
    categoria:string;
    nombre_categoria:string;
  }
  