import Link from 'next/link';
import { BRL } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';

interface Props {
  produtos: Produto[];
  thumb: (id: string) => string;
}

const PASSOS = [
  {
    num: '01',
    titulo: 'Gire em 3D',
    texto:
      'Toda peça do catálogo tem visualização interativa: gire, aproxime e veja o acabamento antes de encomendar.',
  },
  {
    num: '02',
    titulo: 'Escolha material, cor e tamanho',
    texto:
      'Três materiais, quatro cores e três tamanhos — o preço é recalculado na hora, direto no configurador.',
  },
  {
    num: '03',
    titulo: 'Produção sob encomenda',
    texto:
      'A peça só entra em produção depois do pedido confirmado — sem estoque — e sai do ateliê lixada, selada e assinada à mão.',
  },
];

// Depoimentos de exemplo, herdados do protótipo de design — substituir por
// avaliações reais de clientes antes de publicar.
const DEPOIMENTOS = [
  {
    texto:
      'Acompanhei a peça girando na tela antes de fechar o pedido — chegou exatamente como eu esperava.',
    nome: 'Marina Costa',
    local: 'São Paulo',
  },
  {
    texto: 'Encomendei um vaso na cor certa pro meu espaço e o acabamento feito à mão faz toda diferença.',
    nome: 'Rafael Lima',
    local: 'Curitiba',
  },
  {
    texto: 'Três peças em poucos dias, cada uma embalada com muito cuidado.',
    nome: 'Juliana Reis',
    local: 'Belo Horizonte',
  },
];

export default function HomeEditorial({ produtos, thumb }: Props) {
  const vitrine = produtos.slice(0, 3);
  const destaques = produtos.slice(0, 4);

  return (
    <section className="cf-home-editorial" aria-labelledby="cf-home-editorial-title">
      <div className="cf-home-editorial__inner">
        <div className="cf-home-editorial__hero">
          <div className="cf-home-editorial__eyebrow">
            <span>Coleção Sedimento</span>
            <span className="cf-home-editorial__eyebrow-line" aria-hidden="true" />
            <span>São Paulo</span>
          </div>

          <h1 id="cf-home-editorial-title" className="cf-home-editorial__title">
            Um catálogo
            <br />
            <em>para girar</em> na tela.
          </h1>

          <div className="cf-home-editorial__lede">
            <p className="cf-pretty">
              Objetos autorais produzidos por fabricação aditiva, sob encomenda, no nosso ateliê em
              São Paulo. Cada peça do catálogo pode ser vista em 3D, personalizada em material, cor
              e tamanho, e encomendada na hora.
            </p>
            <div className="cf-home-editorial__actions">
              <Link className="cf-home-editorial__cta cf-h-cta-invert" href="/catalogo">
                Ver o catálogo <span aria-hidden="true">↗</span>
              </Link>
              <a className="cf-home-editorial__cta-secondary cf-h-border-accent" href="#processo">
                Como fazemos
              </a>
            </div>
          </div>

          {vitrine.length > 0 && (
            <div className="cf-home-editorial__showcase reveal">
              {vitrine.map((p) => (
                <div className="cf-home-editorial__showcase-tile" key={p.id}>
                  <img src={thumb(p.id) || undefined} alt={`Peça ${p.nome}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <section
          className="cf-home-editorial__section"
          aria-labelledby="cf-home-editorial-catalogo"
        >
          <div className="cf-home-editorial__section-head reveal">
            <h2 id="cf-home-editorial-catalogo">O que está disponível agora</h2>
            <Link className="cf-h-underline" href="/catalogo">
              Catálogo completo →
            </Link>
          </div>
          <div className="cf-home-editorial__grid">
            {destaques.map((p) => (
              <Link key={p.id} className="cf-home-editorial__card reveal" href="/catalogo">
                <div className="cf-home-editorial__card-image">
                  <img src={thumb(p.id) || undefined} alt={`Modelo 3D de ${p.nome}`} />
                  <span className="cf-home-editorial__card-tag">{p.prazo}</span>
                </div>
                <div className="cf-home-editorial__card-row">
                  <span>{p.nome}</span>
                  <span className="cf-home-editorial__card-price">{BRL(p.preco)}</span>
                </div>
                <div className="cf-home-editorial__card-meta">
                  <span>{p.cat}</span>
                  <span>{p.altura}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="cf-home-editorial__process"
          id="processo"
          aria-labelledby="cf-home-editorial-processo"
        >
          <h2 id="cf-home-editorial-processo" className="reveal">
            Do clique no catálogo até a caixa na sua porta
          </h2>
          <div className="cf-home-editorial__process-grid">
            {PASSOS.map((s) => (
              <div className="cf-home-editorial__process-item reveal" key={s.num}>
                <div className="cf-home-editorial__process-num">{s.num}</div>
                <div className="cf-home-editorial__process-title">{s.titulo}</div>
                <div className="cf-home-editorial__process-text">{s.texto}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cf-home-editorial__quotes" aria-label="Depoimentos de clientes">
          {DEPOIMENTOS.map((d) => (
            <blockquote className="cf-home-editorial__quote reveal" key={d.nome}>
              <p>&ldquo;{d.texto}&rdquo;</p>
              <cite>
                {d.nome} — {d.local}
              </cite>
            </blockquote>
          ))}
        </section>

        <section className="cf-home-editorial__contact" aria-labelledby="cf-home-editorial-contato">
          <div>
            <h2 id="cf-home-editorial-contato">Fale com a gente</h2>
            <Link className="cf-home-editorial__cta cf-h-cta-invert" href="/catalogo">
              Ir para o catálogo
            </Link>
          </div>
          <div className="cf-home-editorial__contact-block">
            <span className="cf-home-editorial__contact-label">Ateliê</span>
            <span>Rua Fidalga 402, Vila Madalena</span>
            <span>São Paulo — visitas com agendamento</span>
          </div>
          <div className="cf-home-editorial__contact-block">
            <span className="cf-home-editorial__contact-label">Contato</span>
            <a href="mailto:ola@criaforma.studio">ola@criaforma.studio</a>
            <a href="tel:+5511940028922">+55 11 94002-8922</a>
          </div>
        </section>
      </div>
    </section>
  );
}
