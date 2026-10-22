import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AnotacaoService } from '../../services/anotacao.service';
import { NovaAnotacao as DadosAnotacao } from '../../models/anotacao';
import { Estrelas } from '../../components/estrelas/estrelas';
import { formatarData, horaAtual } from '../../services/datas';
import { mensagemErro } from '../../services/mensagem-erro';

// Usada para criar (/anotacoes/nova) e para editar (/anotacoes/:id/editar)
@Component({
  selector: 'app-nova-anotacao',
  imports: [FormsModule, RouterLink, Estrelas],
  templateUrl: './nova-anotacao.html',
  styleUrl: './nova-anotacao.css'
})
export class NovaAnotacao implements OnInit {
  titulo = '';
  descricao = '';
  avaliacao = 0;
  enviando = false;

  // datas no formato yyyy-MM-dd; só é permitido hoje ou dias anteriores
  hoje = formatarData(new Date());
  data = this.hoje;

  // edição
  id: number | null = null;
  dataOriginal = '';
  carregando = false;

  constructor(
    private route: ActivatedRoute,
    private anotacaoService: AnotacaoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.carregar();
    }
  }

  carregar(): void {
    this.carregando = true;
    this.anotacaoService.buscarPorId(this.id!).subscribe({
      next: anotacao => {
        this.titulo = anotacao.titulo;
        this.descricao = anotacao.descricao;
        this.avaliacao = anotacao.avaliacao;
        this.dataOriginal = anotacao.inclusao.substring(0, 10);
        this.data = this.dataOriginal;
        this.carregando = false;
      },
      error: (erro: HttpErrorResponse) => {
        this.toastr.error(mensagemErro(erro, 'Anotação não encontrada.'));
        this.router.navigate(['/anotacoes']);
      }
    });
  }

  salvar(form: NgForm): void {
    if (form.invalid || this.avaliacao === 0) {
      form.control.markAllAsTouched();
      this.toastr.warning('Preencha data, título, texto e avaliação.');
      return;
    }
    if (this.data > this.hoje) {
      this.toastr.warning('A data não pode ser futura.');
      return;
    }

    const dados: DadosAnotacao = {
      titulo: this.titulo,
      descricao: this.descricao,
      avaliacao: this.avaliacao
    };
    // na edição, a data só é enviada se tiver mudado
    if (this.id == null || this.data !== this.dataOriginal) {
      dados.inclusao = `${this.data}T${horaAtual()}`;
    }

    const requisicao = this.id == null
      ? this.anotacaoService.inserir(dados)
      : this.anotacaoService.atualizar(this.id, dados);

    this.enviando = true;
    requisicao.subscribe({
      next: anotacao => {
        this.toastr.success(this.id == null ? 'Anotação salva!' : 'Anotação atualizada!');
        this.router.navigate(['/anotacoes', anotacao.id]);
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.toastr.error(mensagemErro(erro, 'Não foi possível salvar a anotação.'));
      }
    });
  }
}
