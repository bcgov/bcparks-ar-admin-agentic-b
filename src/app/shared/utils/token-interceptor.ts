import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { KeycloakService } from 'src/app/services/keycloak.service';

/**
 * Intercepts all http requests and allows for the request and/or response to be manipulated.
 *
 * @export
 * @class TokenInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;

  private tokenRefreshedSource = new Subject();
  private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor(
    private auth: KeycloakService,
    private configService: ConfigService
  ) {}

  /**
   * Main request intercept handler to automatically add the bearer auth token to allowed API requests.
   * If the auth token expires mid-request, the requests 401 response will be caught, the auth token will be
   * refreshed, and the request will be re-tried.
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError(err => {
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }

  /**
   * Fetches and adds the bearer auth token when the request host matches API_LOCATION.
   *
   * @private
   * @param {HttpRequest<any>} request to modify
   * @returns {HttpRequest<any>}
   * @memberof TokenInterceptor
   */
  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    if (!this.shouldAttachAuthHeader(request.url)) {
      return request;
    }

    const authToken: string = this.auth.getToken() || '';

    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + authToken },
    });
  }

  private shouldAttachAuthHeader(requestUrl: string): boolean {
    const apiLocation = this.configService.config?.['API_LOCATION'];

    if (!apiLocation) {
      return !this.isAbsoluteExternalUrl(requestUrl);
    }

    try {
      const allowedOrigin = new URL(apiLocation).origin;
      const requestOrigin = this.resolveRequestOrigin(requestUrl);
      return requestOrigin === allowedOrigin;
    } catch {
      return false;
    }
  }

  private isAbsoluteExternalUrl(url: string): boolean {
    if (!/^https?:\/\//i.test(url)) {
      return false;
    }

    try {
      return new URL(url).origin !== window.location.origin;
    } catch {
      return true;
    }
  }

  private resolveRequestOrigin(url: string): string {
    const resolved = /^https?:\/\//i.test(url)
      ? url
      : new URL(url, window.location.origin).href;
    return new URL(resolved).origin;
  }

  /**
   * Attempts to refresh the auth token.
   *
   * @private
   * @returns {Observable<any>}
   * @memberof TokenInterceptor
   */
  private refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.auth.refreshToken().pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next(1);
        })
      );
    }
  }
}
