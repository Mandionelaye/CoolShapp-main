import { TestBed } from '@angular/core/testing';

import { CoolServiceService } from './cool-service.service';

describe('CoolServiceService', () => {
  let service: CoolServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoolServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
