
export function formatarValor(valor) {
    return (valor / 100).toLocaleString("pt-br", { minimumFractionDigits: 2 });
  }