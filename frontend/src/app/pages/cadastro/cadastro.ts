import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.html'
})
export class Cadastro {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  enviando = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  cadastrar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toastr.warning('Preencha os campos corretamente.');
      return;
    }
    if (this.senha !== this.confirmarSenha) {
      this.toastr.warning('As senhas não conferem.');
      return;
    }

    this.enviando = true;
    this.auth.cadastrar({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.toastr.success('Conta criada! Agora é só entrar.');
        this.router.navigate(['/login']);
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.toastr.error(mensagemErro(erro, 'Não foi possível criar a conta.'));
      }
    });
  }
}
