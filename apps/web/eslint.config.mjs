import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // A regra que mais rende num app cheio de useFrame e useMemo — é ela que
      // pega dependência faltando num efeito que a cena lê a cada quadro.
      'react-hooks/exhaustive-deps': 'error',

      // As miniaturas são data URLs geradas em runtime pelo WebGLRenderer;
      // next/image não tem o que otimizar nelas.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
