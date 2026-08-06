import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function HeroInstitucional() {
  return (
    <section className="cf-home-hero" aria-labelledby="cf-home-hero-title">
      <div className="cf-home-hero__copy">
        <div className="cf-home-hero__eyebrow">
          Ateliê de fabricação aditiva <span aria-hidden="true">·</span> São Paulo
        </div>
        <h1 id="cf-home-hero-title">
          Ideias que ganham <span>forma.</span>
          <br />
          Objetos que ficam.
        </h1>
        <p>
          A Ideally Studio 3D transforma ideias em objetos produzidos sob demanda, camada por
          camada, e finalizados à mão no nosso ateliê.
        </p>
        <div className="cf-home-hero__actions">
          <Link className="cf-home-hero__primary cf-h-cta" href="#showroom">
            Explorar showroom <span aria-hidden="true">↗</span>
          </Link>
          <Link className="cf-home-hero__secondary cf-h-underline" href="/sobre">
            Conhecer o ateliê
          </Link>
        </div>
      </div>

      <div className="cf-home-hero__visual" aria-hidden="true">
        <div className="cf-home-hero__orbit cf-home-hero__orbit--outer" />
        <div className="cf-home-hero__orbit cf-home-hero__orbit--inner" />
        <div className="cf-home-hero__card">
          <BrandLogo variante="completa" tema="escuro" style={{ width: 236 }} />
          <div className="cf-home-hero__card-rule" />
          <div className="cf-home-hero__card-meta">
            <span>01</span>
            <span>forma em processo</span>
          </div>
        </div>
        <div className="cf-home-hero__note">
          <span>feito sob demanda</span>
          <span>sem estoque · com intenção</span>
        </div>
      </div>

      <div className="cf-home-hero__footer" aria-hidden="true">
        <span>Ideally Studio 3D</span>
        <span>01 — 04</span>
      </div>
    </section>
  );
}
