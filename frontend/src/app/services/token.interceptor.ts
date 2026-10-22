import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

// Envia o token em todas as requisições e trata erros comuns da API
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toastr = inject(ToastrService);

  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && token) {
        toastr.warning('Sua sessão expirou. Entre novamente.');
        auth.logout();
      } else if (erro.status === 0) {
        toastr.error('Não foi possível conectar à API.');
      }
      return throwError(() => erro);
    })
  );
};
