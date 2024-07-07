import { DetalleCotizacion } from './detalleCotizacionInterface'; // Ajustar la ruta según tu estructura de proyecto

export interface SolicitudCotizacion {
  id_cotizacion: number | null;
  rut_empresa: string;
  detalles: DetalleCotizacion[];
  fecha_emision: Date;
  estado_seguimiento: string;
}
