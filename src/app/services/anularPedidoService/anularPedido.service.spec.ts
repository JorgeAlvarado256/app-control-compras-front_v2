import { TestBed } from '@angular/core/testing';

import { AnularPedidoService } from './anularPedido.service';

describe('AnularPedidoService', () => {
  let service: AnularPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnularPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
