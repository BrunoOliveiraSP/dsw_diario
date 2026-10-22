export interface Anotacao {
  id: number;
  titulo: string;
  descricao: string;
  inclusao: string;
  avaliacao: number;
}

export interface NovaAnotacao {
  titulo: string;
  descricao: string;
  avaliacao: number;
  inclusao?: string;
}
