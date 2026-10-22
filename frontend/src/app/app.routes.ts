import { Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './guards/auth.guard';
import { Cadastro } from './pages/cadastro/cadastro';
import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Anotacoes } from './pages/anotacoes/anotacoes';
import { AnotacaoDetalhe } from './pages/anotacao-detalhe/anotacao-detalhe';
import { NovaAnotacao } from './pages/nova-anotacao/nova-anotacao';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [visitanteGuard] },
  { path: 'cadastro', component: Cadastro, canActivate: [visitanteGuard] },
  { path: 'inicio', component: Inicio, canActivate: [authGuard] },
  { path: 'anotacoes', component: Anotacoes, canActivate: [authGuard] },
  { path: 'anotacoes/nova', component: NovaAnotacao, canActivate: [authGuard] },
  { path: 'anotacoes/:id/editar', component: NovaAnotacao, canActivate: [authGuard] },
  { path: 'anotacoes/:id', component: AnotacaoDetalhe, canActivate: [authGuard] },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
