export interface Cadastro {
  nome: string;
  email: string;
  senha: string;
}

export interface Login {
  email: string;
  senha: string;
}

export interface TokenResponse {
  token: string;
  tipo: string;
  expiraEmMinutos: number;
  nome: string;
}
