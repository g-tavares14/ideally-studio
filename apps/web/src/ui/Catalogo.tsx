import Link from 'next/link';
import { BRL, FILTROS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { cor as paleta, fonte } from '../styles/tokens';

interface Props {
  produtos: Produto[];
  /** filtro ativo — um valor de FILTROS */
  filtro: string;
  escolherFiltro: (nome: string) => void;
  thumb: (id: string) => string;
  abrir: (produto: Produto) => void;
}

export default function Catalogo({ produtos, filtro, escolherFiltro, thumb, abrir }: Props) {
  const visiveis = produtos.filter((p) => filtro === 'Tudo' || p.cat === filtro);

  return (
    <section
      className="cf-catalog"
      style={{
        position: 'absolute',
        inset: 0,
        background: paleta.creme,
        zIndex: 30,
        overflowY: 'auto',
        padding: '32px 40px 60px',
        animation: 'cfFade 0.35s ease both',
      }}
      aria-labelledby="cf-catalog-title"
    >
      <div
        className="cf-catalog__heading"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 32,
          borderBottom: `1px solid ${paleta.linha}`,
          paddingBottom: 28,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
          <Link
            className="cf-h-ink"
            href="/"
            style={{
              fontSize: 12,
              letterSpacing: '0.06em',
              color: paleta.suave,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            ← Voltar ao início
          </Link>
          <div
            style={{
              color: paleta.suave,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Coleção Sedimento · objetos sob demanda
          </div>
          <h1
            id="cf-catalog-title"
            style={{
              margin: 0,
              fontFamily: fonte.serif,
              fontSize: 'clamp(42px, 5vw, 68px)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.98,
            }}
          >
            Escolha uma forma
            <br />
            <span style={{ color: paleta.laranja }}>para editar.</span>
          </h1>
          <p
            className="cf-pretty"
            style={{
              maxWidth: 520,
              margin: 0,
              color: paleta.texto,
              fontSize: 14.5,
              lineHeight: 1.65,
            }}
          >
            Cada modelo abaixo é produzido no nosso ateliê depois do pedido. Abra uma peça para
            girar o modelo e escolher acabamento, cor e escala.
          </p>
        </div>

        <div
          className="cf-catalog__manifesto"
          style={{
            display: 'flex',
            minWidth: 190,
            flexDirection: 'column',
            gap: 10,
            borderLeft: `1px solid ${paleta.linha}`,
            paddingLeft: 20,
            color: paleta.suave,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: paleta.azul, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Como funciona
          </span>
          <span>01 · escolha o modelo</span>
          <span>02 · edite a peça</span>
          <span>03 · encomende sob demanda</span>
        </div>
      </div>

      <div
        className="cf-catalog__toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          marginTop: 28,
        }}
      >
        <div style={{ color: paleta.suave, fontSize: 12 }}>
          {visiveis.length} {visiveis.length === 1 ? 'modelo disponível' : 'modelos disponíveis'}
        </div>
        <div className="cf-catalog__filters" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FILTROS.map((f) => {
            const ativo = filtro === f;
            return (
              <button
                key={f}
                type="button"
                className="cf-h-border-ink"
                onClick={() => escolherFiltro(f)}
                aria-pressed={ativo}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${paleta.linha}`,
                  borderRadius: 100,
                  color: ativo ? paleta.creme : paleta.tinta,
                  background: ativo ? paleta.tinta : 'transparent',
                  font: 'inherit',
                  fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="cf-catalog__grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '40px 30px',
          marginTop: 30,
        }}
      >
        {visiveis.map((item) => (
          <button
            key={item.id}
            type="button"
            className="cf-catalog__item"
            onClick={() => abrir(item)}
            aria-label={`Editar ${item.nome}`}
            style={{
              display: 'block',
              width: '100%',
              padding: 0,
              border: 0,
              color: paleta.tinta,
              background: 'transparent',
              font: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div
              className="cf-h-tile cf-catalog__preview"
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 3,
                background: paleta.ladrilho,
              }}
            >
              <img
                src={thumb(item.id) || undefined}
                alt={`Modelo 3D de ${item.nome}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <span
                className="cf-catalog__preview-label"
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  padding: '6px 9px',
                  border: `1px solid ${paleta.linha}`,
                  borderRadius: 100,
                  color: paleta.azul,
                  background: 'rgba(255, 248, 242, 0.78)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                modelo 3D
              </span>
              <span
                className="cf-catalog__preview-action"
                style={{
                  position: 'absolute',
                  right: 14,
                  bottom: 14,
                  padding: '7px 10px',
                  borderRadius: 100,
                  color: paleta.creme,
                  background: paleta.tinta,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                editar ↗
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 16,
                marginTop: 15,
              }}
            >
              <div style={{ fontFamily: fonte.serif, fontSize: 22 }}>{item.nome}</div>
              <div style={{ fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
                {BRL(item.preco)}
              </div>
            </div>
            <div style={{ marginTop: 4, color: paleta.suave, fontSize: 12 }}>
              {item.cat} · {item.altura}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
