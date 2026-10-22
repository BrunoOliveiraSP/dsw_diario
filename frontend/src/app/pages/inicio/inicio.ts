import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnotacaoService } from '../../services/anotacao.service';
import { Anotacao } from '../../models/anotacao';
import { Estrelas } from '../../components/estrelas/estrelas';
import { formatarData } from '../../services/datas';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, DatePipe, DecimalPipe, Estrelas],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  nome = '';
  hoje = new Date();
  ultimas: Anotacao[] = [];
  carregando = true;
  escreveuHoje = false;
  mediaAvaliacao = 0;

  constructor(private auth: AuthService, private anotacaoService: AnotacaoService) {}

  ngOnInit(): void {
    this.nome = this.auth.getNome();

    this.anotacaoService.ultimas(5).subscribe({
      next: lista => {
        this.ultimas = lista;
        this.carregando = false;
        this.calcularResumo();
      },
      error: () => this.carregando = false
    });
  }

  saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  private calcularResumo(): void {
    const hoje = formatarData(new Date());
    this.escreveuHoje = this.ultimas.some(a => a.inclusao.startsWith(hoje));

    if (this.ultimas.length > 0) {
      let soma = 0;
      for (const anotacao of this.ultimas) {
        soma += anotacao.avaliacao;
      }
      this.mediaAvaliacao = soma / this.ultimas.length;
    }
  }
}
