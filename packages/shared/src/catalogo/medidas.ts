/** Formata uma medida física para a vitrine: `24` → `"24 cm"`. */
export function formatarMedidaCm(cm: number): string {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(cm)} cm`;
}
