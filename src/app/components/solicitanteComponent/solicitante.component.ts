import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarioInterface';
import { SolicitanteService } from 'src/app/services/solicitanteService/solicitante.service';
import { DatePipe } from '@angular/common';
import { ProductoService } from 'src/app/services/productoService/producto.service';
import { Producto } from 'src/app/interfaces/productoInterface';
import { AuthService } from 'src/app/services/auth.service';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { EmpresaService } from 'src/app/services/empresaService/empresa.service';
import { Empresa } from 'src/app/interfaces/empresaInterface';
import { PedidoDetalleService } from 'src/app/services/pedidoDetalleService/pedidoDetalle.service';
import { PedidoCabecera } from 'src/app/interfaces/pedidoCabeceraInterface';
import { PedidoDetalle } from 'src/app/interfaces/pedidoDetalleInterface';
import { EstadoPedidoService } from 'src/app/services/estadoPedidoService/estadoPedido.service';
import { EditarPedidoService } from 'src/app/services/editarPedidoService/editarPedido.service';
import { AnularPedidoService } from 'src/app/services/anularPedidoService/anularPedido.service';
import { IndicatorCardComponent } from 'src/app/components/indicadores/indicator-card.component';

@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrls: ['./solicitante.component.scss']
})
export class SolicitanteComponent implements AfterViewInit  {
  
  faSignOut = faSignOut;
  empresa!: Empresa;
  categoriasProductos: any[] = [];
  productosSeleccionados: Producto[] = [];  
  productosPorCategoria: any[] = [];
  productos: Producto[] = [];  // Lista de productos relacionados con la categoría seleccionada
  pedidosDetalleUsuario!: PedidoDetalle[];
  usuario!: Usuario;
  nombreDepartamento!: string;
  datosCabecera!: PedidoCabecera;
  fechaActual: string = "";
  categoriaActiva!: string;
  navegacion: '' | 'productos' = '';
  navegacionPestana: boolean = true;
  razon_social: string = "";
  mostrarResumen: boolean = false;
  mostrarCategoriasProductos: boolean = false;
  pestanaActiva: string = ''
  misPedidos: any[] = [];//PedidoCabecera[] = [];
  misPedidosDetalle: PedidoDetalle[][] = [];
  mostrarDetalle: PedidoDetalle[]=[];
  pedidoSeleccionado: any = null;
  detalleDesplegado: any = null;
  listaEstadosPedido: any[] = [];
  opcionesEstado: string[] = [];
  opcionSeleccionada: string = '';
  fechaDesde!: Date;
  fechaHasta!: Date;
  misPedidosFiltrados: any[] = [];
  tarjetaSeleccionada!: number;
  eliminarHabilitado = false;
  editandoDetalle = false;
  eliminarDetallesPedido: any[] = [];
  detallesIniciales: any[] = [];
  eliminarDetalle = false;
  nombreEliminar = "";
  trashPresionado = false;
  trashFijo: string = "";
  detalleEliminar: any = null;
  pedidoOriginal: any[] = [];
  mostrarCarga = true;
  opcionSecundaria = '';
  toolTipEstado: string[] = [];
  codRolUsuario: number = 3; // Supongamos que el usuario actual es un solicitante
  mostrarMisSolicitudes: boolean = false;
  mostrarListaPedidos: boolean = false;
  mostrarPedidosFiltrados: boolean = false;
  mostrarPedidos: boolean = false; // Variable para controlar la visibilidad de la sección de pedidos
  pedidosFiltrados: any[] = [];
  misOrdenesCompra: any[] = []; // Puedes cambiar 'any[]' por el tipo de datos apropiado
  misCotizaciones: any[] = []; // Puedes cambiar 'any[]' por el tipo de datos apropiado
  filtroActual: string = 'TODOS';
  mostrarTablaPedidos: boolean = false;
  mostrarIndicatorCard: boolean = false; // Nuevo estado para gestionar la visibilidad del indicador
  mostrarMisSolicitudesJefatura: boolean = false;
  mostrarSolicitudesRecibidas: boolean = false;
  usuarioActual: Usuario | null = null; // Usuario actual del sistema, inicializado como nulo

  @ViewChild(IndicatorCardComponent, { static: false }) indicatorCardComponent!: IndicatorCardComponent;


  
  constructor(
    public empresaService: EmpresaService,
    public productoService: ProductoService,
    public solicitanteService: SolicitanteService,
    public authService: AuthService,
    public estadoPedidoService: EstadoPedidoService,
    public pedidoDetalleService: PedidoDetalleService,
    public editarPedidoService: EditarPedidoService,
    public anularPedidoService: AnularPedidoService,
    public router:Router,
    public datePipe: DatePipe,


  ) {}

  ngOnInit(): void {
    this.mostrarCarga = true;
    const fechaActualFormatted = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.fechaActual = fechaActualFormatted || 'Fecha no disponible';

    const navigationState = window.history.state;
    if (navigationState && navigationState.usuario) {
      this.usuario = navigationState.usuario as Usuario;
      this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
    }
    this.solicitanteService.getDepartamento(this.usuario.id_departamento).subscribe({
      next:(data)=>{
        this.nombreDepartamento = data.nom_departamento;
      }
    });
    this.pestanaActiva = 'misPedidos';

    this.empresaService.getEmpresa(this.usuario.rut_empresa).subscribe({
      next:(data) => {
        if(data){
          this.empresa = data as Empresa;
          this.razon_social = this.empresa.razon_social;
          //this.mostrarCarga = false;
        }
      },
      error:(error) => {
        console.error('Error al obtener datos de la Empresa', error);
        alert('Error al obtener datos de la Empresa:' + error)
      },
    });

    this.solicitanteService.getCategorias(this.usuario.rut_empresa).subscribe({
      next:(data) => {
        this.categoriasProductos = data;
        this.mostrarCarga = false;
      },
      error:(error) => {
        console.error('Error al listar categorías', error);
        alert('Error al listar categorías:' + error);
        this.mostrarCarga=false;
      }
    });

    this.estadoPedidoService.obtenerEstadoPedido().subscribe({
      next:(data)=>{
        this.listaEstadosPedido=data;
        this.opcionesEstado = this.listaEstadosPedido.filter(item => item.tipo_estado === "PEDIDO").map(item => item.descripcion_estado);
        this.toolTipEstado = this.listaEstadosPedido.map(item => item.descripcion_estado);
        this.mostrarCarga = false;
      },
      error: (error)=>{
        console.error('Error al listar estados', error);
        alert('Error al listar estados:' + error)
        this.mostrarCarga=false;
      }
    });   
    

    this.opcionSeleccionada = 'TODOS';
    this.listarProductos();


  }

  
  ngAfterViewInit() {
    if (this.mostrarIndicatorCard) {
      this.indicatorCardComponent.kpiSeleccionado.subscribe((kpi: string) => {
        this.filtrarPedidosPorKPI(kpi);
        this.filtrarPedidosJefe(kpi);
      });
    } else {
      console.error('IndicatorCardComponent no está definido.');
    }
  }
  
  obtenerToolTip(estado: string):string{
    return this.listaEstadosPedido.find(item => item.nombre_estado === estado).descripcion_estado??'';
  }
  
  filtrarPedidosPorKPI(kpiSeleccionado: string) {
    const estadosValidos = ['TODOS', 'PENR', 'REVJ', 'RECJ', 'APRC', 'APRO', 'PCOM', 'PEDC', 'PEDP'];
  
    if (!estadosValidos.includes(kpiSeleccionado)) {
      console.log('Estado de seguimiento no válido.');
      this.mostrarTablaPedidos = false;
      this.misPedidosFiltrados = [];
      return;
    }
  
    this.filtroActual = kpiSeleccionado;
  
    if (kpiSeleccionado === 'TODOS') {
      this.misPedidosFiltrados = this.misPedidos.slice(); // Copia todos los pedidos
    } else if (kpiSeleccionado === 'APRO') {
      this.misPedidosFiltrados = this.misPedidos.filter(
        pedido => pedido.estado_seguimiento === 'APRO' || pedido.estado_seguimiento === 'APRC'
      );
    } else {
      this.misPedidosFiltrados = this.misPedidos.filter(
        pedido => pedido.estado_seguimiento === kpiSeleccionado
      );
    }
  
    this.mostrarTablaPedidos = this.misPedidosFiltrados.length > 0;
  
    console.log('Pedidos totales:', this.misPedidos);
    console.log('Pedidos filtrados:', this.misPedidosFiltrados);
  }
// Método para filtrar pedidos del usuario jefe según un KPI seleccionado
filtrarPedidosJefe(kpiSeleccionado: string) {
  const estadosValidos = ['TODOS', 'PENR', 'REVJ', 'RECJ', 'APRC', 'APRO', 'PCOM', 'PEDC', 'PEDP'];

  if (!this.usuarioActual || this.usuarioActual.cod_rol !== 4) {
    console.log('Usuario actual no tiene permisos de jefe.');
    return;
  }

  if (!estadosValidos.includes(kpiSeleccionado)) {
    console.log('Estado de seguimiento no válido.');
    this.mostrarTablaPedidos = false;
    this.misPedidosFiltrados = [];
    return;
  }

  this.filtroActual = kpiSeleccionado;

  let pedidosDelJefe = this.misPedidos.filter(
    pedido => pedido.usuarioId === this.usuarioActual!.id_usuario && this.usuarioActual!.cod_rol === 4
  );

  if (kpiSeleccionado === 'TODOS') {
    this.misPedidosFiltrados = pedidosDelJefe.slice(); // Copia todos los pedidos del jefe
  } else if (kpiSeleccionado === 'APRO') {
    this.misPedidosFiltrados = pedidosDelJefe.filter(
      pedido => pedido.estado_seguimiento === 'APRO' || pedido.estado_seguimiento === 'APRC'
    );
  } else {
    this.misPedidosFiltrados = pedidosDelJefe.filter(
      pedido => pedido.estado_seguimiento === kpiSeleccionado
    );
  }

  this.mostrarTablaPedidos = this.misPedidosFiltrados.length > 0;

  console.log('Pedidos totales:', this.misPedidos);
  console.log('Pedidos filtrados (Jefatura):', this.misPedidosFiltrados);
}

  
  
  
  
cerrarDetallesPedido() {
  // Vuelve a aplicar el filtro almacenado en filtroActual
  this.filtrarPedidosPorKPI(this.filtroActual);
}
  
  
  

  listarMisPedidos(rut_suario: string, cod_rol: number) {
    if (cod_rol === 4) {
      this.pedidoDetalleService.obtenerPedidosDetalleJefatura(this.usuario.rut_empresa, this.usuario.id_departamento).subscribe({
        next: (data) => {
          this.misPedidos = data.pedidos;
          this.misPedidosFiltrados = this.misPedidos;
          this.pedidoOriginal = this.misPedidosFiltrados.map((p: any) => ({ ...p }));
          this.mostrarCarga = false;
          this.filtrarPedidosPorKPI(this.opcionSeleccionada); // Filtrar los pedidos por KPI después de cargarlos
          
        }
      });
    } else {
      this.pedidoDetalleService.obtenerPedidosDetalle(rut_suario).subscribe({
        next: (data) => {
          this.misPedidos = data.pedidos;
          this.misPedidosFiltrados = this.misPedidos;
          this.pedidoOriginal = this.misPedidosFiltrados.map((p: any) => ({ ...p }));
          this.mostrarCarga = false;
          this.misPedidosFiltrados = this.misPedidos;
          this.filtrarPedidosPorKPI(this.opcionSeleccionada); // Filtrar los pedidos por KPI después de cargarlos
        }
      });
    }
  }
  

  listarProductos(){
    this.mostrarCarga = true;
    this.productoService.listarProductos().subscribe({
      next:(data) => {
        this.productos = data as Producto[];
        if(this.productos.length > 0) {
          this.productos.forEach(producto => {
            producto.cantidad=0;
          });
        }
        this.mostrarCarga = false;
      },
      error:(error) => {
        console.error('Error al listar productos', error);
      }
    });
  }

  toggleDetallePedido(pedido: any) {
    if (this.tarjetaSeleccionada === pedido.id_orden_pedido_cabecera) {
      // Si el mismo pedido está seleccionado, ocultar detalles
      this.pedidoSeleccionado = null;
      this.editandoDetalle = false;
      this.eliminarHabilitado = false;
      this.detallesIniciales = [];
      this.eliminarDetallesPedido = [];
      this.tarjetaSeleccionada = -1;
    } else {
      // Mostrar detalles del nuevo pedido seleccionado
      this.pedidoSeleccionado = this.misPedidosFiltrados.find(p => p.id_orden_pedido_cabecera === pedido.id_orden_pedido_cabecera);
      this.editandoDetalle = false;
      this.eliminarHabilitado = false;
      this.detalleDesplegado = null;
      this.detallesIniciales = this.pedidoSeleccionado.detalles.map((detalle: any) => ({ ...detalle }));
      this.eliminarDetallesPedido = [];
      this.tarjetaSeleccionada = pedido.id_orden_pedido_cabecera;
    }
  }
  
  
  

  toggleDetalle(detalle: any) {
    if (this.detalleDesplegado === detalle) {
      this.detalleDesplegado = null;
    } else {
      this.detalleDesplegado = detalle;
    }
  }

  listarProductosPorCategoria(codigoCategoria: number): void {
    if (!this.productos) {
      console.log("La lista de productos no está definida.");
      return;
    }
    this.productosPorCategoria = this.productos.filter(producto => producto.id_categoria_productos_fk === codigoCategoria);
    if (this.productosPorCategoria.length === 0) {
      console.log("No existen productos para esta categoría.");
    }
  }

  verProductos(codigoCategoria: string) {
    // Verificar si la categoría seleccionada es la misma que la categoría activa
    if (this.categoriaActiva === codigoCategoria) {
        // Si es la misma categoría, ocultar los productos
        this.navegacion = '';
        this.categoriaActiva = '';
        // Limpiar la lista de productos
        this.productosPorCategoria = [];
    } else {
        // Si es una categoría diferente, mostrar los productos correspondientes
        this.navegacion = 'productos';
        this.categoriaActiva = codigoCategoria;
        this.listarProductosPorCategoria(parseInt(codigoCategoria));


    }
}


  generarPedido() {
    this.mostrarCategoriasProductos = false;
    this.mostrarResumen = true;
    this.pestanaActiva = 'misPedidos';

  }

  agregarProducto(producto: Producto) {
    const productoExistente = this.productosSeleccionados.find((p) => p.id_producto === producto.id_producto);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      producto.cantidad = 1;
      this.productosSeleccionados.push(producto);
    }
  }

  
  quitarProducto(producto: Producto) {
    const productoExistente = this.productosSeleccionados.find((p) => p.id_producto === producto.id_producto);
    if (productoExistente) {
      if (productoExistente.cantidad > 1) {
        productoExistente.cantidad--;
      } else {
        const index = this.productosSeleccionados.findIndex((p) => p.id_producto === producto.id_producto);
        if (index !== -1) {
          productoExistente.cantidad--;
          this.productosSeleccionados.splice(index, 1);
        }
      }
    }
  }

  eliminarCantidadSeleccionada(producto: Producto) {
    if (producto.cantidad > 0) {
      producto.cantidad=0;
      const index = this.productosSeleccionados.indexOf(producto);
      if (index !== -1) {
        this.productosSeleccionados.splice(index, 1);
      }
    }
  }

  hayProductosSeleccionados(codigoCategoria: string): boolean {
    return this.productosSeleccionados.some(producto => producto.id_categoria_productos_fk === parseInt(codigoCategoria));
  }

  actualizarSeleccion(producto: Producto) {
    if (!producto.cantidad || producto.cantidad <= 0) {
      producto.cantidad=0;
      const index = this.productosSeleccionados.indexOf(producto);
      if (index !== -1) {
        this.productosSeleccionados.splice(index, 1);
      }
    } else{
      const productoExistente = this.productosSeleccionados.find((p) => p.id_producto === producto.id_producto);
      if (productoExistente) {
        productoExistente.cantidad = producto.cantidad;
      } else {
        this.productosSeleccionados.push(producto);
      }
    }
  }

  cerrarSesion(){
    this.authService.isLogOut();
    this.router.navigate(['/login']);
  }

  noPositivoNegativo(event: any) {
    if (event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  evitarPegarSignos(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (pastedText.includes('-') || pastedText.includes('+')) {
      event.preventDefault();
    }
  }

  confirmarPedido(){
    this.mostrarCarga=true;
    this.datosCabecera = {
      id_orden_pedido_cabecera: 0,
      rut_empresa: this.empresa.rut_empresa,
      rut_usuario: this.usuario.rut_usuario,
      fecha_emision: new Date(),
      estado_seguimiento: 'PENR',
      rut_autoriza: null,
      hora_fecha_autoriza: null,
      observaciones_solicitante: null,
      observaciones_jefe_area: null,
      pedidoDetalle: this.agregarDetalle(),
    }
    this.pedidoDetalleService.generarPedidoDetalle(this.datosCabecera).subscribe({
      next: (data)=>{
        this.pedidosDetalleUsuario = data as PedidoDetalle[];
        alert("Orden de pedido generada exitósamente");
        this.productosSeleccionados = [];
        this.productosPorCategoria = [];
        this.navCrearPedido();
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
        this.listarProductos();
        this.navegacion = '';
        this.categoriaActiva = "";
        this.mostrarCarga = false;
      },
      error:(error)=>{
        console.log("error al insertar los detalles. Error: ", error);
        alert("error al insertar los detalles. Error: " + error);
      }
    });
  }

  agregarDetalle():PedidoDetalle[]{
    const pedidoDetalles: PedidoDetalle[] = [];
    this.productosSeleccionados.forEach((productoSeleccionado) => {
      const pedidoDetalle: PedidoDetalle = {
        id_orden_pedido_detalle: 0,
        id_producto: productoSeleccionado.id_producto,
        cantidad_solicitada: productoSeleccionado.cantidad,
        cantidad_comprada: null,
        cantidad_recepcionada: null,
        estado_seguimiento_producto: null,
        id_orden_pedido_cabecera_fk: null
      };
      pedidoDetalles.push(pedidoDetalle);
    });
    return pedidoDetalles;
  }

  volver(){
    this.mostrarResumen = false;
    this.mostrarCategoriasProductos = true;
  }

  

  navCrearPedido() {
    this.mostrarTablaPedidos = false; // Ocultar la tabla de pedidos
    this.pedidoSeleccionado = null; // Reiniciar el pedido seleccionado
    this.mostrarCategoriasProductos = true; // Mostrar las categorías de productos
    this.mostrarPedidos = false; // Ocultar la vista de pedidos
    this.mostrarResumen = false; // Ocultar el resumen
    this.mostrarIndicatorCard = false; // Ocultar el indicador de tarjeta
    this.pestanaActiva = 'crearPedido'; // Activar la pestaña de crear pedido
    this.mostrarSolicitudesRecibidas = false; // Asegurarse de ocultar las solicitudes recibidas
  }
  
  

  navMisPedidos() {
    if (this.mostrarPedidos) {
      // Si ya se están mostrando los pedidos, ocultarlos
      this.mostrarPedidos = false;
      this.mostrarTablaPedidos = false;
      this.mostrarIndicatorCard = false;
      this.pestanaActiva = '';
      this.mostrarSolicitudesRecibidas = false; // Asegurarse de ocultar las solicitudes recibidas
    } else {
      // Si no se están mostrando los pedidos, mostrarlos y ocultar otros elementos
      this.mostrarPedidos = true;
      this.mostrarTablaPedidos = true; // Asegurarse de tener esta propiedad definida
      this.mostrarIndicatorCard = true; // Mostrar el indicador de tarjeta
      this.mostrarCategoriasProductos = false;
      this.mostrarResumen = false;
      this.pestanaActiva = 'misPedidos';
      this.mostrarSolicitudesRecibidas = false; // Asegurarse de ocultar las solicitudes recibidas
    }
  }
  
  navMisPedidosRecibidos() {
    if (this.mostrarSolicitudesRecibidas) {
      // Si ya se están mostrando las solicitudes recibidas, ocultarlas
      this.mostrarSolicitudesRecibidas = false;
      this.mostrarTablaPedidos = false; // Asegurarse de ocultar la tabla de pedidos
      this.mostrarIndicatorCard = false; // Asegurarse de ocultar el indicador de tarjeta
      this.pestanaActiva = ''; // Reiniciar la pestaña activa
    } else {
      // Si no se están mostrando las solicitudes recibidas, mostrarlas y ocultar otros elementos
      this.mostrarSolicitudesRecibidas = true;
      this.mostrarTablaPedidos = false; // Asegurarse de ocultar la tabla de pedidos
      this.mostrarIndicatorCard = true; // Mostrar el indicador de tarjeta
      this.mostrarCategoriasProductos = false; // Asegurarse de ocultar las categorías de productos
      this.mostrarResumen = false; // Asegurarse de ocultar el resumen
      this.pestanaActiva = 'misPedidosRecibidos'; // Activar la pestaña de pedidos recibidos
      this.mostrarPedidos = false; // Asegurarse de ocultar la vista de pedidos
    }
  }
  
  





filtrarPedidos(estado: string) {
  this.opcionSeleccionada = estado;
  if (estado === 'TODOS') {
    // Si el estado es 'TODOS', mostrar todos los pedidos sin filtrar
    this.pedidosFiltrados = this.misPedidos;
  } else {
    // Filtrar los pedidos según el estado seleccionado
    this.pedidosFiltrados = this.misPedidos.filter(pedido => pedido.descripcion_estado === estado);
  }
  // Establecer mostrarPedidos en true para mostrar los pedidos filtrados
  this.mostrarPedidos = true;
}



ocultarResumen() {
  this.mostrarResumen = false;
  this.navegacionPestana = false;
}


onKPISeleccionado(kpi: string) {
  console.log('Evento kpiSeleccionado emitido desde IndicatorCardComponent:', kpi);
  this.filtrarPedidosPorKPI(kpi); // Llamada al método para filtrar los pedidos por KPI
    // Establecer mostrarPedidos en true para mostrar los pedidos filtrados
}



  habilitarEliminar(detalle: any) {
    if (!this.eliminarHabilitado) {
      return;
    }
    this.trashFijo = detalle.producto?.nombre_producto;
    if(!this.eliminarDetallesPedido.includes(detalle))
    {
      detalle.cantidad_solicitada = 0;
      this.nombreEliminar=detalle.producto?.nombre_producto;
      this.eliminarDetallesPedido.push(detalle);
    }
    else
    {
      const detallesModificados = this.detallesIniciales.filter((d: any) => {
        const detalleOriginal = d;
        return detalle.id_orden_pedido_detalle === detalleOriginal.id_orden_pedido_detalle;
      });
      detalle.cantidad_solicitada = detallesModificados[0].cantidad_solicitada;
      const index = this.eliminarDetallesPedido.indexOf(detalle);
      if (index > -1) {
        this.eliminarDetallesPedido.splice(index, 1);
      }
    }
  }

  detalleEnListaEliminar(detalle: any): boolean {
    return this.eliminarDetallesPedido.includes(detalle);
  }

  habilitarEdicion(estadoSeguimiento: string, detalles: any) {
    if (estadoSeguimiento !== 'PENR') {
      return;
    }
    if (estadoSeguimiento === 'PENR') {
      this.editandoDetalle = true;
    }
    this.eliminarHabilitado = true;
  }

  actualizarPedido(pedido: any){
    this.mostrarCarga = true;
    const detallesModificados = pedido.detalles.filter((detalle: any, index: any) => {
      const detalleInicial = this.detallesIniciales[index];
      return detalle.cantidad_solicitada !== detalleInicial.cantidad_solicitada;
    });
    console.log(detallesModificados);
    this.editarPedidoService.actualizarPedido(detallesModificados).subscribe({
      next:(data)=>{
        console.log(data);
        alert('Pedidos actualizados correctamente');
        this.mostrarCarga = false;
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
      },
      error:(error)=>{
        console.log(error);
      }
    });
    this.tarjetaSeleccionada = -1;
    this.eliminarHabilitado = false;
    this.eliminarDetallesPedido = [];
    this.editandoDetalle = false
  }

  anularPedido(id_orden_pedido_cabecera: number){
    this.mostrarCarga = true;
    this.anularPedidoService.anularPedido(id_orden_pedido_cabecera).subscribe({
      next:(data)=>{
        console.log(data);
        alert('Pedido anulado correctamente');
        this.mostrarCarga = false;
        this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
      },
      error:(error)=>
      {
        console.log(error);
        alert('Error al anular pedido: ' + error);
      },
    });
          this.filtrarPedidos(this.opcionSeleccionada);
    this.eliminarHabilitado = false;
    this.eliminarDetallesPedido = [];
    this.editandoDetalle = false;
    this.tarjetaSeleccionada = -1;
  }

  cancelar(){
    this.listarMisPedidos(this.usuario.rut_usuario, this.usuario.cod_rol);
    this.opcionSecundaria = '';
    this.eliminarHabilitado = false;
    this.eliminarDetallesPedido = [];
    this.editandoDetalle = false;
  }

  onMostrarMisSolicitudes(mostrar: boolean) {
    this.mostrarMisSolicitudes = mostrar;
    
  }

  toggleVisibilidad(pestana: string) {
    this.pestanaActiva = this.pestanaActiva === pestana ? '' : pestana;
  }


  mostrarMisPedidosFunc() {
    this.mostrarMisSolicitudes = true;
    this.mostrarListaPedidos = false;
    this.navegacionPestana = true;
  }

  seleccionarKPI(kpi: string) {
    // Lógica para seleccionar KPIs y mostrar la tabla de pedidos si es necesario
    this.mostrarTablaPedidos = true;
  } 
  
}