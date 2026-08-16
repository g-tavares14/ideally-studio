import { describe, expect, it } from 'vitest';
import { formatarMedidaCm } from './medidas';

describe('formatarMedidaCm', () => {
  it('formata inteiros sem casa decimal', () => {
    expect(formatarMedidaCm(24)).toBe('24 cm');
  });

  it('usa vírgula e uma casa no padrão brasileiro', () => {
    expect(formatarMedidaCm(18.72)).toBe('18,7 cm');
  });
});
