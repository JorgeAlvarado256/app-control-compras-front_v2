import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { SolicitanteComponent } from 'src/app/components/solicitanteComponent/solicitante.component';
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
import { JefaturaComponent } from '../jefaturaComponent/jefatura.component';


@Component({
  selector: 'app-sub-jefatura',
  templateUrl: './jefatura.component.html',
  styleUrls: ['./jefatura.component.scss']
})
export class Sub_jefaturaComponent extends SolicitanteComponent implements OnInit {
  public mostrarBotonRevisar: boolean = true;
  public mostrarBotonCancelar: boolean = true;
  public mostrarBotonAprobar: boolean = true;
  public mostrarBotonRechazar: boolean = true;
  observacion = "";
  public estadoPedidoActual: string = '';
  tarjetaRevisar: number = -2;
  override mostrarMisSolicitudes: boolean = false;
  solicitudesRecibidas: any;
  override misPedidos: any[] = [];
  override codRolUsuario: number = 4;
  pedido: any;
  PedidosRecibidos: any[] = [];
  misPedidosRealizadosFiltrados: any[] = []; // Ajusta el tipo de 'any[]' según tus datos
  PedidosRecibidosFiltrados: any[] = []; // Ajusta el tipo de 'any[]' según tus datos
  override mostrarResumen: boolean = false;
  override pestanaActiva: string = '';
  override mostrarSolicitudesRecibidas: boolean = false;
  override mostrarIndicatorCard: boolean = true;
  detallesVisibles: boolean = false; 
  
  @ViewChild(IndicatorCardComponent) override indicatorCardComponent!: IndicatorCardComponent;

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
    JefaturaComponent:JefaturaComponent
    
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
      datePipe    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
    this.mostrarBotonRevisar = true;
  }

  override ngAfterViewInit() {
    if (this.indicatorCardComponent) {
      this.indicatorCardComponent.kpiSeleccionado.subscribe((kpi: string) => {
        this.filtrarPedidosPorKPI(kpi);
        this.filtrarPedidosJefe(kpi);
      });
    } else {
      console.error('IndicatorCardComponent no está definido.');
    }
  }

  override navMisPedidosSolicitantes(): void {
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarCategoriasProductos = false; // Mostrar las categorías de productos

  }

  navPedidosRecibidos(): void {
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarCategoriasProductos = false; // Mostrar las categorías de productos

  }



  botonesInicio(pedido: PedidoCabecera): boolean {
    if (this.tarjetaRevisar === -2) {
      return true;
    } else {
      return this.tarjetaRevisar === pedido.id_orden_pedido_cabecera;
    }
  }

  public revisarPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;
    this.tarjetaRevisar = pedido.id_orden_pedido_cabecera;
    this.estadoPedidoActual = 'En Revisión';
    pedido.estado_seguimiento = "REVJ";
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  habilitarEdicionJefatura(estadoSeguimiento: string, detalles: any) {
    if (estadoSeguimiento !== 'REVJ') {
      return;
    }
    if (estadoSeguimiento === 'REVJ') {
      this.editandoDetalle = true;
    }
    this.eliminarHabilitado = true;
  }

  public cancelarRevisionPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;
    this.estadoPedidoActual = '';
    pedido.estado_seguimiento = "PENR";
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.tarjetaRevisar = -1;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  public aprobarPedido(event: Event, pedido: any) {
    this.mostrarCarga = true;
    this.estadoPedidoActual = 'Aprobado';
    const detallesModificados = pedido.detalles.filter((detalle: any, index: any) => {
      const detalleInicial = this.detallesIniciales[index];
      const cantidadDiferencia = detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
      const nombreProducto = detalle.producto.nombre_producto;

      if (cantidadDiferencia) {
        this.observacion = this.observacion + '\n' + `${nombreProducto}: ${detalleInicial.cantidad_solicitada} -> ${detalle.cantidad_solicitada}`;
      }
      return detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
    });
    pedido.observaciones_jefe_area = ((pedido.observaciones_jefe_area ?? '') + this.observacion).trim();
    
    if (pedido.observaciones_jefe_area.trim() === '') {
      pedido.estado_seguimiento = "APRC";
      this.opcionSecundaria = pedido.estado_seguimiento;
    } else {
      pedido.estado_seguimiento = "APRO";
      this.opcionSecundaria = pedido.estado_seguimiento;
    }
    const pedidoCabecera = {
      id_orden_pedido_cabecera: pedido.id_orden_pedido_cabecera,
      observaciones_jefe_area: pedido.observaciones_jefe_area,
      estado_seguimiento: pedido.estado_seguimiento,
      rut_autoriza: this.usuario.rut_usuario,
      nombre_autoriza: this.usuario.nombre_usuario,
      hora_fecha_autoriza: new Date()
    };
    this.observacion = "";
    this.pedidoDetalleService.actualizarPedidoJefatura(detallesModificados, pedidoCabecera).subscribe({
      next: (data) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error: (error) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
    });
    event.stopPropagation();
  }

  public rechazarPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;
    this.estadoPedidoActual = 'Rechazado';
    pedido.estado_seguimiento = "RECJ";
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  actualizarEstadoPedido(id_orden_pedido_cabecera: number, estado_seguimiento: string) {
    this.estadoPedidoService.actualizarEstadoPedido(id_orden_pedido_cabecera, estado_seguimiento).subscribe({
      next: (data) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error: (error) => {
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
    });
  }

  filtrarPedidosPorRol() {
    const rutUsuarioLogueado = this.authService.setToken;
    this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.rut_usuario === rutUsuarioLogueado);
  }

  mostrarMisSolicitudesClick(): void {
    this.mostrarMisSolicitudes = !this.mostrarMisSolicitudes;
    this.mostrarSolicitudesRecibidas = false;
}

mostrarSolicitudesRecibidasClick(): void {
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
}
  override toggleDetallePedido(pedido: any) { // Ajusta el tipo de 'pedido' según tu estructura
  if (this.pedidoSeleccionado && this.pedidoSeleccionado.id_orden_pedido_cabecera === pedido.id_orden_pedido_cabecera) {
    this.pedidoSeleccionado = null; // Deseleccionar si ya está seleccionado
  } else {
    this.pedidoSeleccionado = pedido; // Seleccionar el nuevo pedido
  }
}


}
