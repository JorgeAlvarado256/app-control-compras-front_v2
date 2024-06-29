import { TestBed } from '@angular/core/testing';

import { PedidoCabeceraService } from './pedidoCabecera.service';

describe('PedidoCabeceraService', () => {
  let service: PedidoCabeceraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoCabeceraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
