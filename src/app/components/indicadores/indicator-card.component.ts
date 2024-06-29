import { AfterViewInit, Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-indicator-card',
  templateUrl: './indicator-card.component.html',
  styleUrls: ['./indicator-card.component.scss']
})
export class IndicatorCardComponent implements AfterViewInit {

  @Input() esOrdenesCompra: boolean = false;
  @Input() mostrarMisSolicitudes: boolean = false;
  @Input() mostrarSolicitudesRecibidas: boolean = false;
  @Input() misPedidos: any[] = [];
  @Input() misOrdenesCompra: any[] = [];
  @Input() misCotizaciones: any[] = [];
  @Input() codRolUsuario: number = 0;
  @Input() misPedidosRecibidos: any[] = [];
  @Input() misPedidosRealizados: any[] = [];
  @Output() kpiSeleccionado = new EventEmitter<string>();

  mostrarMisCotizaciones: boolean = false;
  mostrarMisOrdenesCompra: boolean = false;
  estadoSeleccionado: string = 'TODOS';
  mostrarPedidos: boolean = false;
  misPedidosFiltrados: any[] = [];
  filtroAbierto: boolean = false;
  mostrarMisSolicitudesJefatura: boolean = false;
  usuarioCodRol: number = 4;
  pedidosRecibidos: any[] = []; // Aquí debes tener tu lista de órdenes recibidas
  misPedidosRecibidosFiltrados: any[] = [];
  misPedidosRealizadosFiltrados: any[] = [];
  usuarioRutAutorizador?: string;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  // En algún método dentro de tu componente
ngOnInit(): void {
  console.log('mostrarMisSolicitudesJefatura:', this.mostrarMisSolicitudesJefatura);
  console.log('usuarioCodRol:', this.usuarioCodRol);
}

ngAfterViewInit(): void {
  // Inicialización inicial de los pedidos filtrados
  this.misPedidosRecibidosFiltrados = this.misPedidosRecibidos;
  this.misPedidosRealizadosFiltrados = this.misPedidosRealizados;
  this.changeDetectorRef.detectChanges();
}

onKPISeleccionadoRecibidos(kpi: string) {
  if (kpi === 'TODOS') {
    this.misPedidosRecibidosFiltrados = this.misPedidosRecibidos; // Mostrar todos los pedidos recibidos
  } else {
    this.filtrarPedidosRecibidosPorEstado(kpi); // Filtrar por el estado seleccionado
  }
}

onKPISeleccionadoRealizados(kpi: string) {
  if (kpi === 'TODOS') {
    this.misPedidosRealizadosFiltrados = this.misPedidosRealizados; // Mostrar todos los pedidos realizados
  } else {
    this.filtrarPedidosRealizadosPorEstado(kpi); // Filtrar por el estado seleccionado
  }
}

  onKPISeleccionado(kpi: string) {
    if (kpi === 'TODOS') {
      this.misPedidosFiltrados = this.misPedidos;
    } else {
      this.filtrarPedidosPorKPI(kpi);
    }
  }

  seleccionarKPI(kpi: string) {
    this.kpiSeleccionado.emit(kpi);
  }

  seleccionarKPIPedidos(estado: string): void {
    this.filtrarPedidosPorEstadoJefe(estado);
  }

  filtrarPedidosPorKPI(kpiSeleccionado: string) {
    const estadosValidos = ['PENR', 'REVJ', 'RECJ', 'APRC', 'APRO', 'PCOM', 'PEDC', 'PEDP'];
    
    if (kpiSeleccionado === 'TODOS') {
      this.misPedidosFiltrados = this.misPedidos;
    } else if (estadosValidos.includes(kpiSeleccionado)) {
      if (kpiSeleccionado === 'APRO') {
        this.misPedidosFiltrados = this.misPedidos.filter(pedido => ['APRO', 'APRC'].includes(pedido.estado_seguimiento));
      } else {
        this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.estado_seguimiento === kpiSeleccionado);
      }
    } else {
      this.misPedidosFiltrados = [];
    }

    // Actualización del estado de visualización de la tabla según los filtros
    this.mostrarPedidos = this.misPedidosFiltrados.length > 0;
  }

  

  toggleVisibilidad(seccion: string) {
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarMisCotizaciones = false;
    this.mostrarMisOrdenesCompra = false;
    this.mostrarMisSolicitudesJefatura = false;

    switch(seccion) {
      case 'mostrarMisSolicitudes':
        this.mostrarMisSolicitudes = true;
        break;
      case 'mostrarSolicitudesRecibidas':
        this.mostrarSolicitudesRecibidas = true;
        break;
      case 'mostrarMisCotizaciones':
        this.mostrarMisCotizaciones = true;
        break;
      case 'mostrarMisOrdenesCompra':
        this.mostrarMisOrdenesCompra = true;
        break;
      case 'mostrarMisSolicitudesJefatura':
        this.mostrarMisSolicitudesJefatura = true;
        break;
      default:
        break;
    }
  }

  filtrarPedidosRecibidosPorEstado(estado: string) {
    if (estado === 'TODOS') {
      this.misPedidosRecibidosFiltrados = this.misPedidosRecibidos; // Mostrar todos los pedidos recibidos
    } else {
      this.misPedidosRecibidosFiltrados = this.misPedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado);
    }
  }

  filtrarPedidosRealizadosPorEstado(estado: string) {
    if (estado === 'TODOS') {
      this.misPedidosRealizadosFiltrados = this.misPedidosRealizados; // Mostrar todos los pedidos realizados
    } else {
      this.misPedidosRealizadosFiltrados = this.misPedidosRealizados.filter(pedido => pedido.estado_seguimiento === estado);
    }
  }

  contarPedidosAprobados(): number {
    return this.misPedidos.filter(pedido => ['APRO', 'APRC'].includes(pedido.estado_seguimiento)).length;
  }

  contarPedidosEnRevision(): number {
    return this.misPedidos.filter(pedido => pedido.estado_seguimiento === 'REVJ').length;
  }

  contarOrdenesCompraPorEstado(estado: string): number {
    return this.misOrdenesCompra.filter(orden => orden.estado_seguimiento === estado).length;
  }

  contarOrdenesCompraAprobadas(): number {
    const estadosAprobados = ['APRO', 'APRC', 'APRCC', 'APROC'];
    return this.misOrdenesCompra.filter(orden => estadosAprobados.includes(orden.estado_seguimiento)).length;
  }

  contarOrdenesCompraEnRevision(): number {
    return this.misOrdenesCompra.filter(orden => orden.estado_seguimiento === 'REVGC').length;
  }

  contarOrdenesCompraAnuladas(): number {
    return this.misOrdenesCompra.filter(orden => orden.estado_seguimiento === 'ANUGC').length;
  }

  contarCotizacionesPorEstado(estado: string): number {
    return this.misCotizaciones.filter(cotizacion => cotizacion.estado_seguimiento === estado).length;
  }

  filtrarPedidosPorEstadoJefe(estado: string): void {
    console.log('Estado seleccionado:', estado);
    console.log('Todos los pedidos:', this.misPedidos);
  
    if (estado === 'TODOS') {
      this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.cod_rol === this.usuarioCodRol);
    } else {
      this.misPedidosFiltrados = this.misPedidos.filter(pedido => {
        console.log('Estado del pedido:', pedido.estado_seguimiento);
        console.log('Código de rol del usuario:', this.usuarioCodRol);
        console.log('RUT autoriza:', pedido.rut_autoriza);
        // Filtrar por estado, código de rol del usuario y autorización
        return pedido.estado_seguimiento === estado && (pedido.rut_autoriza === this.usuarioCodRol || pedido.rut_autoriza === null);
      });
    }
  
    console.log('Pedidos filtrados:', this.misPedidosFiltrados);
  }
  
  
  filtrarPedidosPorEstadoYRol(estado: string): void {
    if (estado === 'TODOS') {
      // Si el estado seleccionado es 'TODOS', mostrar todos los pedidos sin filtrar
      this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.cod_rol === this.usuarioCodRol);
    } else {
      // Filtrar los pedidos por estado y código de rol
      this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado && pedido.cod_rol === this.usuarioCodRol);
    }
  }
  
  // Método para filtrar los pedidos recibidos por el usuario con rol de solicitante (codRolUsuario !== 3)
filtrarPedidosRecibidos(): void {
  this.pedidosRecibidos = this.misPedidos.filter(pedido => pedido.cod_rol !== 4);
}

// Método para filtrar los pedidos que el usuario con rol de jefe (codRolUsuario === 4) ha realizado
filtrarPedidosJefe(): void {
  this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.cod_rol === 4);
}

  contarPedidosRecibidosPorEstado(estado: string): number {
    return this.misPedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
  }

  contarPedidosRealizadosPorEstado(estado: string): number {
    return this.misPedidosRealizados.filter(pedido => pedido.estado_seguimiento === estado).length;
  }

  
  contarPedidosPorEstadoJefe(estado: string): number {
    return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado && pedido.cod_rol === 4).length;
  }
  
  contarPedidosEnRevisionJefe(): number {
    return this.misPedidos.filter(pedido => pedido.estado_seguimiento === 'REVJ' && pedido.cod_rol === this.usuarioCodRol).length;
  }
  
  contarPedidosAprobadosJefe(): number {
    return this.misPedidos.filter(pedido => ['APRO', 'APRC'].includes(pedido.estado_seguimiento) && pedido.cod_rol === this.usuarioCodRol).length;
  }
  contarPedidosPorEstadoYRol(estado: string): number {
    return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado && pedido.cod_rol === this.usuarioCodRol).length;
  }
  
  contarPedidosPorEstado(estado: string): number {
    return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
  }
  
  cargarPedidos(): any[] {
    // Carga de pedidos simulada, deberías cargar los pedidos desde tu servicio o fuente de datos
    return [
      { estado_seguimiento: 'PENR', cod_rol: 4 },
      { estado_seguimiento: 'APRC', cod_rol: 4 },
      { estado_seguimiento: 'RECJ', cod_rol: 3 },
      { estado_seguimiento: 'REVJ', cod_rol: 4 },
      { estado_seguimiento: 'APRO', cod_rol: 4 }
    ];
  }


}
