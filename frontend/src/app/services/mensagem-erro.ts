import { HttpErrorResponse } from '@angular/common/http';

// Monta uma mensagem legível a partir do erro retornado pela API
export function mensagemErro(erro: HttpErrorResponse, padrao: string): string {
  const corpo = erro.error;
  if (corpo?.campos) {
    return Object.values(corpo.campos).join('\n');
  }
  return corpo?.mensagem || padrao;
}
