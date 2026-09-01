import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError, Subject } from 'rxjs';

import { TokenInterceptor } from './token-interceptor';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { ConfigService } from 'src/app/services/config.service';

const TEST_URL = '/api/test';
const BEARER_PREFIX = 'Bearer ';
const API_ORIGIN = 'https://api.example.com';
const API_TEST_URL = `${API_ORIGIN}/api/test`;

// ---------------------------------------------------------------------------
// TEST-001 + AUTH-006 + AUTH-007: TokenInterceptor spec
// ---------------------------------------------------------------------------

describe('TokenInterceptor (TEST-001, AUTH-006, AUTH-007)', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;
  let configState: { API_LOCATION: string };

  beforeEach(() => {
    configState = { API_LOCATION: API_ORIGIN };

    keycloakSpy = jasmine.createSpyObj<KeycloakService>('KeycloakService', [
      'getToken',
      'refreshToken',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        { provide: KeycloakService, useValue: keycloakSpy },
        {
          provide: ConfigService,
          useValue: {
            get config() {
              return configState;
            },
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  describe('auth header injection', () => {
    it('should add an Authorization header that starts with Bearer when a token is available', () => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      http.get(API_TEST_URL).subscribe();

      const req = controller.expectOne(API_TEST_URL);
      const authHeader = req.request.headers.get('Authorization');
      expect(authHeader).not.toBeNull();
      expect(authHeader!.startsWith(BEARER_PREFIX)).toBeTrue();
      expect(authHeader).not.toBe(BEARER_PREFIX);
      req.flush({});
    });

    it('should add an Authorization header with empty token when no token is available', () => {
      keycloakSpy.getToken.and.returnValue(null as any);

      http.get(API_TEST_URL).subscribe();

      const req = controller.expectOne(API_TEST_URL);
      expect(req.request.headers.get('Authorization')).toBe(BEARER_PREFIX);
      req.flush({});
    });
  });

  describe('host allowlist (AUTH-007)', () => {
    it('should attach Bearer to requests targeting the configured API host (@R-28.1)', () => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      http.get(API_TEST_URL).subscribe();

      const req = controller.expectOne(API_TEST_URL);
      expect(req.request.headers.get('Authorization')).toBe(`${BEARER_PREFIX}sampletoken`);
      req.flush({});
    });

    it('should not attach Bearer to third-party hosts (@R-28.2)', () => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      http.get('https://evil.example.com/track').subscribe();

      const req = controller.expectOne('https://evil.example.com/track');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('non-401 error pass-through (AUTH-006 @R-27.2)', () => {
    it('should propagate a 500 error without calling refreshToken', done => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      http.get(API_TEST_URL).subscribe({
        next: () => fail('expected an error'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(500);
          expect(keycloakSpy.refreshToken).not.toHaveBeenCalled();
          done();
        },
      });

      const req = controller.expectOne(API_TEST_URL);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });

    it('should propagate a 403 error without calling refreshToken', done => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      http.get(API_TEST_URL).subscribe({
        next: () => fail('expected an error'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(403);
          expect(keycloakSpy.refreshToken).not.toHaveBeenCalled();
          done();
        },
      });

      const req = controller.expectOne(API_TEST_URL);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('401 response triggers refresh and retry (AUTH-006 @R-27.1)', () => {
    it('should call refreshToken once and retry the request on a 401 response', done => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);
      keycloakSpy.refreshToken.and.returnValue(of(null));

      http.get(API_TEST_URL).subscribe({
        next: data => {
          expect(data).toEqual({ ok: true });
          expect(keycloakSpy.refreshToken).toHaveBeenCalledTimes(1);
          expect(keycloakSpy.getToken).toHaveBeenCalledTimes(2);
          done();
        },
        error: () => fail('should not error'),
      });

      const firstReq = controller.expectOne(API_TEST_URL);
      expect(firstReq.request.headers.has('Authorization')).toBeTrue();
      firstReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      const retryReq = controller.expectOne(API_TEST_URL);
      expect(retryReq.request.headers.has('Authorization')).toBeTrue();
      retryReq.flush({ ok: true });
    });
  });

  describe('refresh failure propagates error', () => {
    it('should propagate the refresh error when token refresh fails on 401', done => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);
      const refreshError = new Error('refresh failed');
      keycloakSpy.refreshToken.and.returnValue(throwError(refreshError));

      http.get(API_TEST_URL).subscribe({
        next: () => fail('expected an error'),
        error: err => {
          expect(err).toBe(refreshError);
          expect(keycloakSpy.refreshToken).toHaveBeenCalledTimes(1);
          done();
        },
      });

      const req = controller.expectOne(API_TEST_URL);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('in-flight refresh concurrency', () => {
    it('should not call refreshToken a second time when a refresh is already in progress', done => {
      keycloakSpy.getToken.and.returnValue('sampletoken' as any);

      const refreshSubject = new Subject<null>();
      keycloakSpy.refreshToken.and.returnValue(refreshSubject.asObservable());

      let completedCount = 0;
      const finish = () => {
        completedCount++;
        if (completedCount === 2) {
          expect(keycloakSpy.refreshToken).toHaveBeenCalledTimes(1);
          done();
        }
      };

      http.get(`${API_ORIGIN}/api/a`).subscribe({ next: finish, error: () => fail() });
      http.get(`${API_ORIGIN}/api/b`).subscribe({ next: finish, error: () => fail() });

      const reqA = controller.expectOne(`${API_ORIGIN}/api/a`);
      reqA.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      const reqB = controller.expectOne(`${API_ORIGIN}/api/b`);
      reqB.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      refreshSubject.next(null);
      refreshSubject.complete();

      const retryA = controller.expectOne(`${API_ORIGIN}/api/a`);
      retryA.flush({ ok: true });

      const retryB = controller.expectOne(`${API_ORIGIN}/api/b`);
      retryB.flush({ ok: true });
    });
  });
});
