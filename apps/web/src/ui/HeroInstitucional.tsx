'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

const ETAPAS = [
  {
    numero: '01',
    titulo: 'Intenção',
    descricao:
      'Começamos pela ideia: entendemos o uso, o gesto e o espaço que cada objeto precisa ocupar.',
    nota: 'forma com propósito',
  },
  {
    numero: '02',
    titulo: 'Fabricação',
    descricao:
      'A peça nasce camada por camada em nosso ateliê, somente depois que o pedido é confirmado.',
    nota: 'sem estoque · sob demanda',
  },
  {
    numero: '03',
    titulo: 'Acabamento',
    descricao:
      'Revisamos, lixamos, selamos e assinamos cada peça antes de ela seguir para a sua casa.',
    nota: 'feito em São Paulo',
  },
];

export default function HeroInstitucional() {
  const [etapaAtiva, setEtapaAtiva] = useState(0);
  const etapa = ETAPAS[etapaAtiva];

  return (
    <section className="cf-home-hero" aria-labelledby="cf-home-hero-title">
      <div className="cf-home-hero__copy">
        <div className="cf-home-hero__eyebrow">
          Ideally Studio 3D <span aria-hidden="true">·</span> Ateliê autoral em São Paulo
        </div>
        <h1 id="cf-home-hero-title">
          Do primeiro traço
          <br />
          <span>à peça.</span>
        </h1>
        <p>
          Criamos objetos com fabricação aditiva, combinando desenho, precisão e acabamento manual
          para transformar uma intenção em algo que permanece.
        </p>
        <div className="cf-home-hero__actions">
          <Link className="cf-home-hero__primary cf-h-cta" href="/catalogo">
            Explorar catálogo <span aria-hidden="true">↗</span>
          </Link>
          <Link className="cf-home-hero__secondary cf-h-underline" href="/sobre">
            Conhecer o ateliê
          </Link>
        </div>

        <div className="cf-home-hero__proofs" aria-label="Compromissos da Ideally Studio 3D">
          <div>
            <strong>sob demanda</strong>
            <span>sem excesso de estoque</span>
          </div>
          <div>
            <strong>produção local</strong>
            <span>feito em São Paulo</span>
          </div>
          <div>
            <strong>acabamento manual</strong>
            <span>cada peça revisada</span>
          </div>
        </div>
      </div>

      <div className="cf-home-hero__visual">
        <div
          className="cf-home-hero__process"
          aria-label="Processo de criação da Ideally Studio 3D"
        >
          <div className="cf-home-hero__process-header">
            <BrandLogo variante="completa" tema="escuro" style={{ width: 190 }} />
            <span>processo / 03</span>
          </div>

          <div className="cf-home-hero__process-body">
            <div className="cf-home-hero__process-shape" aria-hidden="true">
              <div className="cf-home-hero__process-ring cf-home-hero__process-ring--outer" />
              <div className="cf-home-hero__process-ring cf-home-hero__process-ring--inner" />
              <div className="cf-home-hero__process-block" />
              <span>{etapa.numero}</span>
            </div>

            <div
              id="cf-home-hero-process-panel"
              className="cf-home-hero__process-copy"
              role="tabpanel"
              aria-live="polite"
            >
              <div className="cf-home-hero__process-label">Etapa {etapa.numero} / 03</div>
              <h2>{etapa.titulo}</h2>
              <p>{etapa.descricao}</p>
              <div className="cf-home-hero__process-note">{etapa.nota}</div>
            </div>
          </div>

          <div
            className="cf-home-hero__steps"
            role="tablist"
            aria-label="Etapas do processo de criação"
          >
            {ETAPAS.map((item, indice) => (
              <button
                key={item.numero}
                type="button"
                role="tab"
                aria-selected={etapaAtiva === indice}
                aria-controls="cf-home-hero-process-panel"
                onClick={() => setEtapaAtiva(indice)}
              >
                <span>{item.numero}</span>
                <strong>{item.titulo}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="cf-home-hero__visual-note">
          <span>coleção sedimento / 2026</span>
          <span>objetos que ganham forma</span>
        </div>
      </div>

      <div className="cf-home-hero__footer" aria-hidden="true">
        <span>Ideally Studio 3D</span>
        <span>feito para durar</span>
      </div>
    </section>
  );
}
