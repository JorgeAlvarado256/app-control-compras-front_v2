import { TestBed } from '@angular/core/testing';

import { EstadoPedidoService } from './estadoPedido.service';

describe('EstadoPedidoService', () => {
  let service: EstadoPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
