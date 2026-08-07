import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Sem StrictMode, deliberadamente. Em desenvolvimento ele monta cada efeito
  // duas vezes, o que aqui significaria dois contextos WebGL — o do editor e o
  // do renderer fora de tela das miniaturas. O Next liga por padrão, então
  // precisa sair explicitamente.
  reactStrictMode: false,

  // @cria-forma/shared exporta TypeScript direto, sem passo de build.
  transpilePackages: ['@cria-forma/shared'],
};

export default nextConfig;
