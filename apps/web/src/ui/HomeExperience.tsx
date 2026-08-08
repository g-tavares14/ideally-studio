'use client';

import { useProdutosCtx, useThumb } from '../app/contextos';
import HomeEditorial from './HomeEditorial';

export default function HomeExperience() {
  const produtos = useProdutosCtx();
  const thumb = useThumb();

  return <HomeEditorial produtos={produtos} thumb={thumb} />;
}
