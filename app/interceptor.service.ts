import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    let headers = new HttpHeaders();

    const authService = this.injector.get(AuthService);
    const contentType = 'application/json';

    if (req.body instanceof FormData) {
      headers = authService.isUserLoggedIn() ?
        headers
          .set('Authorization', 'Bearer ' + authService.getAccessToken())
          .set('Access-Control-Allow-Origin', '*')
        : headers.set('Access-Control-Allow-Origin', '*');
    } else {
      headers = authService.isUserLoggedIn() ?
        headers
          .set('Authorization', 'Bearer ' + authService.getAccessToken())
          .set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', contentType)
        : headers.set('Content-Type', contentType)
          .set('Access-Control-Allow-Origin', '*');
    }

    const clone = req.clone({
      headers
    });

    return next.handle(clone)
      .pipe(
        map(event => {
          return event;
        }),
        retry(1),
        catchError(this.handleError)
      );
  }
}
