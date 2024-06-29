import {OrdenCompraDetalle} from "./ordenCompraDetalle";

export interface OrdenCompraCabecera {
    id_orden_compra_cabecera?: number;
    rut_empresa: string;
    rut_proveedor: string;
    rut_usuario: string;
    fecha_emision: Date;
    estado_seguimiento: string;
    neto: number;
    iva: number;
    total_compra: number;
    rut_autoriza?: string;
    nombre_autoriza?: string;
    hora_fecha_autoriza?: Date;
    observaciones_adquisiciones?: string;
    observaciones_gerencia?: string;
    ordenCompraDetalle?: OrdenCompraDetalle[]
  }