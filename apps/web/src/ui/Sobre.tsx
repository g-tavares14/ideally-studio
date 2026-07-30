import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cor as paleta, eyebrow, fonte } from '../styles/tokens';
import BrandLogo from './BrandLogo';

const bloco: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  borderTop: `1px solid ${paleta.linhaEscura}`,
  paddingTop: 18,
};

const rotulo: CSSProperties = { ...eyebrow('0.22em'), color: paleta.textoEscuro };

const corpo: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.75,
  color: paleta.textoEscuro,
  maxWidth: 460,
};

export default function Sobre() {
  return (
    <div
      className="cf-about"
      style={{
        position: 'absolute',
        inset: 0,
        background: paleta.tinta,
        color: paleta.creme,
        zIndex: 70,
        overflowY: 'auto',
        padding: '32px 40px 60px',
        animation: 'cfFade 0.35s ease both',
      }}
    >
      <Link
        className="cf-h-cream"
        href="/"
        style={{
          display: 'inline-block',
          fontSize: 12,
          letterSpacing: '0.06em',
          color: paleta.textoEscuro,
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        ← Fechar
      </Link>

      <div
        className="cf-about__grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 80,
          maxWidth: 1180,
          margin: '60px auto 0',
        }}
      >
        <div>
          <div
            style={{
              width: 'fit-content',
              maxWidth: '100%',
              marginBottom: 42,
              padding: '16px 18px',
              borderRadius: 10,
              background: paleta.creme,
            }}
          >
            <BrandLogo variante="completa" />
          </div>
          <div
            className="cf-about__title"
            style={{
              fontFamily: fonte.serif,
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
            }}
          >
            Uma peça só existe
            <br />
            quando alguém
            <br />
            <span style={{ color: paleta.laranja }}>a encomenda.</span>
          </div>
          <div className="cf-pretty" style={{ ...corpo, marginTop: 30 }}>
            A Ideally Studio 3D transforma ideias em objetos por meio da fabricação aditiva. Não
            mantemos estoque: cada peça é impressa depois do pedido, na cor e na escala que você
            escolheu, e finalizada à mão — lixada, selada e assinada na base.
          </div>
          <div className="cf-pretty" style={{ ...corpo, marginTop: 18 }}>
            Trabalhamos com PLA de origem vegetal, resina cerâmica e deposição metálica. As sobras
            de material voltam para o processo.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 10 }}>
          <div style={bloco}>
            <div style={rotulo}>Ateliê</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>
              Rua Fidalga 402, Vila Madalena
              <br />
              São Paulo — visitas com agendamento
            </div>
          </div>
          <div style={bloco}>
            <div style={rotulo}>Contato</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>
              ola@criaforma.studio
              <br />
              +55 11 94002-8922
            </div>
          </div>
          <div style={bloco}>
            <div style={rotulo}>Encomendas especiais</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, color: paleta.textoEscuro }}>
              Projetos sob medida a partir de R$ 1.200, com prazo de quatro semanas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
