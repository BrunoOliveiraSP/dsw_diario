import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AnotacaoService } from '../../services/anotacao.service';
import { Anotacao } from '../../models/anotacao';
import { Estrelas } from '../../components/estrelas/estrelas';
import { mensagemErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-anotacao-detalhe',
  imports: [RouterLink, DatePipe, Estrelas],
  templateUrl: './anotacao-detalhe.html',
  styleUrl: './anotacao-detalhe.css'
})
export class AnotacaoDetalhe implements OnInit {
  anotacao: Anotacao | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anotacaoService: AnotacaoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.anotacaoService.buscarPorId(id).subscribe({
      next: anotacao => this.anotacao = anotacao,
      error: (erro: HttpErrorResponse) => {
        this.toastr.error(mensagemErro(erro, 'Anotação não encontrada.'));
        this.router.navigate(['/anotacoes']);
      }
    });
  }

  rotuloAvaliacao(nota: number): string {
    const rotulos = ['', 'Dia ruim', 'Dia fraco', 'Dia ok', 'Dia bom', 'Dia incrível'];
    return rotulos[nota] || '';
  }
}
