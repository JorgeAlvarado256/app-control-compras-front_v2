import { TestBed } from '@angular/core/testing';

import { PedidoDetalleService } from './pedidoDetalle.service';

describe('PedidoDetalleService', () => {
  let service: PedidoDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
