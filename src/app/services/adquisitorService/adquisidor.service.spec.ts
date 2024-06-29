import { TestBed } from '@angular/core/testing';

import { AdquisidorService } from './adquisidor.service';

describe('AdquisidorService', () => {
  let service: AdquisidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdquisidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
