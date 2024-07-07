import { DetalleCotizacion } from "./detalleCotizacionInterface";

export interface Cotizacion {
  id_cotizacion: number;
  fecha_emision: Date;
  estado_seguimiento: string;
  detalles: DetalleCotizacion[];
  rut_empresa: string;
  expanded?: boolean;
  noDetalles?: boolean;
}
