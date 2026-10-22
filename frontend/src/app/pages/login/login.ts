import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  senha = '';
  enviando = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  entrar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toastr.warning('Informe e-mail e senha.');
      return;
    }

    this.enviando = true;
    this.auth.login({ email: this.email, senha: this.senha }).subscribe({
      next: resposta => {
        this.toastr.success(`Bem-vindo(a), ${resposta.nome}!`);
        this.router.navigate(['/inicio']);
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.toastr.error(mensagemErro(erro, 'Não foi possível entrar.'));
      }
    });
  }
}
