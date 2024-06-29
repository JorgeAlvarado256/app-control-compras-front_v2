import { PedidoDetalle } from "./pedidoDetalleInterface";

export interface PedidoCabecera {
    id_orden_pedido_cabecera: number;
    rut_empresa: string;
    rut_usuario: string;
    fecha_emision: Date;
    estado_seguimiento: string;
    rut_autoriza: string | null;
    hora_fecha_autoriza: Date | null;
    observaciones_solicitante: string | null;
    observaciones_jefe_area: string | null;
    pedidoDetalle: PedidoDetalle[] | null;
  }