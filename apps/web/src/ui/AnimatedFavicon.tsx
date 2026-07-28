'use client';

import { useEffect } from 'react';

const FPS = 12;
const TAMANHO = 64;

interface Ponto3D {
  x: number;
  y: number;
  z: number;
}

const vertices: Ponto3D[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

const arestas = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
] as const;

/** Favicon progressivo: o SVG em app/icon.svg continua sendo o fallback estático. */
export default function AnimatedFavicon() {
  useEffect(() => {
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = document.createElement('canvas');
    canvas.width = TAMANHO;
    canvas.height = TAMANHO;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = '32x32';
    link.dataset.ideallyAnimatedIcon = 'true';

    let quadro = 0;
    let ultimoTempo = -Infinity;
    let executando = false;
    let frameId = 0;

    const desenhar = (angulo: number) => {
      contexto.clearRect(0, 0, TAMANHO, TAMANHO);
      contexto.lineCap = 'round';
      contexto.lineJoin = 'round';
      contexto.lineWidth = 5;

      const cos = Math.cos(angulo);
      const sin = Math.sin(angulo);
      const projetados = vertices.map((ponto) => {
        const x = ponto.x * cos - ponto.z * sin;
        const z = ponto.x * sin + ponto.z * cos;
        const y = ponto.y * 0.86 - z * 0.42;
        return { x: 32 + x * 15, y: 32 + y * 15, z };
      });

      [...arestas]
        .sort(([a], [b]) => projetados[a].z - projetados[b].z)
        .forEach(([inicio, fim]) => {
          const a = projetados[inicio];
          const b = projetados[fim];
          contexto.beginPath();
          contexto.moveTo(a.x, a.y);
          contexto.lineTo(b.x, b.y);
          contexto.strokeStyle = (a.z + b.z) / 2 > 0.15 ? '#F36C21' : '#001E5A';
          contexto.globalAlpha = (a.z + b.z) / 2 < -0.8 ? 0.45 : 1;
          contexto.stroke();
        });
      contexto.globalAlpha = 1;
      link.href = canvas.toDataURL('image/png');
    };

    const animar = (tempo: number) => {
      if (!executando) return;
      if (tempo - ultimoTempo >= 1000 / FPS) {
        desenhar(quadro * 0.045);
        quadro += 1;
        ultimoTempo = tempo;
      }
      frameId = requestAnimationFrame(animar);
    };

    const parar = () => {
      executando = false;
      cancelAnimationFrame(frameId);
      link.remove();
    };

    const iniciar = () => {
      if (executando || movimentoReduzido.matches || document.hidden) return;
      executando = true;
      if (!link.isConnected) document.head.appendChild(link);
      frameId = requestAnimationFrame(animar);
    };

    const atualizarPreferencia = () => {
      if (movimentoReduzido.matches) parar();
      else iniciar();
    };

    const atualizarVisibilidade = () => {
      if (document.hidden) parar();
      else iniciar();
    };

    movimentoReduzido.addEventListener('change', atualizarPreferencia);
    document.addEventListener('visibilitychange', atualizarVisibilidade);
    iniciar();

    return () => {
      parar();
      movimentoReduzido.removeEventListener('change', atualizarPreferencia);
      document.removeEventListener('visibilitychange', atualizarVisibilidade);
    };
  }, []);

  return null;
}
