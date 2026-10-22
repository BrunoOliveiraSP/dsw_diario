import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AnotacaoService } from '../../services/anotacao.service';
import { Anotacao } from '../../models/anotacao';
import { Estrelas } from '../../components/estrelas/estrelas';
import { diasAtras, formatarData } from '../../services/datas';
import { mensagemErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-anotacoes',
  imports: [FormsModule, RouterLink, DatePipe, Estrelas],
  templateUrl: './anotacoes.html',
  styleUrl: './anotacoes.css'
})
export class Anotacoes implements OnInit {
  // filtros enviados para a API
  inicio = formatarData(diasAtras(30));
  fim = formatarData(new Date());

  // filtros aplicados na tela, sobre o resultado da API
  busca = '';
  avaliacaoMinima = 0;

  anotacoes: Anotacao[] = [];
  carregando = false;

  constructor(private anotacaoService: AnotacaoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(): void {
    if (!this.inicio || !this.fim) {
      this.toastr.warning('Informe a data inicial e a final.');
      return;
    }
    if (this.inicio > this.fim) {
      this.toastr.warning('A data inicial deve ser anterior à final.');
      return;
    }

    this.carregando = true;
    this.anotacaoService.porPeriodo(this.inicio, this.fim).subscribe({
      next: lista => {
        this.anotacoes = lista;
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando = false;
        this.toastr.error(mensagemErro(erro, 'Não foi possível carregar as anotações.'));
      }
    });
  }

  periodoRapido(dias: number): void {
    this.inicio = formatarData(diasAtras(dias));
    this.fim = formatarData(new Date());
    this.pesquisar();
  }

  limparFiltros(): void {
    this.busca = '';
    this.avaliacaoMinima = 0;
    this.periodoRapido(30);
  }

  filtradas(): Anotacao[] {
    const texto = this.busca.trim().toLowerCase();
    return this.anotacoes.filter(a =>
      a.avaliacao >= this.avaliacaoMinima &&
      (texto === '' || a.titulo.toLowerCase().includes(texto) || a.descricao.toLowerCase().includes(texto))
    );
  }
}
