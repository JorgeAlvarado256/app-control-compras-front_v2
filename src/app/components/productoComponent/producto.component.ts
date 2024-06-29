import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/productoService/producto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  productos: any[] = [];
  codigoCategoria!: number;

  constructor(private productoService: ProductoService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtiene el valor de codigoCategoria de la URL
    // this.route.params.subscribe(params => {
    //   this.codigoCategoria = Number(params['codigoCategoria']);
      const navigationState = window.history.state;
      if (navigationState && navigationState.codigoCategoria) {
        this.codigoCategoria = navigationState.codigoCategoria;
        // Haz lo que necesites con this.usuario
      }
      // Llama al servicio para obtener los productos y luego filtra por codigoCategoria
      this.productoService.listarProductos().subscribe({
        next:(data) => {
          this.productos = data.filter(producto => producto.codigo_categoria === this.codigoCategoria);
          if(!this.productos)
          {
            console.log("no existen productos para esta categoría")
          }
          if(this.productos.length<1)
          {
            console.log("no hay productos para esta categoría")
          }
        },
        error:(error) => {
          console.error('Error al listar productos', error);
        }
      });
    // });
  }
}