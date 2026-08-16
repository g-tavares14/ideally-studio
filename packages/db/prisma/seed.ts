import { CORES, MATERIAIS, PRODUTOS, TAMANHOS, formatarMedidaCm } from '@cria-forma/shared';
import { db } from '../src/index';
import { Categoria } from '../generated/client';

/**
 * Popula o banco a partir do catálogo semente do pacote compartilhado.
 *
 * É por isso que as constantes foram para `@cria-forma/shared` na primeira
 * fase: o mesmo módulo alimenta o site e o seed, sem duplicação.
 */

/** Reais inteiros (como a UI trabalha) para centavos (como o banco guarda). */
const emCentavos = (reais: number) => Math.round(reais * 100);

/** A string livre de `cat` para o enum. Acentos e caixa somem. */
const CATEGORIAS: Record<string, Categoria> = {
  Decoração: Categoria.DECORACAO,
  Mesa: Categoria.MESA,
  Utilitário: Categoria.UTILITARIO,
};

function categoriaDe(cat: string): Categoria {
  const c = CATEGORIAS[cat];
  if (!c) throw new Error(`Categoria sem correspondência no enum: ${cat}`);
  return c;
}

async function main() {
  for (const [i, p] of PRODUTOS.entries()) {
    const dados = {
      nome: p.nome,
      categoria: categoriaDe(p.cat),
      precoCent: emCentavos(p.preco),
      altura: formatarMedidaCm(p.alturaCm),
      prazo: p.prazo,
      desc: p.desc,
      ordem: i,
    };
    await db.produto.upsert({ where: { id: p.id }, create: { id: p.id, ...dados }, update: dados });
  }

  for (const [i, m] of MATERIAIS.entries()) {
    const dados = {
      nome: m.nome,
      deltaCent: emCentavos(m.delta),
      rough: m.rough,
      metal: m.metal,
      ordem: i,
    };
    await db.material.upsert({
      where: { id: m.id },
      create: { id: m.id, ...dados },
      update: dados,
    });
  }

  for (const [i, c] of CORES.entries()) {
    // as cores não têm id no domínio; o slug do nome serve e é estável
    const id = c.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const dados = { nome: c.nome, hex: c.hex, ordem: i };
    await db.cor.upsert({ where: { id }, create: { id, ...dados }, update: dados });
  }

  for (const [i, t] of TAMANHOS.entries()) {
    const dados = { nome: t.nome, cm: t.cm, mult: t.mult, fator: t.fator, ordem: i };
    await db.tamanho.upsert({ where: { id: t.id }, create: { id: t.id, ...dados }, update: dados });
  }

  const totais = {
    produtos: await db.produto.count(),
    materiais: await db.material.count(),
    cores: await db.cor.count(),
    tamanhos: await db.tamanho.count(),
  };
  console.log('Seed concluído:', totais);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
