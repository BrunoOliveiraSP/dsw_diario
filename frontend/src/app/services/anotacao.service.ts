import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Anotacao, NovaAnotacao } from '../models/anotacao';

@Injectable({ providedIn: 'root' })
export class AnotacaoService {

  private url = `${API_URL}/anotacoes`;

  constructor(private http: HttpClient) {}

  ultimas(quantidade: number): Observable<Anotacao[]> {
    return this.http.get<Anotacao[]>(`${this.url}/ultimas?quantidade=${quantidade}`);
  }

  porPeriodo(inicio: string, fim: string): Observable<Anotacao[]> {
    return this.http.get<Anotacao[]>(`${this.url}?inicio=${inicio}&fim=${fim}`);
  }

  buscarPorId(id: number): Observable<Anotacao> {
    return this.http.get<Anotacao>(`${this.url}/${id}`);
  }

  inserir(anotacao: NovaAnotacao): Observable<Anotacao> {
    return this.http.post<Anotacao>(this.url, anotacao);
  }

  atualizar(id: number, anotacao: NovaAnotacao): Observable<Anotacao> {
    return this.http.put<Anotacao>(`${this.url}/${id}`, anotacao);
  }
}
