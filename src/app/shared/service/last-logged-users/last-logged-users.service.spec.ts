/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LastLoggedUsersService } from './last-logged-users.service';

describe('Service: LastLoggedUsers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LastLoggedUsersService],
    });
  });

  it('should ...', inject(
    [LastLoggedUsersService],
    (service: LastLoggedUsersService) => {
      expect(service).toBeTruthy();
    }
  ));
});
