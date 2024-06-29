import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/productoInterface';
import { PedidoDetalle } from 'src/app/interfaces/pedidoDetalleInterface';
import { AdquisidorService } from 'src/app/services/adquisitorService/adquisidor.service'; // Asegúrate de importar el servicio correcto
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { SolicitanteService } from 'src/app/services/solicitanteService/solicitante.service';
import { Empresa } from 'src/app/interfaces/empresaInterface';
import { EmpresaService } from 'src/app/services/empresaService/empresa.service';
import { OrdenCompraCabecera } from 'src/app/interfaces/ordenCompraCabecera';
import { OrdenCompraDetalle } from 'src/app/interfaces/ordenCompraDetalle';
import { EstadoPedidoService } from 'src/app/services/estadoPedidoService/estadoPedido.service';
import { Cotizacion } from 'src/app/interfaces/cotizacionInterface';
import { CotizacionService } from 'src/app/services/cotizacionService/cotizacion.service';
import { DetalleCotizacion } from 'src/app/interfaces/detalleCotizacionInterface';
import { Proveedor } from '../../interfaces/proveedorInterface';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-adquisidor',
  templateUrl: './adquisidor.component.html',
  styleUrls: ['./adquisidor.component.scss']
})
export class AdquisidorComponent implements OnInit {
  faSignOut = faSignOut;
  listaPedidos: any[] = [];
  //listaPedidos: PedidoDetalle[] = [];
  ordenesDeCompra: any[] = [];
  ordenDeCompraInicial: any[] = [];
  actualizarPedidoas: any[] = [];
  productos: Producto[] = [];
  usuario: any; // Asegúrate de definir el tipo correcto para el usuario
  mostrarOrdenesDeCompra = false;
  mostrarCarga = true;
  eliminarHabilitado = false;
  fechaActual: any;
  nombreDepartamento!: string;
  pestanaActiva: string = '';
  ordenCompraActual: any[] = [];
  listaEstadosPedido: any[] = [];
  toolTipEstado: string[] = [];
  empresa!: Empresa;
  razon_social: string = "";
  opcionSeleccionada: string = '';
  opcionEstadoSeleccionada: string = '';
  opcionesEstado: string[] = [];
  opcionesEstadoCompra: string[] = [];
  fechaDesde!: Date;
  fechaHasta!: Date;
  misPedidosFiltrados: any[] = [];
  sumaTotal: number = 0;
  iva: number = 0;
  neto: number = 0;
  precioUnidad: number = 0;
  ordenCompraCabecera!: OrdenCompraCabecera;
  ordenCompraDetalle!: OrdenCompraDetalle[];
  proveedor: {
    rut_proveedor: string;
    razon_social: string;
  }[] = [];
  opcionesProveedor: string[] = [];
  opcionSeleccionadaProveedor: string = '';
  eliminarDetallesCompra: any[] = [];
  trashFijo: string = "";
  nombreEliminar = "";
  detallesIniciales: any[] = [];
  editandoDetalle = false;
  detallesCompraIniciales: any[] = [];

  listaPedidosParaCotizacion: any[] = []; // Define el tipo apropiado para la lista de pedidos
  misPedidosFiltradosParaCotizar: any[] = []; // Define el tipo apropiado para los pedidos filtrados
  solicitudCotizacionActual: any[] = []; // Define el tipo apropiado para la solicitud de cotización actual
  producto: any = {};  // Assuming it's an object with a property `nombre_producto`
  cotizaciones: Cotizacion[] = [];
  Detallecotizaciones: DetalleCotizacion[] = [];
  pedido: any;
  cotizacion: Cotizacion | undefined = undefined;
  opcionesEstadoCotizacion: string[] = [];  // Añadida esta línea
  cotizacionesAgrupadas: Cotizacion[] = []; // Declaración de la propiedad cotizacionesAgrupadas
  cotizacionesAgregadas: Set<number> = new Set<number>();
  opcionSeleccionadaCotizacion: string = 'TODOS';
  pedidosAgregadosASolicitud: number[] = [];
  pedidoAgregadoExitosamente = false;
  pedidosAgregados: Set<string> = new Set<string>();
  pedidosSeleccionados: any[] = [];
  solicitudes: DetalleCotizacion[] = [];
  proveedores: any[] = [];
  cotizacionesIniciales: any[] = []; // Inicializado como un arreglo vacío de tipo any
  proveedoresSeleccionados: any[] = []; // Inicializado como un arreglo vacío de tipo any
  proveedorSeleccionado: boolean[] = []; // Inicializado como un arreglo vacío
  cotizacionSeleccionada: boolean[] = [];
  cotizacionesSeleccionadas: Cotizacion[] = []; 
  seleccionados: boolean[] = []; 
  idCotizacion!: number;
  idProveedor!: number;
  rutUsuario: Usuario[]=[];
  usuarioAutenticado: Usuario | null = null; // Inicializa el usuario autenticado como nulo
  correoEnviado: boolean = false; 
  estado: string = ''; 
  ProductoaSolicitudActual:any[] = [];
  listaPedidosAprobadosRecibidos:any[] = [];
  solicitud:any[]=[];
  detalleOrdenVisible: boolean = false;
  ordenSeleccionada: any;
  detallesOrdenCompra: any[] = [];

  solicitudesDeCotizacion: any[] = [];
  detalleSolicitudVisible: boolean = false;
  solicitudSeleccionada: any;
  detallesSolicitudCotizacion: any[] = [];
  errorProductoAgregado = false;

  constructor(
    public empresaService: EmpresaService,
    public adquisidorService: AdquisidorService, // Asegúrate de inyectar el servicio correcto
    private authService: AuthService,
    public solicitanteService: SolicitanteService,
    public estadoPedidoService: EstadoPedidoService,
    private router: Router,
    public datePipe: DatePipe,
    private cotizacionService: CotizacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.mostrarCarga = true;
    const fechaActualFormatted = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.fechaActual = fechaActualFormatted || 'Fecha no disponible';

    const navigationState = window.history.state;
    if (navigationState && navigationState.usuario) {
      this.usuario = navigationState.usuario as Usuario;
      // this.listarOrdenesDeCompra(this.usuario.rut_usuario, this.usuario.cod_rol);
      this.listarOrdenesDeCompra();
    }
    this.solicitanteService.getDepartamento(this.usuario.id_departamento).subscribe({
      next: (data: { nom_departamento: any; }) => {
        this.nombreDepartamento = data.nom_departamento;
        this.mostrarCarga = false;
      }
    });
    this.empresaService.getEmpresa(this.usuario.rut_empresa).subscribe({
      next: (data) => {
        if (data) {
          this.empresa = data as Empresa;
          this.razon_social = this.empresa.razon_social;
          this.cargarProveedores();
          this.mostrarCarga = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener datos de la Empresa', error);
        alert('Error al obtener datos de la Empresa:' + error)
        this.mostrarCarga = false;
      },
    });
    this.solicitanteService.getCategorias(this.usuario.rut_empresa).subscribe({
      next: (data) => {
        this.opcionesEstado = data.map(item => item.nombre_categoria);
      },
      error: (error) => {
        console.error('Error al listar categorías', error);
        alert('Error al listar categorías:' + error);
      }
    });
    this.estadoPedidoService.obtenerEstadoPedido().subscribe({
      next: (data) => {
        this.listaEstadosPedido = data;
        this.opcionesEstadoCompra = this.listaEstadosPedido.filter(item => item.tipo_estado === "COMPRA").map(item => item.nombre_estado);
        this.toolTipEstado = this.listaEstadosPedido.map(item => item.descripcion_estado);
        this.mostrarCarga = false;
      },

      error: (error) => {
        console.error('Error al listar estados', error);
        alert('Error al listar estados:' + error)
        this.mostrarCarga = false;
      }
    });
    this.cotizacionService.obtenerCotizaciones().subscribe(
      (cotizaciones: Cotizacion[]) => {
        // Inicializa expanded en false para todas las cotizaciones
        cotizaciones.forEach(cotizacion => cotizacion.expanded = false);
        this.cotizaciones = cotizaciones;
      },
      (error) => {
        console.error('Error al obtener las cotizaciones:', error);
      }
    );
    


    this.listarProductosAprobados();
    this.pestanaActiva = "ordenesCompras";
    this.opcionSeleccionada = 'TODOS';
    this.opcionEstadoSeleccionada = 'TODOS';
    this.opcionSeleccionadaProveedor = 'Seleccione un proveedor';
    //this.listarOrdenesDeCompra();
    this.listarProductosAprobadosParaCotizacion();
    this.obtenerCotizaciones();
    this.cargarProveedores();
    this.inicializarCotizacionSeleccionada();
    if (this.cotizacionSeleccionada !== null) {
      // Acceder a las propiedades de this.cotizacionSeleccionada aquí de forma segura
      console.log(this.cotizacionSeleccionada); // Error: Property 'id_cotizacion' does not exist on type 'boolean[]'
    } else {
      // Manejar el caso donde this.cotizacionSeleccionada es null
      console.error('this.cotizacionSeleccionada es null');
    }
    
    this.obtenerUsuarioAutenticado();
    this.listarProductosAprobadosParaCotizacion();
    this.cdr.detectChanges();

    



  }

  obtenerUsuarioAutenticado(): void {
    // Llama al método del servicio para obtener el usuario autenticado
    this.authService.getCurrentUsuario().subscribe(
      (usuario: Usuario) => {
        // Almacena el usuario autenticado en una propiedad del componente
        this.usuarioAutenticado = usuario;
        console.log('ID del usuario autenticado:', this.usuarioAutenticado); // Muestra el usuario en la consola
      },
      (error: any) => {
        console.error('Error al obtener el usuario autenticado:', error);
      }
    );
  }

  
  cargarDatosIniciales(): void {
    // Aquí puedes cargar los datos iniciales una vez que tienes el idUsuario
    console.log('ID del usuario autenticado:', this.rutUsuario);
  }

  cargarProveedores() {
    this.cotizacionService.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (error) => {
        console.log('Error al cargar proveedores:', error);
      }
    });
  }


  listarProductosAprobados() {
    // Lógica para obtener productos aprobados (estado APRC o APRO)
    // Utiliza el servicio adquisidorService para obtener los datos necesarios
    this.adquisidorService.obtenerPedidosAprobados(this.usuario.rut_empresa).subscribe({
      next: (data) => {
        this.listaPedidos = data.pedidos;
        this.misPedidosFiltrados = this.listaPedidos;
      },
      error: (error) => {
        console.log("Error: " + error);
      },
    });
  }

  obtenerPedidos() {
    this.cotizacionService.obtenerPedidos().subscribe(pedidos => {
      this.listaPedidos = pedidos;
      this.obtenerPedidosCotizados();
    });
  }

  obtenerPedidosCotizados() {
    this.cotizacionService.obtenerPedidosCotizados().subscribe(pedidosCotizados => {
      this.listaPedidosParaCotizacion = this.listaPedidos.filter(pedido => 
        !pedidosCotizados.includes(pedido.id_cotizacion)); // Filtra usando el ID de cotización
      this.filtrarPedidosParaCotizacion();
    });
  }


  listarOrdenesDeCompra() {
    // Lógica para obtener las órdenes de compra
    // Utiliza el servicio adquisidorService para obtener los datos necesarios
    if (this.usuario.cod_rol !== 6)
      this.adquisidorService.getOrdenesDeCompra(this.usuario.rut_usuario).subscribe({
        next: (data) => {
          this.ordenesDeCompra = data.pedidos;
          this.ordenDeCompraInicial = data.pedidos;
          this.ordenesDeCompra.forEach(orden => {
            orden.detalles.forEach((detalle: any) => {
              const detalleResumido = {
                id_orden_compra_detalle: detalle.id_orden_compra_detalle,
                precio_total_item: detalle.precio_total_item,
                precio_unitario: detalle.precio_unitario,
                cantidad_solicitada: detalle.precio_total_item / detalle.precio_unitario,
              };

              this.detallesCompraIniciales.push(detalleResumido);
            });
          });
        },
        error: (error) => {
          console.log("Error: " + error);
        }
      });
  }
  buscarItem(idDetalle: number, propiedad: string): number {
    const detalleEncontrado = this.detallesCompraIniciales.find(detalle => detalle.id_orden_compra_detalle === idDetalle);

    if (detalleEncontrado) {
      return detalleEncontrado[propiedad];
    }
    return 0; // O cualquier valor predeterminado que desees mostrar si no se encuentra el detalle.
  }
  agregarProductoAOrden(pedido: any) {
    // const productoExistente = this.ordenCompraActual.find((p) => p.id_producto === pedido.id_producto);
    // if (productoExistente) {
    //   productoExistente.cantidad += pedido.cantidad_solicitada;
    //   const nuevoProducto = { ...pedido, cantidad: pedido.cantidad_solicitada };
    //   this.ordenCompraActual.push(nuevoProducto);
    //   //this.actualizarPedidoas.push(nuevoProducto);
    // }
    // else{
    //   const nuevoProducto = { ...pedido, cantidad: pedido.cantidad_solicitada };
    //   this.ordenCompraActual.push(nuevoProducto);
    // }
    this.ordenCompraActual.push({
      pedido: pedido,
      precioUnidad: 0,
      precioTotalItems: 0
    });
    this.calcularSumaTotal();
  }
  mostrarBtnAgregar(pedido: any) {
    const existe = this.ordenCompraActual.some(item => {
      return item.pedido.id_orden_pedido_cabecera_fk === pedido.id_orden_pedido_cabecera_fk && item.pedido.id_producto === pedido.id_producto;
    });
    if (existe) {
      return true;
    }
    return false;
  }
  // eliminarProducto(pedido: any) {
  //   const indice = this.ordenCompraActual.indexOf(pedido);
  //   this.ordenCompraActual.splice(indice, 1);
  //   this.calcularSumaTotal();
  // }
  eliminarDetalle(detalle: any) {
    const indice = this.ordenCompraActual.indexOf(detalle);
    this.ordenCompraActual.splice(indice, 1);
    this.calcularSumaTotal();
  }

  guardarOrdenCompra() {
    // if(true)
    // {
    //   alert("botón en mantenimiento")
    //   return;
    // }
    this.mostrarCarga = true;
    const rut_proveedor = this.proveedor.find(p => p.razon_social === this.opcionSeleccionadaProveedor)?.rut_proveedor ?? ''
    this.ordenCompraCabecera = {
      // id_orden_compra_cabecera?: number;
      rut_empresa: this.empresa.rut_empresa,
      rut_proveedor: rut_proveedor,
      rut_usuario: this.usuario.rut_usuario,
      fecha_emision: new Date(),
      estado_seguimiento: "PENRC",
      neto: this.neto,
      iva: this.iva,
      total_compra: this.sumaTotal,
      // rut_autoriza?: string,
      // nombre_autoriza?: string,
      // hora_fecha_autoriza?: Date,
      // observaciones_adquisiciones?: string;
      // observaciones_gerencia?: string;
      ordenCompraDetalle: this.agregarCompraDetalle()
    }
    // Lógica para enviar la orden de compra al servidor
    this.adquisidorService.generarOrdenCompra(this.ordenCompraCabecera).subscribe({
      next: (data) => {
        // Manejar la respuesta del servidor
        console.log('Orden de compra generada correctamente');
        // Limpiar la variable de orden de compra actual
        this.ordenCompraActual = [];
        this.calcularSumaTotal();
        this.listarProductosAprobados();
        this.listarOrdenesDeCompra();
        alert('Orden de Compra generada correctamente');
        this.opcionSeleccionada = 'TODOS';
        this.opcionEstadoSeleccionada = 'TODOS';
        this.mostrarCarga = false;
      },
      error: (error) => {
        console.log('Error al generar la orden de compra', error);
        this.mostrarCarga = false;
      }
    });
  }


  agregarCompraDetalle(): OrdenCompraDetalle[] {
    const compraDetalles: OrdenCompraDetalle[] = [];
    this.ordenCompraActual.forEach((detalle) => {
      const compraDetalle: OrdenCompraDetalle = {
        // id_orden_compra_detalle?: number;
        rut_empresa: this.empresa.rut_empresa,
        id_orden_compra_cabecera_fk: detalle.pedido.id_orden_compra_cabecera,
        id_producto: detalle.pedido.id_producto,
        // cantidad_comprada?: number;
        precio_unitario: detalle.precioUnidad,
        precio_total_item: detalle.precioTotalItems,
        // cantidad_recepcionada?: number;
        id_orden_pedido_detalle: detalle.pedido.id_orden_pedido_detalle
      };
      compraDetalles.push(compraDetalle);
    });
    return compraDetalles;
  }
  cerrarSesion() {
    this.authService.isLogOut();
    this.router.navigate(['/login']);
  }
  navOrdenesCompras() {
    this.pestanaActiva = 'ordenesCompras';
  }

  navCrearOrdenCompra() {
    console.log(this.listaPedidos);
    this.pestanaActiva = 'crearOrdenCompra';
  }

  navMisSolicitudes() {
    this.pestanaActiva = 'misSolicitudes';
  }

  navCrearSolicitudCotizacion() {
    this.pestanaActiva = 'crearSolicitudCotizacion';
  }

  filtrarPedidos() {
    // const fechaDesde = new Date(this.fechaDesde);
    // const fechaHasta = new Date(this.fechaHasta);
    // if(fechaDesde && fechaHasta)
    // this.misPedidosFiltrados = this.listaPedidos.filter(pedido => {
    //   const fechaEmision = new Date(pedido.fecha_emision);
    //   return fechaDesde <= fechaEmision && fechaEmision <= fechaHasta;
    // });
    if (this.opcionSeleccionada === 'TODOS') {
      this.misPedidosFiltrados = this.listaPedidos;
    } else {
      this.misPedidosFiltrados = this.listaPedidos.filter(pedido => pedido.producto?.categoria?.nombre_categoria === this.opcionSeleccionada);
    }
    console.log(this.misPedidosFiltrados);
  }
  actualizarPrecio(detalle: any, event: any) {
    console.log("precioUnidad: " + detalle.precioUnidad);
    if (event.target.value !== undefined) {
      detalle.precioUnidad = event.target.value;
      detalle.precioTotalItems = detalle.precioUnidad * detalle.pedido.cantidad_solicitada;
    }
    this.calcularSumaTotal();
  }
  // calcularSumaTotal(){
  //   this.sumaTotal = 0;
  //   this.iva = 0;
  //   this.neto = 0;
  //   this.ordenCompraActual.forEach(det => {
  //     const subtotal = det.pedido.cantidad_solicitada * det.precioUnidad;
  //     this.neto += subtotal; 
  //   })
  //   this.iva = this.neto * 0.19;
  //   this.sumaTotal = this.neto + this.iva;
  // }
  calcularSumaTotal() {
    this.sumaTotal = 0;
    this.iva = 0;
    this.neto = 0;
    this.ordenCompraActual.forEach(det => {
      const subtotal = det.pedido.cantidad_solicitada * det.precioUnidad;
      this.sumaTotal += subtotal;
    })
    this.iva = this.sumaTotal * 0.19;
    this.neto = this.sumaTotal - this.iva;
  }
  precioUnidadValido(detalle: any): boolean {
    return detalle.precioUnidad > 0;
  }
  detalleEnListaEliminar(detalle: any): boolean {
    return this.eliminarDetallesCompra.includes(detalle);
  }
  habilitarEliminar(detalle: any) {
    if (!this.eliminarHabilitado) {
      return;
    }
    this.trashFijo = detalle.producto?.nombre_producto;
    const detallesInicio = JSON.parse(JSON.stringify(this.detallesIniciales));
    if (!this.eliminarDetallesCompra.includes(detalle)) {
      detalle.precio_unitario = 0;
      this.nombreEliminar = detalle.producto?.nombre_producto;
      this.eliminarDetallesCompra.push(detalle);
      this.detallesIniciales = detallesInicio;
    }
    else {
      const detallesModificados = this.detallesIniciales.filter((d: any) => {
        const detalleOriginal = d;
        return detalle.id_orden_compra_detalle === detalleOriginal.id_orden_compra_detalle;
      });
      detalle.precio_unitario = detallesModificados[0].precio_unitario;
      const index = this.eliminarDetallesCompra.indexOf(detalle);
      if (index > -1) {
        this.eliminarDetallesCompra.splice(index, 1);
      }
    }
  }
  habilitarEdicion(estadoSeguimiento: string, detalles: any) {
    this.detallesIniciales = detalles;
    if (estadoSeguimiento !== 'PENRC' && estadoSeguimiento !== 'RECGC') {
      return;
    }
    if (estadoSeguimiento === 'PENRC' || estadoSeguimiento === 'RECGC') {
      this.editandoDetalle = true;
    }
    this.eliminarHabilitado = true;
  }
  valorInicialPrecioTotal(detalle: any): number {
    return detalle.precio_total_item / detalle.precio_unitario;
  }
  cancelar() {
    this.listarOrdenesDeCompra();
    this.eliminarHabilitado = false;
    this.eliminarDetallesCompra = [];
    this.editandoDetalle = false;
  }
  actualizarCompra(ordenCompra: any) {
    this.mostrarCarga = true;
    // const detallesInicio = JSON.parse(JSON.stringify(this.detallesIniciales));
    const detallesModificados = ordenCompra.detalles.filter((detalle: any, index: any) => {
      const detalleInicial = this.buscarItem(detalle.id_orden_compra_detalle, 'precio_unitario'); //this.detallesIniciales[index];
      return detalle.precio_unitario !== detalleInicial;//.precio_unitario;
    });
    console.log(detallesModificados);
    this.adquisidorService.actualizarCompra(detallesModificados).subscribe({
      next: (data) => {
        console.log(data);
        alert('Ordenes de Compra actualizados correctamente');
        this.listarOrdenesDeCompra();
        this.mostrarCarga = false;
      },
      error: (error) => {
        console.log(error);
        this.mostrarCarga = false;
      }
    });
    // this.tarjetaSeleccionada = -1;
    this.eliminarHabilitado = false;
    this.eliminarDetallesCompra = [];
    this.editandoDetalle = false
  }
  confirmarRecepcion(ordenCompra: any) {
    this.mostrarCarga = true;
    this.adquisidorService.confirmarRecepcionCompra(ordenCompra).subscribe({
      next: (data) => {
        console.log(data);
        alert('Recepción confirmada correctamente');
        this.listarOrdenesDeCompra();
        this.mostrarCarga = false;
      },
      error: (error) => {
        console.log(error);
        this.mostrarCarga = false;
      }
    });
  }
  anularCompra(id_orden_compra_cabecera: number) {
    this.mostrarCarga = true;
    this.adquisidorService.anularCompra(id_orden_compra_cabecera).subscribe({
      next: (data) => {
        console.log(data);
        alert('Pedido eliminado correctamente');
        this.listarOrdenesDeCompra();
        this.mostrarCarga = false;
      },
      error: (error) => {
        console.log(error);
        alert('Error al anular pedido: ' + error);
        this.mostrarCarga = false;
      },
    });
    this.filtrarPedidos();
    this.eliminarHabilitado = false;
    this.eliminarDetallesCompra = [];
    this.editandoDetalle = false;
  }
  filtrarEstadosCompra() {
    const fechaDesde = new Date(this.fechaDesde);
    const fechaHasta = new Date(this.fechaHasta);
    if (fechaDesde && fechaHasta)
      this.ordenesDeCompra = this.ordenDeCompraInicial.filter(pedido => {
        const fechaEmision = new Date(pedido.fecha_emision);
        return fechaDesde <= fechaEmision && fechaEmision <= fechaHasta;
      });
    if (this.opcionEstadoSeleccionada === 'TODOS') {
      // this.listarOrdenesDeCompra();
      this.ordenesDeCompra = this.ordenDeCompraInicial
    } else {
      this.ordenesDeCompra = this.ordenDeCompraInicial.filter(pedido => pedido.estado_seguimiento === this.opcionEstadoSeleccionada);
    }
    console.log(this.ordenesDeCompra);
  }

  filtrarEstadosCotizacion() {
    const fechaDesde = new Date(this.fechaDesde);
    const fechaHasta = new Date(this.fechaHasta);

    if (fechaDesde && fechaHasta) {
        this.cotizaciones = this.cotizacionesIniciales.filter((cotizacion: any) => {
            const fechaEmision = new Date(cotizacion.fecha_emision);
            return fechaDesde <= fechaEmision && fechaEmision <= fechaHasta;
        });
    }

    if (this.opcionEstadoSeleccionada === 'TODOS') {
        this.cotizaciones = this.cotizacionesIniciales;
    } else {
        this.cotizaciones = this.cotizacionesIniciales.filter((cotizacion: any) => cotizacion.tipo_estado === "COTIZACION" );
    }

    console.log(this.cotizaciones);
}
obtenerToolTip(estado: string): string {
  // Lógica para obtener la descripción del estado
  // Puedes implementar la lógica para obtener la descripción aquí
  return this.listaEstadosPedido.find(item => item.nombre_estado === estado).descripcion_estado ?? 'COTIZACION';}
  // obtenerToolTip(estado: string): string {
  //   return this.listaEstadosPedido.find(item => item.nombre_estado === estado).descripcion_estado ?? '';
  // }
  //Modulo nuevo de cotizacion

  filtrarPedidosParaCotizacion() {
    // Filtrar los pedidos disponibles eliminando aquellos que ya han sido agregados a la solicitud de cotización actual
    this.listaPedidosParaCotizacion = this.listaPedidosParaCotizacion.filter(pedido => !this.pedidosAgregados.has(this.generarClavePedido(pedido)));
  }
  

  mostrarBtnAgregarCotizacion(pedido: any): boolean {
    if (pedido && pedido.id_orden_pedido_cabecera_fk) {
      // Lógica para determinar si mostrar el botón de agregar cotización
      return true; // O cambia según tus necesidades
    }
    return false;
  }

  agregarProductoASolicitud(producto: any) {
    // Agregar el producto a la solicitud de cotización actual
    this.ProductoaSolicitudActual.push({
      id_cotizacion: null, // Se generará automáticamente en la base de datos (AI)
      detalles: [],
      fecha_cotizacion: new Date(), // Fecha actual
      estado_seguimiento: 'PR', // Estado inicial de seguimiento
      producto: producto // Agregar el producto a la solicitud
    });
  
    // Filtrar los pedidos aprobados recibidos eliminando aquellos que ya han sido agregados a la solicitud de cotización actual
    this.listaPedidosAprobadosRecibidos = this.listaPedidosAprobadosRecibidos.filter(pedido => pedido.id_orden_pedido_detalle !== producto.id_orden_pedido_detalle);
  }
  
  

  actualizarPedido(idCotizacion: number) {
    this.cotizacionService.actualizarPedido(idCotizacion).subscribe({
      next: (data) => {
        console.log('Pedido actualizado correctamente:', data);
        console.log('Pedido actualizado correctamente para la cotización con ID:', idCotizacion);

      },
      error: (error) => {
        console.log('Error al actualizar el pedido:', error);
      }
      
    });
  }


  actualizarPrecioEnCotizacion(detalle: any, event: any) {
    // Método para actualizar el precio de un detalle de solicitud de cotización
  }

  eliminarDetalleDeCotizacion(detalle: DetalleCotizacion) {
    this.solicitudCotizacionActual = this.solicitudCotizacionActual.filter(item => item.detalle.id !== detalle.id_producto);
  }


  precioUnidadValidoParaCotizacion(precioUnidad: number): boolean {
    // Método para verificar si el precio de unidad es válido
    return true; // O cambia según tus necesidades
  }

  agruparCotizacionesPorID(cotizaciones: Cotizacion[]): Cotizacion[] {
    const cotizacionesMap = new Map<number, Cotizacion>();

    cotizaciones.forEach(cotizacion => {
      const idCotizacion = cotizacion.id_cotizacion;
      if (cotizacionesMap.has(idCotizacion)) {
        // Si la cotización ya existe en el mapa, actualizamos sus detalles
        const cotizacionExistente = cotizacionesMap.get(idCotizacion);
        if (cotizacionExistente) {
          cotizacionExistente.detalles.push(...cotizacion.detalles);
        }
      } else {
        // Si la cotización no existe en el mapa, la agregamos al mapa
        cotizacionesMap.set(idCotizacion, cotizacion);
      }
    });

    // Convertimos el mapa de cotizaciones nuevamente en un arreglo
    return Array.from(cotizacionesMap.values());
  }
  
  obtenerCotizaciones() {
    this.cotizacionService.obtenerCotizaciones().subscribe((cotizaciones: Cotizacion[]) => {
      this.cotizacionesAgrupadas = cotizaciones;
      // Iterar sobre cada cotización para asegurar que los detalles tengan el nombre del producto
      this.cotizacionesAgrupadas.forEach((cotizacion) => {
        cotizacion.detalles.forEach(async (detalle) => {
          try {
            // Acceder al nombre del producto a través de la relación 'producto'
            await detalle.producto; // Asegúrate de que la relación 'producto' esté configurada correctamente
          } catch (error) {
            console.error('Error al obtener el nombre del producto:', error);
          }
        });
      });
    });
  }
  
  seleccionarCotizacion(cotizacion: Cotizacion): void {
    this.cotizacion = cotizacion;
    console.log('Cotización seleccionada:', this.cotizacion);
}


listarProductosAprobadosParaCotizacion() {
  this.adquisidorService.obtenerPedidosAprobados(this.usuario.rut_empresa).subscribe({
    next: (data) => {
      this.listaPedidosParaCotizacion = data.pedidos;
      console.log('Pedidos aprobados recibidos:', this.listaPedidosParaCotizacion);
    },
    error: (error) => {
      console.log("Error: " + error);
    },
  });
}

agregarPedidoASolicitud(pedido: any) {
  this.mostrarCarga = true; // Mostrar indicador de carga

  if (!pedido) {
    console.error('El pedido es undefined o null.');
    return;
  }

  if (!this.solicitudCotizacionActual || this.solicitudCotizacionActual.length === 0) {
    this.solicitudCotizacionActual = [{
      id_cotizacion: null,
      rut_empresa: pedido.rut_empresa,
      detalles: [],
      fecha_emision: new Date(),
      estado_seguimiento: 'PR',
    }];
  }

  // Verificar si el pedido ya está agregado
  if (this.pedidoAgregado(pedido)) {
    console.log('Este producto ya ha sido agregado');
    return;
  }

  // Verificar si el ID del pedido es diferente al de los detalles existentes
  if (this.solicitudCotizacionActual[0].detalles.length > 0) {
    const idPedido = pedido.id_orden_pedido_cabecera_fk;
    const idDetalleExistente = this.solicitudCotizacionActual[0].detalles[0].id_orden_pedido_cabecera_fk;

    if (idDetalleExistente !== idPedido) {
      alert('Advertencia: No puede agregar pedidos con diferentes ID de orden a la misma solicitud de cotización.');
      this.mostrarCarga = false;
      return;
    }
  }

  // Agregar el pedido a la solicitud de cotización
  const detalle: DetalleCotizacion = {
    id_producto: pedido.id_producto,
    cantidad_solicitada: pedido.cantidad_solicitada,
    nombre_producto: pedido.producto.nombre_producto,
    cantidad_comprada: pedido.cantidad_comprada,
    cantidad_recepcionada: pedido.cantidad_recepcionada,
    estado_seguimiento_producto: "PR",
    id_orden_pedido_cabecera_fk: pedido.id_orden_pedido_cabecera_fk,
    orden_compra_detalle_fk: pedido.orden_compra_detalle_fk,
    id_proveedores: pedido.id_proveedores,
    id_detalle_cotizacion: null,
    id_cotizacion_fk: null
  };

  this.solicitudCotizacionActual[0].detalles.push(detalle);
  this.mostrarCarga = false;

  console.log('Pedido agregado a la solicitud de cotización:', pedido);
    // Cambiar la pestaña activa a 'misSolicitudes'
  console.log('Estado actual de la solicitud de cotización:', JSON.stringify(this.solicitudCotizacionActual, null, 2));


}







pedidoAgregadoEnSolicitud(pedido: any): boolean {
  if (!this.solicitudCotizacionActual || this.solicitudCotizacionActual.length === 0) {
    return false; // No hay solicitud de cotización actual
  }

  const idPedido = pedido.id_orden_pedido_cabecera_fk;

  // Verificar si algún detalle tiene el mismo id_pedido
  return this.solicitudCotizacionActual[0]?.detalles.some((detalle: DetalleCotizacion) =>
    detalle.id_orden_pedido_cabecera_fk === idPedido
  );
  
}







eliminarPedidoDeSolicitud(detalle: any) {
  const index = this.solicitudCotizacionActual[0].detalles.findIndex((d: any) => 
    d.id_producto === detalle.id_producto && 
    d.id_orden_pedido_cabecera_fk === detalle.id_orden_pedido_cabecera_fk);

  if (index !== -1) {
    this.solicitudCotizacionActual[0].detalles.splice(index, 1);
    console.log('Pedido eliminado de la solicitud de cotización:', detalle);
    console.log('Estado actual de la solicitud de cotización:', JSON.stringify(this.solicitudCotizacionActual, null, 2));
  } else {
    console.error('El pedido no se encuentra en la solicitud de cotización actual.');
  }
}

pedidoAgregado(pedido: any): boolean {
  this.mostrarCarga = true; // Mostrar indicador de carga
  return this.solicitudCotizacionActual[0]?.detalles.some((detalle: any) => detalle.id_producto === pedido.id_producto);
}

guardarSolicitudDeCotizacion() {
  this.cotizacionService.guardarSolicitudCotizacion(this.solicitudCotizacionActual[0]).subscribe({
    next: (response) => {
      console.log('Solicitud de cotización guardada con éxito:', response);
    },
    error: (error) => {
      console.error('Error al guardar la solicitud de cotización:', error);
      console.log('Solicitud de Cotización Guardada:', this.solicitudCotizacionActual);
      this.mostrarCarga = false; // Ocultar indicador de carga
    }})};




  private generarClavePedido(pedido: any): string {
    // Asegúrate de que la clave sea única.
    // Usar id_orden_pedido_detalle para generar una clave única
    return pedido.id_orden_pedido_detalle.toString();
  }

  // Método para alternar la expansión de detalles
  toggleDetalles(index: number): void {
    if (index >= 0 && index < this.cotizacionesAgrupadas.length) {
      this.cotizacionesAgrupadas[index].expanded = !this.cotizacionesAgrupadas[index].expanded;
    } else {
      console.error('Índice fuera de rango en toggleDetalles');
    }
  }

  toggleSeleccionCotizacion(index: number): void {
    if (this.isIndexInRange(index)) {
      // Cambiar el estado de selección de la cotización en el índice dado
      this.seleccionados[index] = !this.seleccionados[index];
      
      // Resto de la lógica para seleccionar/deseleccionar la cotización
      if (this.seleccionados[index]) {
        this.cotizacionesSeleccionadas.push(this.cotizacionesAgrupadas[index]);
        console.log('Cotización seleccionada:', this.cotizacionesAgrupadas[index]);
      } else {
        // Si se deselecciona, eliminar la cotización del arreglo de cotizaciones seleccionadas
        const selectedIdx = this.cotizacionesSeleccionadas.findIndex(cotizacion => cotizacion.id_cotizacion === this.cotizacionesAgrupadas[index].id_cotizacion);
        if (selectedIdx !== -1) {
          this.cotizacionesSeleccionadas.splice(selectedIdx, 1);
        }
        console.log('Cotización deseleccionada:', this.cotizacionesAgrupadas[index]);
      }
    } else {
      console.error('Índice fuera de rango en toggleSeleccionCotizacion');
    }
  }
  
  // Método para verificar si un índice está dentro del rango válido
  isIndexInRange(index: number): boolean {
    return index >= 0 && index < this.cotizacionesAgrupadas.length;
  }


  hayCotizacionesSeleccionadas(): boolean {
    return this.cotizacionSeleccionada.some(seleccionado => seleccionado);
  }

  
  agregarProveedorCotizacion() {
    this.mostrarCarga = true;
  
    const idCotizacion = this.cotizacionesSeleccionadas[0]?.id_cotizacion;
    const idProveedor = this.proveedoresSeleccionados[0]?.id_proveedores;
    const rutUsuario = this.usuarioAutenticado?.rut_usuario;
  
    if (!idCotizacion || !idProveedor || !rutUsuario) {
        console.error('ID de cotización, proveedor o RUT de usuario no definido.');
        this.mostrarCarga = false;
        return;
    }
  
    // Suponiendo que el estado de seguimiento es una cadena de texto
    const estadoSeguimiento = 'EP'; // O el estado que necesites
  
    const cotizacion: Cotizacion = {
      rut_empresa:this.empresa.rut_empresa,
      id_cotizacion: idCotizacion,
      detalles: this.Detallecotizaciones, // Suponiendo que tienes una lista de detalles de cotización
      fecha_emision: new Date(), // O la fecha que corresponda
      estado_seguimiento: estadoSeguimiento
      // Otros campos de la cotización si es necesario
    };
    
    this.cotizacionService.agregarProveedorCotizacion(idCotizacion, idProveedor, rutUsuario, estadoSeguimiento, this.solicitud)
        .subscribe({
            next: (response) => {
                console.log('Proveedor agregado a la cotización y correo enviado exitosamente:', response);
                    // Actualizar el estado en los detalles de cotización
                    this.cotizacionService.actualizarEstadoDetalleCotizaciones(idCotizacion, idProveedor).subscribe({
                      next: (response) => {
                        console.log('Estado de los detalles de cotización actualizado:', response);
                        
                        this.cotizacionesSeleccionadas = [];
                        this.proveedoresSeleccionados = [];
                        this.correoEnviado = true; 
                        this.mostrarCarga = false;
                      },
                      error: (error) => {
                        console.error('Error al actualizar el estado de los detalles de cotización:', error);
                        this.mostrarCarga = false;
                      }
                    });
                  },
                  error: (error) => {
                    console.error('Error al actualizar el estado de la cotización:', error);
                    this.mostrarCarga = false;
                  }
                });
              }
  

  descargarCotizacion(detalle: any) {
    // Lógica para descargar la cotización
    console.log('Descargando cotización para el detalle:', detalle);
    // Aquí puedes implementar la lógica para generar y descargar el archivo
  }




  seleccionarProveedor(proveedor: any) {
    const index = this.proveedoresSeleccionados.findIndex((p: any) => p.id_proveedores === proveedor.id_proveedores);
    if (index === -1) {
      this.proveedoresSeleccionados.push(proveedor);
    } else {
      this.proveedoresSeleccionados.splice(index, 1);
    }
  }
  
  inicializarCotizacionSeleccionada(): void {
    this.cotizacionSeleccionada = this.cotizacionesAgrupadas.map(() => false);
  }

  
}
