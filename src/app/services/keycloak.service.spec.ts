import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';
import { JwtUtil } from '../shared/utils/jwt-utils';
import { Constants } from '../shared/utils/constants';

describe('KeycloakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KeycloakService,
        ConfigService,
        LoggerService,
        ToastService,
        HttpClient,
        HttpHandler,
      ],
    });
  });

  // AUTH-001: PKCE S256 init
  describe('init() — PKCE (AUTH-001)', () => {
    it('should call Keycloak init with pkceMethod S256 for real auth', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'production',
      });

      const mockKeycloak = {
        onAuthSuccess: null,
        onAuthError: null,
        onAuthRefreshSuccess: null,
        onAuthRefreshError: null,
        onAuthLogout: null,
        onTokenExpired: null,
        init: jasmine.createSpy('init').and.returnValue(Promise.resolve(true)),
      };

      (window as any).Keycloak = jasmine.createSpy('Keycloak').and.returnValue(mockKeycloak);

      await keycloak.init();

      expect(mockKeycloak.init).toHaveBeenCalledWith(
        jasmine.objectContaining({ pkceMethod: 'S256' })
      );
    });

    it('should reject init when KEYCLOAK_CLIENT_ID is missing (AUTH-005)', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);
      const toastService = TestBed.get(ToastService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        ENVIRONMENT: 'production',
      });

      const keycloakCtor = jasmine.createSpy('Keycloak');
      (window as any).Keycloak = keycloakCtor;
      const toastSpy = spyOn(toastService, 'addMessage');

      await expectAsync(keycloak.init()).toBeRejectedWithError(
        'KEYCLOAK_CLIENT_ID is required'
      );

      expect(keycloakCtor).not.toHaveBeenCalled();
      expect(toastSpy).toHaveBeenCalled();
    });

    it('should pass configured KEYCLOAK_CLIENT_ID to adapter (AUTH-005)', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'attendance-and-revenue',
        ENVIRONMENT: 'production',
      });

      const mockKeycloak = {
        onAuthSuccess: null,
        onAuthError: null,
        onAuthRefreshSuccess: null,
        onAuthRefreshError: null,
        onAuthLogout: null,
        onTokenExpired: null,
        init: jasmine.createSpy('init').and.returnValue(Promise.resolve(true)),
      };

      const keycloakCtor = jasmine.createSpy('Keycloak').and.returnValue(mockKeycloak);
      (window as any).Keycloak = keycloakCtor;

      await keycloak.init();

      expect(keycloakCtor).toHaveBeenCalledWith(
        jasmine.objectContaining({ clientId: 'attendance-and-revenue' })
      );
    });

    it('should not call Keycloak init when local mock auth is active', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'local',
        LOCAL_MOCK_AUTH: true,
      });

      const mockKcInit = jasmine.createSpy('init').and.returnValue(Promise.resolve(true));
      (window as any).Keycloak = jasmine.createSpy('Keycloak').and.returnValue({ init: mockKcInit });

      await keycloak.init();

      expect(mockKcInit).not.toHaveBeenCalled();
    });

    it('should redirect to /login when onTokenExpired refresh fails (AUTH-004)', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);
      const assignSpy = spyOn(window.location, 'assign');

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'production',
      });

      const mockKeycloak = {
        onAuthSuccess: null,
        onAuthError: null,
        onAuthRefreshSuccess: null,
        onAuthRefreshError: null,
        onAuthLogout: null,
        onTokenExpired: null,
        updateToken: jasmine.createSpy('updateToken').and.returnValue(
          Promise.reject(new Error('refresh failed'))
        ),
        init: jasmine.createSpy('init').and.returnValue(Promise.resolve(true)),
      };

      (window as any).Keycloak = jasmine.createSpy('Keycloak').and.returnValue(mockKeycloak);

      await keycloak.init();

      mockKeycloak.onTokenExpired();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(assignSpy).toHaveBeenCalledWith('/login');
    });
  });

  // AUTH-002: verified token claims
  describe('getTokenClaims() — verified session (AUTH-002)', () => {
    const tokenParsed = {
      name: 'Verified User',
      idir_userid: 'IDIR123',
      resource_access: {
        'attendance-and-revenue': {
          roles: ['sysadmin', 'MOC1'],
        },
      },
    };

    it('should read tokenParsed on the real-auth path and not call JwtUtil.decodeToken', () => {
      const keycloak = TestBed.get(KeycloakService);
      const decodeSpy = spyOn(JwtUtil, 'decodeToken').and.callThrough();

      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'real-session-token',
        tokenParsed,
      };

      expect(keycloak.getTokenClaims()).toEqual(tokenParsed);
      expect(keycloak.isAdmin()).toBe(true);
      expect(keycloak.getWelcomeMessage()).toBe('Verified User');
      expect(keycloak.getIdpFromToken()).toBe('idir');
      expect(decodeSpy).not.toHaveBeenCalled();
    });

    it('should use JwtUtil.decodeToken for local mock auth claims', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);
      const decodeSpy = spyOn(JwtUtil, 'decodeToken').and.returnValue({
        name: 'Local Mock User',
        idir_userid: 'LOCALMOCK',
        resource_access: {
          'attendance-and-revenue': {
            roles: ['sysadmin'],
          },
        },
      });

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'local',
        LOCAL_MOCK_AUTH: true,
      });

      await keycloak.init();

      expect(keycloak.getTokenClaims()).toEqual(jasmine.objectContaining({ name: 'Local Mock User' }));
      expect(decodeSpy).toHaveBeenCalled();
      expect(keycloak.getWelcomeMessage()).toBe('Local Mock User');
    });
  });


  // AUTH-003: user-initiated logout
  describe('logout() — session termination (AUTH-003)', () => {
    it('should call keycloakAuth.logout with redirectUri for real auth', () => {
      const keycloak = TestBed.get(KeycloakService);
      const logoutSpy = jasmine.createSpy('logout');

      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'real-session-token',
        logout: logoutSpy,
      };

      keycloak.logout();

      expect(logoutSpy).toHaveBeenCalledWith({
        redirectUri: `${window.location.origin}/`,
      });
    });

    it('should clear local mock auth session and redirect home', async () => {
      const keycloak = TestBed.get(KeycloakService);
      const configService = TestBed.get(ConfigService);

      spyOnProperty(configService, 'config', 'get').and.returnValue({
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_URL: 'https://example.com/auth',
        KEYCLOAK_REALM: 'test-realm',
        KEYCLOAK_CLIENT_ID: 'test-client',
        ENVIRONMENT: 'local',
        LOCAL_MOCK_AUTH: true,
      });

      (window as any).Keycloak = jasmine.createSpy('Keycloak');

      await keycloak.init();

      expect(keycloak.isAuthenticated()).toBe(true);
      expect(sessionStorage.getItem('ar-local-mock-auth')).toBe('1');

      keycloak.logout();

      expect(sessionStorage.getItem('ar-local-mock-auth')).toBeNull();
      expect(sessionStorage.getItem(keycloak.LAST_IDP_AUTHENTICATED)).toBeNull();
      expect(keycloak.isAuthenticated()).toBe(false);
      expect(window.location.href).toBe('/');
    });
  });

  // AUTHZ-002: admin-only route enforcement (@R-14.1)
  describe('isAllowed() — admin-only routes (AUTHZ-002)', () => {
    function setTokenClaims(keycloak: KeycloakService, roles: string[]) {
      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'session-token',
        tokenParsed: {
          resource_access: {
            'attendance-and-revenue': { roles },
          },
        },
      };
    }

    it('should deny export-reports for non-admin users', () => {
      const keycloak = TestBed.get(KeycloakService);
      setTokenClaims(keycloak, ['MOC1']);

      expect(keycloak.isAllowed('export-reports')).toBe(false);
    });

    it('should deny review-data for non-admin users', () => {
      const keycloak = TestBed.get(KeycloakService);
      setTokenClaims(keycloak, ['MOC1']);

      expect(keycloak.isAllowed('review-data')).toBe(false);
    });

    it('should allow export-reports and review-data for sysadmin users', () => {
      const keycloak = TestBed.get(KeycloakService);
      setTokenClaims(keycloak, ['sysadmin', 'MOC1']);

      expect(keycloak.isAllowed('export-reports')).toBe(true);
      expect(keycloak.isAllowed('review-data')).toBe(true);
    });

    it('should allow non-admin routes for non-admin users', () => {
      const keycloak = TestBed.get(KeycloakService);
      setTokenClaims(keycloak, ['MOC1']);

      expect(keycloak.isAllowed('enter-data')).toBe(true);
    });

    it('should deny lock-records and manage-subareas for non-admin users', () => {
      const keycloak = TestBed.get(KeycloakService);
      setTokenClaims(keycloak, ['MOC1']);

      expect(keycloak.isAllowed('lock-records')).toBe(false);
      expect(keycloak.isAllowed('manage-subareas')).toBe(false);
    });
  });

  // AUTHZ-004: isAdmin uses centralized role constant
  describe('isAdmin() — ApplicationRoles.ADMIN constant (AUTHZ-004)', () => {
    it('should return true when token includes ApplicationRoles.ADMIN', () => {
      const keycloak = TestBed.get(KeycloakService);
      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'session-token',
        tokenParsed: {
          resource_access: {
            'attendance-and-revenue': {
              roles: [Constants.ApplicationRoles.ADMIN, 'MOC1'],
            },
          },
        },
      };

      expect(keycloak.isAdmin()).toBe(true);
    });

    it('should use Constants.ApplicationRoles.ADMIN not a hardcoded literal', () => {
      const keycloak = TestBed.get(KeycloakService);
      const adminRole = 'custom-admin-role';
      const originalAdmin = Constants.ApplicationRoles.ADMIN;

      Object.defineProperty(Constants.ApplicationRoles, 'ADMIN', {
        configurable: true,
        get: () => adminRole,
      });

      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'session-token',
        tokenParsed: {
          resource_access: {
            'attendance-and-revenue': { roles: [adminRole] },
          },
        },
      };

      expect(keycloak.isAdmin()).toBe(true);

      Object.defineProperty(Constants.ApplicationRoles, 'ADMIN', {
        configurable: true,
        value: originalAdmin,
        writable: true,
      });
    });
  });

  // AUTHZ-005: isAdmin optional chaining for missing roles
  describe('isAdmin() — missing roles (AUTHZ-005)', () => {
    it('should return false when resource_access has no roles property', () => {
      const keycloak = TestBed.get(KeycloakService);
      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'session-token',
        tokenParsed: {
          resource_access: {
            'attendance-and-revenue': {},
          },
        },
      };

      expect(() => keycloak.isAdmin()).not.toThrow();
      expect(keycloak.isAdmin()).toBe(false);
    });

    it('should return false when roles array is empty', () => {
      const keycloak = TestBed.get(KeycloakService);
      (keycloak as any).localMockAuth = false;
      (keycloak as any).keycloakAuth = {
        authenticated: true,
        token: 'session-token',
        tokenParsed: {
          resource_access: {
            'attendance-and-revenue': { roles: [] },
          },
        },
      };

      expect(keycloak.isAdmin()).toBe(false);
    });
  });

  it('idp should be `idir` if the token has an idir_userid property', () => {
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.returnValue('not-empty');
    (keycloak as any).localMockAuth = false;
    (keycloak as any).keycloakAuth = {
      tokenParsed: {
        idir_userid: '12345',
      },
    };
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('idir');
  });

  it('idp should be `bceid` if the token has an bceid_userid property', () => {
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.returnValue('not-empty');
    (keycloak as any).localMockAuth = false;
    (keycloak as any).keycloakAuth = {
      tokenParsed: {
        bceid_userid: '12345',
      },
    };
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bceid');
  });

  it('idp should be `bcsc` if the token does not match any known patterns', () => {
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.returnValue('not-empty');
    (keycloak as any).localMockAuth = false;
    (keycloak as any).keycloakAuth = {
      tokenParsed: {
        preferred_username: 'abc',
      },
    };
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bcsc');
  });
});
