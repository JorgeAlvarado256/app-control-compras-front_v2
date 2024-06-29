import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { SolicitanteComponent } from 'src/app/components/solicitanteComponent/solicitante.component'; // Asegúrate de tener la ruta correcta
//import { JefaturaService } from 'src/app/services/jefaturaService/jefatura.service'; // Asegúrate de tener un servicio específico para Jefatura
import { DatePipe } from '@angular/common';
import { PedidoCabecera } from 'src/app/interfaces/pedidoCabeceraInterface';
import { PedidoDetalle } from 'src/app/interfaces/pedidoDetalleInterface';
import {AnularPedidoService} from 'src/app/services/anularPedidoService/anularPedido.service';
import {AuthService} from 'src/app/services/auth.service';
import {EditarPedidoService} from 'src/app/services/editarPedidoService/editarPedido.service';
import {EmpresaService} from 'src/app/services/empresaService/empresa.service';
import {EstadoPedidoService} from 'src/app/services/estadoPedidoService/estadoPedido.service';
import {PedidoCabeceraService} from 'src/app/services/pedidoCabeceraService/pedidoCabecera.service';
import {PedidoDetalleService} from 'src/app/services/pedidoDetalleService/pedidoDetalle.service';
import {ProductoService} from 'src/app/services/productoService/producto.service';
import {SolicitanteService} from 'src/app/services/solicitanteService/solicitante.service';

@Component({
  selector: 'app-jefatura',
  templateUrl: './jefatura.component.html',
  styleUrls: ['./jefatura.component.scss']
})
export class JefaturaComponent extends SolicitanteComponent implements OnInit {
  // Variables para manejar la visibilidad de los botones
  public mostrarBotonRevisar: boolean = true;
  public mostrarBotonCancelar: boolean = true;
  public mostrarBotonAprobar: boolean = true;
  public mostrarBotonRechazar: boolean = true;
  observacion = "";

  // Variable para manejar el estado actual del pedido
  public estadoPedidoActual: string = '';
  tarjetaRevisar: number = -2;
  override mostrarMisSolicitudes: boolean = false;
  solicitudesRecibidas: any; // Asegúrate de tener esta propiedad definida
  override misPedidos: any[] = []; // Asegúrate de tener esta propiedad definida
  override codRolUsuario: number = 4; // Asegúrate de tener esta propiedad definida
  override mostrarSolicitudesRecibidas: boolean = false;
  pedido: any;

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
    //jefaturaService: JefaturaService // Asegúrate de agregar el servicio específico de Jefatura
  ) {
    // Llama al constructor de la clase padre (SolicitanteComponent) con los servicios necesarios
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
      datePipe
    );
  }
  override ngOnInit(): void {
    super.ngOnInit(); // Llama al ngOnInit de la clase padre (SolicitanteComponent)
    this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol); 
    this.mostrarBotonRevisar = true;
  }
  botonesInicio(pedido: PedidoCabecera): boolean{
    if(this.tarjetaRevisar === -2)
    {
      // this.tarjetaRevisar = -1;
      return true;
    }
  else return this.tarjetaRevisar === pedido.id_orden_pedido_cabecera;
  }
  // Método para manejar el clic en el botón "Revisar"
  public revisarPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;

      this.tarjetaRevisar = pedido.id_orden_pedido_cabecera
      this.estadoPedidoActual = 'En Revisión';
      pedido.estado_seguimiento = "REVJ";
      this.opcionSecundaria = pedido.estado_seguimiento;
      //función para actualizar estado_seguimiento
      this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
      // this.opcionSecundaria = '';
    // }
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
  // Método para manejar el clic en el botón "Cancelar"
  public cancelarRevisionPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;
    this.estadoPedidoActual = '';
    pedido.estado_seguimiento = "PENR";
    this.opcionSecundaria = pedido.estado_seguimiento;
    this.tarjetaRevisar = -1;
    //función para actualizar estado_seguimiento
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }

  // Método para manejar el clic en el botón "Aprobar"
  public aprobarPedido(event: Event, pedido: any) {
    this.mostrarCarga = true;
    // Lógica para aprobar el pedido y actualizar el estado del pedido
    this.estadoPedidoActual = 'Aprobado';
    const detallesModificados = pedido.detalles.filter((detalle: any, index: any) => {
      const detalleInicial = this.detallesIniciales[index];
      const cantidadDiferencia = detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
      const nombreProducto = detalle.producto.nombre_producto;

      if (cantidadDiferencia) {
        // La cantidad ha cambiado, guarda la diferencia en un string
        this.observacion = this.observacion + '\n'+ `${nombreProducto}: ${detalleInicial.cantidad_solicitada} -> ${detalle.cantidad_solicitada}`;
      }
      return detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
    });
    console.log('Texto Observaciones: '+this.observacion);
    pedido.observaciones_jefe_area = ((pedido.observaciones_jefe_area ?? '') + this.observacion).trim();
    
    if (pedido.observaciones_jefe_area === null || pedido.observaciones_jefe_area === undefined || pedido.observaciones_jefe_area.trim() === '')
    {
      pedido.estado_seguimiento = "APRC";
      this.opcionSecundaria = pedido.estado_seguimiento;
      console.log('estado_seguimiento: ' + pedido.estado_seguimiento)
    }
    else{
      pedido.estado_seguimiento = "APRO";
      this.opcionSecundaria = pedido.estado_seguimiento;
      console.log('estado_seguimiento: ' + pedido.estado_seguimiento)
    }
    const pedidoCabecera = {
      id_orden_pedido_cabecera: pedido.id_orden_pedido_cabecera,
      observaciones_jefe_area: pedido.observaciones_jefe_area,
      estado_seguimiento: pedido.estado_seguimiento,
      rut_autoriza: this.usuario.rut_usuario,
      nombre_autoriza: this.usuario.nombre_usuario,
      hora_fecha_autoriza: new Date()
    }
    this.observacion = "";
    //función para actualizar estado_seguimiento
    this.pedidoDetalleService.actualizarPedidoJefatura(detallesModificados, pedidoCabecera).subscribe({
      next:(data)=>
      {
        console.log('detallesModificados:' + detallesModificados);
        console.log('pedidoCabecera:' + pedidoCabecera);
        console.log('data:' + data);
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error:(error)=>
      {
        console.log('error:' + error);
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
    });
    event.stopPropagation();
  }

  // Método para manejar el clic en el botón "Rechazar"
  public rechazarPedido(event: Event, pedido: PedidoCabecera) {
    this.mostrarCarga = true;
    // Lógica para rechazar el pedido y actualizar el estado del pedido
    this.estadoPedidoActual = 'Rechazado';
    pedido.estado_seguimiento = "RECJ";
    this.opcionSecundaria = pedido.estado_seguimiento;
    //función para actualizar estado_seguimiento
    this.actualizarEstadoPedido(pedido.id_orden_pedido_cabecera, pedido.estado_seguimiento);
    event.stopPropagation();
  }
  actualizarEstadoPedido(id_orden_pedido_cabecera: number, estado_seguimiento: string){
    this.estadoPedidoService.actualizarEstadoPedido(id_orden_pedido_cabecera, estado_seguimiento).subscribe({
      next:(data)=>
      {
        console.log("Estado Seguimiento actualizado:"+ data);
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
      error:(error)=>
      {
        console.log("Error al actualizar Estado Seguimiento:"+ error);
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.mostrarCarga = false;
      },
    });
  }

  filtrarPedidosPorRol() {
    const rutUsuarioLogueado = this.authService.setToken; // Obtiene el rut del usuario logueado desde el servicio de autenticación
    this.misPedidosFiltrados = this.misPedidos.filter(pedido => pedido.rut_usuario === rutUsuarioLogueado);
  }
  

}