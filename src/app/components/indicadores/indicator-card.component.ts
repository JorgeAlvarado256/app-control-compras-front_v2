import { AfterViewInit, Component, EventEmitter, Input, Output, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicator-card',
  template: `
    <div class="btn-group" role="group">
      <button *ngIf="codRolUsuario === 4" class="btn btn-outline-primary"
              [ngClass]="{'active': mostrarMisSolicitudes}"
              (click)="mostrarMisSolicitudesClick()">
        Mis Solicitudes
      </button>
      <button *ngIf="codRolUsuario === 4" class="btn btn-outline-primary"
              [ngClass]="{'active': mostrarSolicitudesRecibidas}"
              (click)="mostrarSolicitudesRecibidasClick()">
        Solicitudes Recibidas
      </button>
    </div>

    <div class="kpi-navbar">
      <div *ngIf="codRolUsuario === 3 && mostrarMisSolicitudes" class="kpi-section">
        <div class="kpi-cards">
          <ng-container *ngFor="let estado of estadosSolicitantes">
            <div class="kpi-card small" (click)="seleccionarKPI(estado.codigo)">
              <img [src]="estado.icono" [alt]="estado.titulo">
              <div class="kpi-title">{{ estado.titulo }}</div>
              <div class="kpi-value">{{ contarPedidosPorEstado(estado.codigo) }}</div>
            </div>
          </ng-container>
        </div>
      </div>

      <div *ngIf="codRolUsuario === 4 && mostrarMisSolicitudes" class="kpi-section">
        <div class="kpi-cards">
          <ng-container *ngFor="let estado of estadosSolicitantes">
            <div class="kpi-card small" (click)="seleccionarKPI(estado.codigo)">
              <img [src]="estado.icono" [alt]="estado.titulo">
              <div class="kpi-title">{{ estado.titulo }}</div>
              <div class="kpi-value">{{ contarPedidosPorEstado(estado.codigo) }}</div>
            </div>
          </ng-container>
        </div>
      </div>

      <div *ngIf="codRolUsuario === 4 && mostrarSolicitudesRecibidas" class="kpi-section">
        <div class="kpi-cards">
          <ng-container *ngFor="let estado of estadosRecibidos">
            <div class="kpi-card small" (click)="seleccionarKPI(estado.codigo)">
              <img [src]="estado.icono" [alt]="estado.titulo">
              <div class="kpi-title">{{ estado.titulo }}</div>
              <div class="kpi-value">{{ contarPedidosPorEstado(estado.codigo) }}</div>
            </div>
          </ng-container>
        </div>
      </div>

      <div *ngIf="codRolUsuario === 5" class="kpi-section">
        <div class="kpi-cards">
          <div class="kpi-card small" (click)="seleccionarKPI('COTIZACIONES')">
            <img src="https://img.icons8.com/ios-glyphs/96/000000/in-transit.png" alt="Icono">
            <div class="kpi-title">Cotizaciones</div>
            <div class="kpi-value">{{ misCotizaciones.length }}</div>
          </div>

          <div class="kpi-card small" (click)="seleccionarKPI('ORDENES_COMPRA')">
            <img src="https://img.icons8.com/ios-glyphs/96/000000/in-transit.png" alt="Icono">
            <div class="kpi-title">Órdenes de Compra</div>
            <div class="kpi-value">{{ misOrdenesCompra.length }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./indicator-card.component.scss']
})
export class IndicatorCardComponent implements OnInit, AfterViewInit {
  @Input() esOrdenesCompra = false;
  @Input() mostrarMisSolicitudes = false;
  @Input() mostrarSolicitudesRecibidas = false;
  @Input() misPedidos: any[] = [];
  @Input() misOrdenesCompra: any[] = [];
  @Input() misCotizaciones: any[] = [];
  @Input() codRolUsuario: number | undefined;
  @Input() PedidosRecibidos: any[] = [];
  @Input() misPedidosRealizados: any[] = [];
  @Output() kpiSeleccionado = new EventEmitter<string>();
  @Input() pestanaActiva = '';
  mostrarCarga = true;
  mostrarResumen: boolean = false;
  mostrarCategoriasProductos: boolean = false;
  mostrarPedidos: boolean = false; // Variable para controlar la visibilidad de la sección de pedidos

  estadosSolicitantes = [
    { codigo: 'PENR', titulo: 'Mis Órdenes de Pedido Pendientes', icono: 'https://img.icons8.com/ios-glyphs/96/000000/in-transit.png', clase: 'pendientes' },
    { codigo: 'APRC', titulo: 'Mis Órdenes de Pedido Aprobados', icono: 'https://img.icons8.com/ios-glyphs/96/000000/approval.png', clase: 'aprobados' },
    { codigo: 'RECJ', titulo: 'Mis Órdenes de Pedido Rechazados', icono: 'https://img.icons8.com/ios-glyphs/96/000000/high-importance.png', clase: 'rechazados' },
    { codigo: 'REVJ', titulo: 'Mis Órdenes de Pedido En Revisión', icono: 'https://img.icons8.com/ios-glyphs/96/000000/edit-property.png', clase: 'revision' }
  ];
  estadosRecibidos = [
    { codigo: 'PENR', titulo: 'Órdenes de Pedido Pendientes Recibidos', icono: 'https://img.icons8.com/ios-glyphs/96/000000/in-transit.png', clase: 'pendientes' },
    { codigo: 'APRC', titulo: 'Órdenes de Pedido Aprobados Recibidos', icono: 'https://img.icons8.com/ios-glyphs/96/000000/approval.png', clase: 'aprobados' },
    { codigo: 'RECJ', titulo: 'Órdenes de Pedido Rechazados Recibidos', icono: 'https://img.icons8.com/ios-glyphs/96/000000/high-importance.png', clase: 'rechazados' },
    { codigo: 'REVJ', titulo: 'Órdenes de Pedido En Revisión Recibidos', icono: 'https://img.icons8.com/ios-glyphs/96/000000/edit-property.png', clase: 'revision' }
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filtrarPedidos();
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
    this.mostrarCarga = false;
  }

  mostrarSolicitudesRecibidasClick(): void {
    this.mostrarCarga = true;
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
    this.mostrarCarga = false;
  }

  contarPedidosPorEstado(estado: string): number {
    if (estado === 'PENR') {
      if (this.mostrarMisSolicitudes) {
        return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      } else if (this.mostrarSolicitudesRecibidas) {
        return this.PedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      }
    } else if (estado === 'APRC') {
      if (this.mostrarMisSolicitudes) {
        return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      } else if (this.mostrarSolicitudesRecibidas) {
        return this.PedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      }
    } else if (estado === 'RECJ') {
      if (this.mostrarMisSolicitudes) {
        return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      } else if (this.mostrarSolicitudesRecibidas) {
        return this.PedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      }
    } else if (estado === 'REVJ') {
      if (this.mostrarMisSolicitudes) {
        return this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      } else if (this.mostrarSolicitudesRecibidas) {
        return this.PedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
      }
    }
    return 0;
  }

  // contarPedidosPorEstado(estado: string): number {
  //   let count = 0;
  
  //   try {
  //     console.log('Estado:', estado);
  //     console.log('Mostrar Mis Solicitudes:', this.mostrarMisSolicitudes);
  //     console.log('Mostrar Solicitudes Recibidas:', this.mostrarSolicitudesRecibidas);
  //     console.log('CodRolUsuario:', this.codRolUsuario);
  
  //     if (this.mostrarMisSolicitudes) {
  //       console.log('Filtrando mis pedidos...');
  //       count = this.misPedidos.filter(pedido => pedido.estado_seguimiento === estado).length;
  //     } else if (this.mostrarSolicitudesRecibidas && this.codRolUsuario === 4) {
  //       console.log('Filtrando pedidos recibidos para rol 4...');
  //       count = this.PedidosRecibidos.filter(pedido => pedido.codRolUsuario === 4 && pedido.estado_seguimiento === estado).length;
  //     } else {
  //       console.log('Mostrando pedidos recibidos para otros roles o sin filtro de rol...');
  //       count = this.PedidosRecibidos.filter(pedido => pedido.estado_seguimiento === estado).length;
  //     }
  
  //     console.log('Cantidad de pedidos:', count);
  //   } catch (error) {
  //     console.error('Error al contar pedidos por estado:', error);
  //   }
  
  //   return count;
  // }
  
  
  
  
  
  

  toggleMostrarMisSolicitudes(): void {
    this.mostrarCarga = false;
    this.mostrarMisSolicitudes = !this.mostrarMisSolicitudes;
    this.mostrarSolicitudesRecibidas = false;
    this.mostrarCarga = false;
    this.mostrarPedidos = false;

  }

  toggleMostrarSolicitudesRecibidas(): void {
    this.mostrarCarga = false;
    this.mostrarSolicitudesRecibidas = !this.mostrarSolicitudesRecibidas;
    this.mostrarMisSolicitudes = false;
    this.mostrarCarga = false;
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
    if (this.codRolUsuario === 3 || this.codRolUsuario === 4) {
      this.mostrarMisSolicitudes = true;
      this.mostrarSolicitudesRecibidas = false;
    } else if (this.codRolUsuario === 4) {
      this.mostrarSolicitudesRecibidas = true;
      this.mostrarMisSolicitudes = true;
    } else {
      this.mostrarMisSolicitudes = false;
      this.mostrarSolicitudesRecibidas = false;
    }
  }

}
