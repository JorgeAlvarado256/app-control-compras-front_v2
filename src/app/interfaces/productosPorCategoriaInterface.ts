import { Producto } from "./productoInterface";

export interface ProductosPorCategoria {
    [id: number]: Producto[]; 
  }