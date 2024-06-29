import {Producto} from "./productoInterface";

export interface PedidoDetalle {
    id_orden_pedido_detalle: number;
    id_producto: number;
    cantidad_solicitada: number;
    cantidad_comprada: number | null;
    cantidad_recepcionada: number | null;
    estado_seguimiento_producto: string | null;
    id_orden_pedido_cabecera_fk: number | null;
    producto?: Producto;
    mostrarDetalles?: boolean;
  }