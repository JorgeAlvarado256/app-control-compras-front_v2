import { DetalleCotizacion } from "./detalleCotizacionInterface";

export interface Cotizacion {
  id_cotizacion: number;
  fecha_emision: Date;
  estado_seguimiento: string;
  detalles: DetalleCotizacion[];
  rut_empresa: string;
  expanded?: boolean; // Añadir esta línea si es necesario
  noDetalles?: boolean; 
}
