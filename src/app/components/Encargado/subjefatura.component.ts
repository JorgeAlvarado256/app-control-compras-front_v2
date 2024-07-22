import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { PedidoCabecera } from 'src/app/interfaces/pedidoCabeceraInterface';
import { AnularPedidoService } from 'src/app/services/anularPedidoService/anularPedido.service';
import { AuthService } from 'src/app/services/auth.service';
import { EditarPedidoService } from 'src/app/services/editarPedidoService/editarPedido.service';
import { EmpresaService } from 'src/app/services/empresaService/empresa.service';
import { EstadoPedidoService } from 'src/app/services/estadoPedidoService/estadoPedido.service';
import { PedidoCabeceraService } from 'src/app/services/pedidoCabeceraService/pedidoCabecera.service';
import { PedidoDetalleService } from 'src/app/services/pedidoDetalleService/pedidoDetalle.service';
import { ProductoService } from 'src/app/services/productoService/producto.service';
import { SolicitanteService } from 'src/app/services/solicitanteService/solicitante.service';
import { IndicatorCardComponent } from '../indicadores/indicator-card.component';
import { IndicadoresService } from 'src/app/services/indicadores/indicadores.service';
import { JefaturaComponent } from '../jefaturaComponent/jefatura.component';

@Component({
  selector: 'app-subjefatura',
  templateUrl: './subjefatura.component.html',
  styleUrls: ['./subjefatura.component.scss']
})
export class SubjefaturaComponent extends JefaturaComponent implements OnInit {
  totalPedidosPendientes: number = 0;
  totalPedidosAprobados: number = 0;
  totalPedidosRechazados: number = 0;
  totalPedidosEnRevision: number = 0;
  totalPedidosRecibidosPendientes: number = 0;
  totalPedidosRecibidosAprobados: number = 0;
  totalPedidosRecibidosRechazados: number = 0;
  totalPedidosRecibidosEnRevision: number = 0;
  totalMisPedidosPendientes: number = 0;
  totalMisPedidosAprobados: number = 0;
  totalMisPedidosRechazados: number = 0;
  totalMisPedidosEnRevision: number = 0;
  filtroFecha: Date | null = null;
  filtroEstado: string = '';
  kpiSeleccionado: string | null = null;
  isDropdownOpen: boolean = false;  // Estado del menú desplegable

  public override mostrarBotonRevisar = true;
  public override mostrarBotonCancelar = true;
  public override mostrarBotonAprobar = true;
  public override mostrarBotonRechazar = true;
  override observacion = '';
  public override estadoPedidoActual = '';
  override tarjetaRevisar = -2;
  override mostrarMisSolicitudes = false;
  override solicitudesRecibidas: any;
  override misPedidos: any[] = [];
  override codRolUsuario = 4;
  override pedido: any;
  override PedidosRecibidos: any[] = [];
  override misPedidosRealizadosFiltrados: any[] = [];
  override PedidosRecibidosFiltrados: any[] = [];
  override mostrarResumen = false;
  override pestanaActiva = '';
  override mostrarSolicitudesRecibidas = false;
  override mostrarIndicatorCard = true;
  override detallesVisibles = false;
  override usuario!: Usuario;
  rutUsuario!: string;
  rutJefatura!: string;
  @ViewChild(IndicatorCardComponent) override indicatorCardComponent!: IndicatorCardComponent;
  indicadores: any;
  estadoNombre: { [key: string]: string } = {
    'PEDP': 'Pedido comprado incompleto',
    'PEDC': 'Pedido comprado',
    'PCOM': 'Pedido en orden de compra',
    'APRO': 'Pedido aprobado con Observaciones por encargado',
    'APRC': 'Pedido aprobado con Completitud por encargado',
    'RECJ': 'Pedido rechazado por encargado',
    'REVJ': 'Pedido en revisión por encargado',
    'PENR': 'Pedido pendiente de revisión por encargado',
    'PENRC': 'Pedido pendiente de encargado para revision de encargado'
  };
  override mostrarTablaPedidos: boolean = false;
  override misPedidosFiltrados: any[] = [];

  constructor(
    empresaService: EmpresaService,
    productoService: ProductoService,
    solicitanteService: SolicitanteService,
    authService: AuthService,
    estadoPedidoService: EstadoPedidoService,
    pedidoDetalleService: PedidoDetalleService,
    editarPedidoService: EditarPedidoService,
    anularPedidoService: AnularPedidoService,
    router: Router,
    route: ActivatedRoute,
    datePipe: DatePipe,
    private indicadoresService: IndicadoresService
  ) {
    super(
      empresaService,
      productoService,
      solicitanteService,
      authService,
      estadoPedidoService,
      pedidoDetalleService,
      editarPedidoService,
      anularPedidoService,
      router,
      route,
      datePipe
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.rutUsuario = this.usuario.rut_usuario;
    this.listarMisPedidos(this.rutUsuario, this.codRolUsuario);
    this.obtenerIndicadores();
    this.obtenerSolicitudes();
    this.actualizarKPIsMisPedidos();
    this.actualizarKPIs();
    
  }

  actualizarKPIs(): void {
    if (!this.misPedidosFiltrados) {
      console.warn('No hay pedidos filtrados para actualizar KPIs');
      return;
    }
    this.totalPedidosPendientes = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'PENR').length;
    this.totalPedidosAprobados = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'APRC' || pedido.estado_seguimiento === 'APRO').length;
    this.totalPedidosRechazados = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'RECJ').length;
    this.totalPedidosEnRevision = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'REVJ').length;
  }
  
  actualizarKPIsMisPedidos(): void {
    if (!this.misPedidosFiltrados) {
      console.warn('No hay pedidos filtrados para actualizar KPIs de mis pedidos');
      return;
    }
    this.totalMisPedidosPendientes = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'PENR').length;
    this.totalMisPedidosAprobados = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'APRC' || pedido.estado_seguimiento === 'APRO').length;
    this.totalMisPedidosRechazados = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'RECJ').length;
    this.totalMisPedidosEnRevision = this.misPedidosFiltrados.filter(pedido => pedido.estado_seguimiento === 'REVJ').length;
  }
  
  obtenerNombreEstado(codigoEstado: string): string {
    return this.estadoNombre[codigoEstado] || 'Desconocido';
  }

  override ngAfterViewInit(): void {
    if (this.indicatorCardComponent) {
      this.indicatorCardComponent.kpiSeleccionado.subscribe((kpi: string) => {
        this.filtrarPedidosPorKPI(kpi);
        this.filtrarPedidosJefe(kpi);
      });
    } else {
      console.error('IndicatorCardComponent no está definido.');
    }
  }

toggleDropdown(): void {
  if (this.pestanaActiva === 'crearPedido') {
    // Si estamos en la vista de "Crear Pedido", el menú no debería abrirse
    this.isDropdownOpen = false;
  } else {
    // Alternar el estado del menú desplegable
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}


verKPIs(kpi: string): void {
  this.kpiSeleccionado = kpi;
  console.log('kpiSeleccionado:', this.kpiSeleccionado);

  if (kpi === 'misPedidos') {
    this.mostrarTablaPedidos = true;
    console.log('Mostrando tabla de pedidos');
    this.filtrarPedidosPorRol();
  } else {
    this.mostrarTablaPedidos = false;
  }
}

  override navMisPedidosSolicitantes(): void {
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarCategoriasProductos = false;
  }

  obtenerIndicadores(): void {
    this.indicadoresService.getKPIsEncargado(this.rutUsuario).subscribe(
      (response: any) => {
        this.indicadores = response;
        this.totalMisPedidosPendientes = response.totalMisPedidosPendientes || 0;
        this.totalMisPedidosAprobados = response.totalMisPedidosAprobados || 0;
        this.totalMisPedidosRechazados = response.totalMisPedidosRechazados || 0;
        this.totalMisPedidosEnRevision = response.totalMisPedidosEnRevision || 0;
        this.totalPedidosRecibidosPendientes = response.totalPedidosRecibidosPendientes || 0;
        this.totalPedidosRecibidosAprobados = response.totalPedidosRecibidosAprobados || 0;
        this.totalPedidosRecibidosRechazados = response.totalPedidosRecibidosRechazados || 0;
        this.totalPedidosRecibidosEnRevision = response.totalPedidosRecibidosEnRevision || 0;
      },
      (error: any) => {
        console.error('Error al obtener los indicadores:', error);
      }
    );
  }

  obtenerSolicitudes(): void {
    if (this.codRolUsuario === 3 && this.rutUsuario) {
      this.obtenerSolicitudesSolicitante(this.rutUsuario);
    }
  }

  obtenerSolicitudesSolicitante(rutUsuario: string): void {
    this.indicadoresService.getKPIsSolicitante(this.rutUsuario).subscribe(
      (response: { solicitudes: any[]; }) => {
        this.misPedidosFiltrados = response.solicitudes;
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes del solicitante:', error);
      }
    );
  }

  override filtrarPedidosPorKPI(kpi: string): void {
    console.log('Filtrando pedidos por KPI:', kpi);
    // Ejemplo de implementación de filtrado por KPI
    if (kpi === 'misPedidos') {
      this.misPedidosFiltrados = this.misPedidos; // Asumiendo que 'misPedidos' tiene todos los pedidos
    } else {
      // Añadir más lógica si tienes otros KPIs
      this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.kpi === kpi);
    }
    this.actualizarKPIs();
  }
  
  override filtrarPedidosPorRol(): void {
    const rolUsuario = this.codRolUsuario;  // Cambia esto si el rol no es el que necesitas
    this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.usuario?.codigo_rol === rolUsuario);
    console.log('Pedidos filtrados:', this.misPedidosFiltrados);
    this.actualizarKPIs();
  }
  

  override navPedidosRecibidos(): void {
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = true;
    this.mostrarCategoriasProductos = false;
    this.listarSolicitudesRecibidas();
  }

  listarSolicitudesRecibidas(): void {
    this.solicitanteService.obtenerSolicitudesRecibidas().subscribe({
      next: (solicitudes) => {
        this.PedidosRecibidos = solicitudes;
        this.PedidosRecibidosFiltrados = solicitudes;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes recibidas:', error);
      }
    });
  }

  override navCrearPedido(): void {
    if (this.pestanaActiva === 'crearPedido') {
      // Si ya está activo, lo cerramos
      this.mostrarTablaPedidos = false;
      this.pedidoSeleccionado = null;
      this.mostrarCategoriasProductos = false;
      this.mostrarPedidos = false;
      this.mostrarResumen = false;
      this.mostrarIndicatorCard = false;
      this.pestanaActiva = ''; // Cerramos la vista de "Crear Pedido"
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarPedidosJefatura = false;
      this.mostrarMisSolicitudes = false;
  
      // Cerrar el menú desplegable si está abierto
      this.isDropdownOpen = false;
    } else {
      // Si no está activo, lo abrimos
      this.mostrarTablaPedidos = false;
      this.pedidoSeleccionado = null;
      this.mostrarCategoriasProductos = true;
      this.mostrarPedidos = false;
      this.mostrarResumen = false;
      this.mostrarIndicatorCard = false;
      this.pestanaActiva = 'crearPedido'; // Activamos la vista de "Crear Pedido"
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarPedidosJefatura = false;
      this.mostrarMisSolicitudes = false;
  
      // Cerrar el menú desplegable si está abierto
      this.isDropdownOpen = false;
    }
  }
  
  
  

  override botonesInicio(pedido: PedidoCabecera): boolean {
    return this.tarjetaRevisar === -2 || this.tarjetaRevisar === pedido.id_orden_pedido_cabecera;
  }

  public override revisarPedido(event: Event, pedido: PedidoCabecera): void {
    this.mostrarCarga = true;
    this.tarjetaRevisar = pedido.id_orden_pedido_cabecera;
    this.estadoPedidoActual = 'En Revisión';
    pedido.estado_seguimiento = 'REVJ';
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  override habilitarEdicionJefatura(estadoSeguimiento: string, detalles: any): void {
    this.editandoDetalle = estadoSeguimiento === 'REVJ';
    this.eliminarHabilitado = this.editandoDetalle;
  }

  public override cancelarRevisionPedido(event: Event, pedido: PedidoCabecera): void {
    this.mostrarCarga = true;
    this.estadoPedidoActual = '';
    pedido.estado_seguimiento = 'PENR';
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.tarjetaRevisar = -1;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  public override aprobarPedido(event: Event, pedido: any): void {
    this.mostrarCarga = true;
    this.estadoPedidoActual = 'Aprobado';
    
    const detallesModificados = pedido.detalles.filter((detalle: any, index: number) => {
      const detalleInicial = this.detallesIniciales[index];
      const cantidadDiferencia = detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
      const nombreProducto = detalle.producto.nombre_producto;

      if (cantidadDiferencia) {
        this.observacion += `\n${nombreProducto}: ${detalleInicial.cantidad_solicitada} -> ${detalle.cantidad_solicitada}`;
      }
      return cantidadDiferencia;
    });
    
    pedido.observaciones_jefe_area = ((pedido.observaciones_jefe_area ?? '') + this.observacion).trim();
    pedido.estado_seguimiento = pedido.observaciones_jefe_area.trim() === '' ? 'APRC' : 'APRO';
    this.opcionSecundaria = pedido.estado_seguimiento;
    
    const pedidoCabecera = {
      id_orden_pedido_cabecera: pedido.id_orden_pedido_cabecera,
      observaciones_jefe_area: pedido.observaciones_jefe_area,
      estado_seguimiento: pedido.estado_seguimiento,
      rut_autoriza: this.usuario.rut_usuario,
      nombre_autoriza: this.usuario.nombre_usuario,
      hora_fecha_autoriza: new Date()
    };
    
    this.observacion = '';
    this.pedidoDetalleService.actualizarPedidoJefatura(detallesModificados, pedidoCabecera).subscribe({
      next: () => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error: (error) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
        console.error('Error al aprobar el pedido:', error);
      }
    });
    event.stopPropagation();
  }

  public override rechazarPedido(event: Event, pedido: PedidoCabecera): void {
    this.mostrarCarga = true;
    this.estadoPedidoActual = 'Rechazado';
    pedido.estado_seguimiento = 'RECJ';
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  override actualizarEstadoPedido(id_orden_pedido_cabecera: number, estado_seguimiento: string): void {
    this.estadoPedidoService.actualizarEstadoPedido(id_orden_pedido_cabecera, estado_seguimiento).subscribe({
      next: () => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error: (error) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
        console.error('Error al actualizar el estado del pedido:', error);
      }
    });
  }


  override mostrarMisSolicitudesClick(): void {
    this.mostrarMisSolicitudes = !this.mostrarMisSolicitudes;
  }

  override mostrarSolicitudesRecibidasClick(): void {
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
  }
}

