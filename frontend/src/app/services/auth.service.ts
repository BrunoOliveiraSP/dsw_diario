import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { Cadastro, Login, TokenResponse } from '../models/conta';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  cadastrar(dados: Cadastro): Observable<any> {
    return this.http.post(`${API_URL}/auth/cadastro`, dados);
  }

  login(dados: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API_URL}/auth/login`, dados).pipe(
      tap(resposta => {
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('nome', resposta.nome);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getNome(): string {
    return localStorage.getItem('nome') || '';
  }

  estaLogado(): boolean {
    return this.getToken() != null;
  }
}
