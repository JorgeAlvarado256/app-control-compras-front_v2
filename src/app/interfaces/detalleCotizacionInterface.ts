import { Producto } from "./productoInterface";

export interface DetalleCotizacion {
  id_detalle_cotizacion: null;
  id_cotizacion_fk: null;
  id_producto: number;
  nombre_producto: string;
  cantidad_solicitada: number;
  cantidad_comprada: number;
  cantidad_recepcionada: number;
  estado_seguimiento_producto: string
  id_orden_pedido_cabecera_fk: number;
  orden_compra_detalle_fk: number;
  id_proveedores: number;
  producto?: Producto; // Si la propiedad producto es opcional, puedes usar '?'
  archivo_pdf?: string;
}