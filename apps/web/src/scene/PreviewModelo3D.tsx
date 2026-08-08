'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PreviewModelo3DProps {
  url: string;
  nome: string;
}

/** Visualizador isolado para modelos derivados do upload administrativo. */
export default function PreviewModelo3D({ url, nome }: PreviewModelo3DProps) {
  const [urlCarregada, setUrlCarregada] = useState<string | null>(null);
  const aoCarregar = useCallback((urlPronta: string) => setUrlCarregada(urlPronta), []);

  return (
    <div className="cf-admin-modelos__preview" aria-label={`Pré-visualização de ${nome}`}>
      {urlCarregada !== url && (
        <p className="cf-admin-modelos__preview-status" role="status">
          Carregando visualização…
        </p>
      )}
      <Canvas camera={{ fov: 38, near: 0.01, far: 100, position: [3.2, 2.4, 4.2] }}>
        <color attach="background" args={['#e9eff7']} />
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        <directionalLight position={[-3, 2, -4]} intensity={0.8} />
        <Suspense fallback={null}>
          <Modelo url={url} aoCarregar={aoCarregar} />
        </Suspense>
        <OrbitControls makeDefault enableDamping target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

function Modelo({ url, aoCarregar }: { url: string; aoCarregar: (url: string) => void }) {
  const gltf = useLoader(GLTFLoader, url);
  const cena = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const caixa = new THREE.Box3().setFromObject(clone);
    const tamanho = caixa.getSize(new THREE.Vector3());
    const centro = caixa.getCenter(new THREE.Vector3());
    const maiorEixo = Math.max(tamanho.x, tamanho.y, tamanho.z);
    const escala = maiorEixo > 0 ? 2.5 / maiorEixo : 1;

    clone.position.copy(centro).multiplyScalar(-1);

    const grupo = new THREE.Group();
    grupo.scale.setScalar(escala);
    grupo.add(clone);
    return grupo;
  }, [gltf.scene]);

  useEffect(() => {
    aoCarregar(url);

    return () => {
      cena.traverse((objeto) => {
        if (!(objeto instanceof THREE.Mesh)) return;
        objeto.geometry.dispose();
        const materiais = Array.isArray(objeto.material) ? objeto.material : [objeto.material];
        materiais.forEach((material) => {
          for (const valor of Object.values(material)) {
            if (valor instanceof THREE.Texture) valor.dispose();
          }
          material.dispose();
        });
      });
      useLoader.clear(GLTFLoader, url);
    };
  }, [aoCarregar, cena, url]);

  return <primitive object={cena} />;
}
