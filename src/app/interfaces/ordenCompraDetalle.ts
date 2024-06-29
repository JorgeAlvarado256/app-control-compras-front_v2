export interface OrdenCompraDetalle {
    id_orden_compra_detalle?: number;
    rut_empresa: string;
    id_orden_compra_cabecera_fk: number;
    id_producto: number;
    cantidad_comprada?: number;
    precio_unitario: number;
    precio_total_item: number;
    cantidad_recepcionada?: number;
    id_orden_pedido_detalle?: number
  }