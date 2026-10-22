// Funções para trabalhar com datas no horário local (sem converter para UTC)

function doisDigitos(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

// 2026-10-22
export function formatarData(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

// 2026-10-22T14:30:00
export function formatarDataHora(data: Date): string {
  return `${formatarData(data)}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}`;
}

export function diasAtras(dias: number): Date {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data;
}

// 14:30:00
export function horaAtual(): string {
  return formatarDataHora(new Date()).substring(11);
}
