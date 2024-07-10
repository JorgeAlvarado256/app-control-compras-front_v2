import { ChangeDetectorRef, Component } from '@angular/core';
import {AdquisidorComponent} from '../adquisidor/adquisidor.component';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {AdquisidorService} from 'src/app/services/adquisitorService/adquisidor.service';
import {AuthService} from 'src/app/services/auth.service';
import {EmpresaService} from 'src/app/services/empresaService/empresa.service';
import {EstadoPedidoService} from 'src/app/services/estadoPedidoService/estadoPedido.service';
import {SolicitanteService} from 'src/app/services/solicitanteService/solicitante.service';
import { CotizacionService } from 'src/app/services/cotizacionService/cotizacion.service';

@Component({
  selector: 'app-gerencia',
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.scss']
})
export class GerenciaComponent extends AdquisidorComponent{
  tarjetaRevisar: number = -2;
  constructor(
    empresaService: EmpresaService, 
    adquisidorService: AdquisidorService,
     authService: AuthService, 
     solicitanteService: SolicitanteService, 
     estadoPedidoService: EstadoPedidoService, 
     router: Router, datePipe: DatePipe,
     cotizacionService: CotizacionService,
      cdr: ChangeDetectorRef

  ){
    super(
      empresaService, 
      adquisidorService, 
      authService, 
      solicitanteService, 
      estadoPedidoService, 
      router,
      datePipe,
      cotizacionService,
      cdr
    )
  }
  override ngOnInit(): void {
    super.ngOnInit(); // Llama al ngOnInit de la clase padre (SolicitanteComponent)
    this.listarOrdenesDeCompraGerencia();
    this.mostrarCarga=true;
  }
  listarOrdenesDeCompraGerencia() {
    this.mostrarCarga=true;
    this.adquisidorService.obtenerOrdenesDeCompraGerencia(this.usuario.rut_usuario).subscribe({
      next: (data)=>{
        this.ordenesDeCompra = data.pedidos;
        this.ordenDeCompraInicial = data.pedidos;
        this.mostrarCarga=false;
      },
      error: (error)=>{
        console.log("Error: " + error);
        this.mostrarCarga=false;
      }
    });
  }
  revisarCompra(event: Event, ordenCompra: any) {
    ordenCompra.estado_seguimiento = "REVGC";
    this.actualizarEstadoCompra(ordenCompra.id_orden_compra_cabecera, ordenCompra.estado_seguimiento);
    event.stopPropagation();
  }
  anularOrdenCompra(event: Event, ordenCompra: any) {
    const datosParams = {
      id_orden_compra_cabecera: ordenCompra.id_orden_compra_cabecera,
      rut_autoriza: this.usuario.rut_usuario,
      nombre_autoriza: this.usuario.nombre_usuario,
      hora_fecha_autoriza: new Date(),
      estado_seguimiento: "ANUGC",
      observaciones_gerencia: ordenCompra.observaciones_gerencia
    }
    this.aprobarCompra(datosParams);
    event.stopPropagation();
  }
  cancelarRevision(event: Event, ordenCompra: any) {
    ordenCompra.estado_seguimiento = "PENRC";
    this.actualizarEstadoCompra(ordenCompra.id_orden_compra_cabecera, ordenCompra.estado_seguimiento);
    event.stopPropagation();
  }
  btnAprobarCompra(event: Event, ordenCompra: any) {
    if(ordenCompra.observaciones_gerencia===null || ordenCompra.observaciones_gerencia===''||ordenCompra.observaciones_gerencia===undefined){
      const datosParams = {
        id_orden_compra_cabecera: ordenCompra.id_orden_compra_cabecera,
        rut_autoriza: this.usuario.rut_usuario,
        nombre_autoriza: this.usuario.nombre_usuario,
        hora_fecha_autoriza: new Date(),
        estado_seguimiento: "APRCC",
        observaciones_gerencia: ordenCompra.observaciones_gerencia
      }
      this.aprobarCompra(datosParams);
    }
    else{
      const datosParams = {
        id_orden_compra_cabecera: ordenCompra.id_orden_compra_cabecera,
        rut_autoriza: this.usuario.rut_usuario,
        nombre_autoriza: this.usuario.nombre_usuario,
        hora_fecha_autoriza: new Date(),
        estado_seguimiento: "APROC",
        observaciones_gerencia: ordenCompra.observaciones_gerencia
      }
      this.aprobarCompra(datosParams);
    }
    event.stopPropagation();
  }
  btnRechazarCompra(event: Event, ordenCompra: any) {
    const datosParams = {
      id_orden_compra_cabecera: ordenCompra.id_orden_compra_cabecera,
      rut_autoriza: this.usuario.rut_usuario,
      nombre_autoriza: this.usuario.nombre_usuario,
      hora_fecha_autoriza: new Date(),
      estado_seguimiento: "RECGC",
      observaciones_gerencia: ordenCompra.observaciones_gerencia
    }
    this.aprobarCompra(datosParams);
    event.stopPropagation();
  }
  actualizarEstadoCompra(id_orden_compra_cabecera: number, estado_seguimiento: string){
    this.mostrarCarga = true;
    this.estadoPedidoService.actualizarEstadoCompra(id_orden_compra_cabecera, estado_seguimiento).subscribe({
      next:(data)=>
      {
        console.log("Estado Seguimiento actualizado:"+ data);
        this.listarOrdenesDeCompraGerencia();
        this.mostrarCarga = false;
      },
      error:(error)=>
      {
        console.log("Error al actualizar Estado Seguimiento:"+ error);
        this.listarOrdenesDeCompraGerencia();
        this.mostrarCarga = false;
      },
    });
  }
  aprobarCompra(datosParams: any){
    this.mostrarCarga = true;
    this.estadoPedidoService.aprobarCompra(datosParams).subscribe({
      next:(data)=>
      {
        console.log("Compra aprobada:"+ data);
        alert("Compra aprobada satisfactoriamente");
        this.listarOrdenesDeCompraGerencia();
        this.mostrarCarga = false;
      },
      error:(error)=>
      {
        console.log("Error al actualizar Estado Seguimiento:"+ error);
        alert("Errro al aprobar la Compra");
        this.listarOrdenesDeCompraGerencia();
        this.mostrarCarga = false;
      },
    });
  }
  filtrarEstadosCompraGerencia(){
    const fechaDesde = new Date(this.fechaDesde);
    const fechaHasta = new Date(this.fechaHasta);
    if(fechaDesde && fechaHasta)
    this.ordenesDeCompra = this.ordenDeCompraInicial.filter(pedido => {
      const fechaEmision = new Date(pedido.fecha_emision);
      return fechaDesde <= fechaEmision && fechaEmision <= fechaHasta;
    });
    if(this.opcionEstadoSeleccionada==='TODOS'){
      // this.listarOrdenesDeCompra();
      this.ordenesDeCompra = this.ordenDeCompraInicial
    } else {
        this.ordenesDeCompra = this.ordenDeCompraInicial.filter(pedido => pedido.estado_seguimiento === this.opcionEstadoSeleccionada);
      }
    console.log(this.ordenesDeCompra);
  }
}
