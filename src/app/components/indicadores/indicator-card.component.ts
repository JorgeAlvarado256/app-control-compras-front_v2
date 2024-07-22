import { AfterViewInit, Component, EventEmitter, Input, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import {IndicadoresService} from '../../services/indicadores/indicadores.service'
import { Usuario } from 'src/app/interfaces/usuarioInterface';
@Component({
  selector: 'app-indicator-card',
  templateUrl: './indicator-card.component.html',
  styleUrls: ['./indicator-card.component.scss']
})
export class IndicatorCardComponent implements OnInit, AfterViewInit {
  @Input() mostrarSolicitudesRecibidas = false;
  @Input() mostrarMisSolicitudes = false;
  @Input() mostrarEncargados = false;
  @Input() mostrarJefatura = false;
  @Input() misPedidos: any[] = [];
  @Input() misOrdenesCompra: any[] = [];
  @Input() misCotizaciones: any[] = [];
  @Input() PedidosRecibidos: any[] = [];
  @Input() misPedidosRealizados: any[] = [];
  @Input() codRolUsuario: number | undefined;
  @Output() kpiSeleccionado = new EventEmitter<string>();
  @Input() pestanaActiva = '';
  @Input() usuario: Usuario | undefined; // Permitir que usuario sea undefined

  mostrarCarga = true;
  mostrarResumen: boolean = false;
  mostrarCategoriasProductos: boolean = false;

  estadosSolicitantes = [
    { codigo: 'PENR', titulo: 'Órdenes de Pedido Pendientes', icono: 'https://img.icons8.com/ios-glyphs/96/000000/in-transit.png', clase: 'pendientes' },
    { codigo: 'APRC', titulo: 'Órdenes de Pedido Aprobados', icono: 'https://img.icons8.com/ios-glyphs/96/000000/approval.png', clase: 'aprobados' },
    { codigo: 'RECJ', titulo: 'Órdenes de Pedido Rechazados', icono: 'https://img.icons8.com/ios-glyphs/96/000000/high-importance.png', clase: 'rechazados' },
    { codigo: 'REVJ', titulo: 'Órdenes de Pedido En Revisión', icono: 'https://img.icons8.com/ios-glyphs/96/000000/edit-property.png', clase: 'revision' }
  ];

  estadosEncargados = [
    { codigo: 'PENR', titulo: 'Órdenes de Pedido Pendientes Encargado', icono: 'https://img.icons8.com/ios-glyphs/96/000000/in-transit.png', clase: 'pendientes' },
    { codigo: 'APRC', titulo: 'Órdenes de Pedido Aprobados Encargado', icono: 'https://img.icons8.com/ios-glyphs/96/000000/approval.png', clase: 'aprobados' },
    { codigo: 'RECJ', titulo: 'Órdenes de Pedido Rechazados Encargado', icono: 'https://img.icons8.com/ios-glyphs/96/000000/high-importance.png', clase: 'rechazados' },
    { codigo: 'REVJ', titulo: 'Órdenes de Pedido En Revisión Encargado', icono: 'https://img.icons8.com/ios-glyphs/96/000000/edit-property.png', clase: 'revision' }
  ];

  estadosJefatura = [
    { codigo: 'PENR', titulo: 'Órdenes de Pedido Pendientes Jefatura', icono: 'https://img.icons8.com/ios-glyphs/96/000000/in-transit.png', clase: 'pendientes' },
    { codigo: 'APRC', titulo: 'Órdenes de Pedido Aprobados Jefatura', icono: 'https://img.icons8.com/ios-glyphs/96/000000/approval.png', clase: 'aprobados' },
    { codigo: 'RECJ', titulo: 'Órdenes de Pedido Rechazados Jefatura', icono: 'https://img.icons8.com/ios-glyphs/96/000000/high-importance.png', clase: 'rechazados' },
    { codigo: 'REVJ', titulo: 'Órdenes de Pedido En Revisión Jefatura', icono: 'https://img.icons8.com/ios-glyphs/96/000000/edit-property.png', clase: 'revision' }
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef, private indicadoresService:IndicadoresService) {}

  ngOnInit(): void {
    if (this.usuario) { // Verificar si usuario está definido
      this.filtrarPedidos();
      this.getKPIsSolicitante(this.usuario.rut_usuario);
      this.obtenerKPIsEncargado(this.usuario.rut_usuario);
    } else {
      console.warn('El usuario no está definido en ngOnInit');
    }
  }


  getKPIsSolicitante(rut_usuario?: string) {
    if (rut_usuario) {
      this.indicadoresService.getKPIsSolicitante(rut_usuario).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.warn('rut_usuario no está definido');
    }
  }
  
  obtenerKPIsEncargado(rutUsuario?: string): void {
    if (rutUsuario) {
      this.indicadoresService.getKPIsEncargado(rutUsuario).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error('Error al obtener KPIs del encargado:', error);
        }
      );
    } else {
      console.warn('rutUsuario no está definido');
    }
  }
  
  
  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  seleccionarKPI(kpi: string): void {
    this.kpiSeleccionado.emit(kpi);
  }

  mostrarMisSolicitudesClick(): void {
    this.mostrarCarga = true;
    this.mostrarMisSolicitudes = !this.mostrarMisSolicitudes;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarEncargados = false;
    this.mostrarJefatura = false;
    this.mostrarCarga = false;
  }

  mostrarSolicitudesRecibidasClick(): void {
    this.mostrarCarga = true;
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
    this.mostrarEncargados = false;
    this.mostrarJefatura = false;
    this.mostrarCarga = false;
  }

  mostrarEncargadosClick(): void {
    this.mostrarCarga = true;
    this.mostrarEncargados = !this.mostrarEncargados;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarJefatura = false;
    this.mostrarCarga = false;
  }

  mostrarJefaturaClick(): void {
    this.mostrarCarga = true;
    this.mostrarJefatura = !this.mostrarJefatura;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarEncargados = false;
    this.mostrarCarga = false;
  }

  contarPedidosPorEstado(estado: string): number {
    let pedidosFiltrados = [];

    if (this.mostrarMisSolicitudes) {
      pedidosFiltrados = this.misPedidos;
    } else if (this.mostrarSolicitudesRecibidas) {
      pedidosFiltrados = this.PedidosRecibidos;
    } else if (this.mostrarEncargados) {
      pedidosFiltrados = this.misPedidos; // Asumimos que el encargado usa la misma lista de pedidos
    } else if (this.mostrarJefatura) {
      pedidosFiltrados = this.misPedidos; // Asumimos que la jefatura usa la misma lista de pedidos
    }

    return pedidosFiltrados.filter(pedido => pedido.estado_seguimiento === estado).length;
  }

  toggleMostrarMisSolicitudes(): void {
    this.mostrarCarga = false;
    this.mostrarMisSolicitudes = !this.mostrarMisSolicitudes;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarEncargados = false;
    this.mostrarJefatura = false;
  
  }

  toggleMostrarSolicitudesRecibidas(): void {
    this.mostrarCarga = false;
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
    this.mostrarEncargados = false;
    this.mostrarJefatura = false;
  }

  toggleMostrarEncargados(): void {
    this.mostrarCarga = false;
    this.mostrarEncargados = !this.mostrarEncargados;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarJefatura = false;
  }

  toggleMostrarJefatura(): void {
    this.mostrarCarga = false;
    this.mostrarJefatura = !this.mostrarJefatura;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarEncargados = false;
  }

  toggleMostrarCategoriasProductos(): void {
    this.mostrarCarga = false;
    this.mostrarCategoriasProductos = !this.mostrarCategoriasProductos;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarResumen = false;
    this.mostrarCarga = false;
  }

  toggleMostrarResumen(): void {
    this.mostrarCarga = true;
    this.mostrarResumen = !this.mostrarResumen;
    this.mostrarMisSolicitudes = false;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarCategoriasProductos = false;
    this.mostrarCarga = false;
  }

  filtrarPedidos(): void {
    if (this.codRolUsuario === 3) {
      this.mostrarMisSolicitudes = true;
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarEncargados = false;
      this.mostrarJefatura = false;
    } else if (this.codRolUsuario === 4) {
      this.mostrarMisSolicitudes = true;
      this.mostrarSolicitudesRecibidas = true;
      this.mostrarEncargados = false;
      this.mostrarJefatura = false;
    } else if (this.codRolUsuario === 5) {
      this.mostrarMisSolicitudes = false;
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarEncargados = true;
      this.mostrarJefatura = false;
    } else if (this.codRolUsuario === 6) {
      this.mostrarMisSolicitudes = false;
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarEncargados = false;
      this.mostrarJefatura = true;
    } else {
      this.mostrarMisSolicitudes = false;
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarEncargados = false;
      this.mostrarJefatura = false;
    }
  }
}
