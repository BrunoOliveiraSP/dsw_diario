import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Só deixa entrar nas páginas internas quem está logado
export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).estaLogado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};

// Quem já está logado não precisa ver login/cadastro
export const visitanteGuard: CanActivateFn = () => {
  if (!inject(AuthService).estaLogado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/inicio']);
};
