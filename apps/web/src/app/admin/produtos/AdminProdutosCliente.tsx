'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { Modelo3DComUrls } from '@/lib/modelos3d/contratos';
import { converter3mfParaGlb } from '@/lib/modelos3d/converter';
import { LIMITE_3MF_BYTES } from '@/lib/modelos3d/limites';
import PreviewModelo3D from '@/scene/PreviewModelo3D';

type Etapa = 'ocioso' | 'validando' | 'convertendo' | 'salvando' | 'sucesso' | 'erro';

const ROTULOS_ETAPA: Record<Exclude<Etapa, 'ocioso' | 'erro'>, string> = {
  validando: 'Validando arquivo…',
  convertendo: 'Convertendo 3MF para GLB…',
  salvando: 'Salvando os arquivos localmente…',
  sucesso: 'Modelo salvo em doc/modelos.',
};

export default function AdminProdutosCliente() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const operacaoRef = useRef<AbortController | null>(null);
  const urlTemporariaRef = useRef<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [etapa, setEtapa] = useState<Etapa>('ocioso');
  const [erro, setErro] = useState<string | null>(null);
  const [modelos, setModelos] = useState<Modelo3DComUrls[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [urlPreview, setUrlPreview] = useState<string | null>(null);
  const [nomePreview, setNomePreview] = useState('modelo 3D');

  const liberarPreviewTemporario = useCallback(() => {
    if (!urlTemporariaRef.current) return;
    URL.revokeObjectURL(urlTemporariaRef.current);
    urlTemporariaRef.current = null;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarModelos() {
      try {
        const resposta = await fetch('/api/admin/modelos', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error('Não foi possível listar os modelos locais.');
        setModelos((await resposta.json()) as Modelo3DComUrls[]);
      } catch (causa) {
        if (causa instanceof DOMException && causa.name === 'AbortError') return;
        setErro(causa instanceof Error ? causa.message : 'Falha ao carregar os modelos locais.');
      } finally {
        if (!controller.signal.aborted) setCarregandoLista(false);
      }
    }

    void carregarModelos();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialogAberto && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    if (!dialogAberto && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [dialogAberto]);

  useEffect(
    () => () => {
      operacaoRef.current?.abort();
      liberarPreviewTemporario();
    },
    [liberarPreviewTemporario],
  );

  const fecharDialog = useCallback(() => {
    operacaoRef.current?.abort();
    operacaoRef.current = null;
    setDialogAberto(false);
    setEtapa('ocioso');
    setErro(null);
  }, []);

  function abrirDialog() {
    setNome('');
    setArquivo(null);
    setEtapa('ocioso');
    setErro(null);
    setDialogAberto(true);
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEtapa('validando');

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return falhar('Informe um nome interno para o modelo.');
    if (!arquivo || !arquivo.name.toLowerCase().endsWith('.3mf')) {
      return falhar('Selecione um arquivo com extensão .3mf.');
    }
    if (arquivo.size === 0) return falhar('O arquivo 3MF está vazio.');
    if (arquivo.size > LIMITE_3MF_BYTES) return falhar('O arquivo 3MF excede o limite de 25 MiB.');

    const controller = new AbortController();
    operacaoRef.current?.abort();
    operacaoRef.current = controller;

    try {
      setEtapa('convertendo');
      const { arquivoGlb, triangulos } = await converter3mfParaGlb(arquivo);
      if (controller.signal.aborted) return;

      liberarPreviewTemporario();
      const bufferGlb = copiarArrayBuffer(arquivoGlb);
      const urlLocal = URL.createObjectURL(new Blob([bufferGlb], { type: 'model/gltf-binary' }));
      urlTemporariaRef.current = urlLocal;
      setUrlPreview(urlLocal);
      setNomePreview(nomeLimpo);

      const formulario = new FormData();
      formulario.set('nome', nomeLimpo);
      formulario.set(
        'arquivo3mf',
        new File([arquivo], arquivo.name, {
          type: 'model/3mf',
          lastModified: arquivo.lastModified,
        }),
      );
      formulario.set(
        'arquivoGlb',
        new File([bufferGlb], `${removerExtensao(arquivo.name)}.glb`, {
          type: 'model/gltf-binary',
        }),
      );
      formulario.set('triangulos', String(triangulos));

      setEtapa('salvando');
      const resposta = await fetch('/api/admin/modelos', {
        method: 'POST',
        body: formulario,
        signal: controller.signal,
      });
      if (!resposta.ok) throw new Error(await mensagemDaResposta(resposta));

      const salvo = (await resposta.json()) as Modelo3DComUrls;
      setModelos((atuais) => [salvo, ...atuais.filter((modelo) => modelo.id !== salvo.id)]);
      setEtapa('sucesso');
    } catch (causa) {
      if (causa instanceof DOMException && causa.name === 'AbortError') return;
      falhar(causa instanceof Error ? causa.message : 'Não foi possível processar o modelo.');
    } finally {
      if (operacaoRef.current === controller) operacaoRef.current = null;
    }
  }

  function falhar(mensagem: string) {
    setErro(mensagem);
    setEtapa('erro');
  }

  function visualizarModelo(modelo: Modelo3DComUrls) {
    liberarPreviewTemporario();
    setUrlPreview(modelo.urlGlb);
    setNomePreview(modelo.nome);
  }

  const processando = etapa === 'validando' || etapa === 'convertendo' || etapa === 'salvando';

  return (
    <section className="cf-admin-modelos">
      <header className="cf-admin-modelos__header">
        <div>
          <span className="cf-admin-modelos__eyebrow">Administração · protótipo</span>
          <h1>Modelos 3D locais</h1>
          <p>
            Converta arquivos 3MF em GLB para validar o fluxo. Nada nesta página é publicado no
            catálogo.
          </p>
        </div>
        <button className="cf-admin-modelos__primary" type="button" onClick={abrirDialog}>
          Adicionar produto 3D
        </button>
      </header>

      <aside className="cf-admin-modelos__notice" aria-label="Limitação do protótipo">
        <strong>Somente localhost</strong>
        <span>Os arquivos ficam em doc/modelos e não possuem autenticação ou publicação.</span>
      </aside>

      {erro && !dialogAberto && (
        <p className="cf-admin-modelos__error" role="alert">
          {erro}
        </p>
      )}

      <div className="cf-admin-modelos__workspace">
        <div className="cf-admin-modelos__list" aria-busy={carregandoLista}>
          <div className="cf-admin-modelos__section-heading">
            <h2>Arquivos armazenados</h2>
            <span>{modelos.length} modelos</span>
          </div>

          {carregandoLista ? (
            <p role="status">Carregando modelos locais…</p>
          ) : modelos.length === 0 ? (
            <div className="cf-admin-modelos__empty">
              <strong>Nenhum modelo armazenado</strong>
              <span>Adicione um arquivo 3MF para iniciar a validação.</span>
            </div>
          ) : (
            <ul>
              {modelos.map((modelo) => (
                <li key={modelo.id}>
                  <div>
                    <strong>{modelo.nome}</strong>
                    <span>{modelo.nomeArquivo}</span>
                    <small>
                      {formatarNumero(modelo.triangulos)} triângulos ·{' '}
                      {new Date(modelo.criadoEm).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                  <button type="button" onClick={() => visualizarModelo(modelo)}>
                    Visualizar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cf-admin-modelos__viewer">
          <div className="cf-admin-modelos__section-heading">
            <h2>Pré-visualização</h2>
            {urlPreview && <span>{nomePreview}</span>}
          </div>
          {urlPreview ? (
            <PreviewModelo3D url={urlPreview} nome={nomePreview} />
          ) : (
            <div className="cf-admin-modelos__preview-empty">
              Selecione um modelo armazenado ou converta um novo arquivo.
            </div>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="cf-admin-modelos__dialog"
        aria-labelledby="titulo-upload-modelo"
        onCancel={(evento) => {
          evento.preventDefault();
          fecharDialog();
        }}
        onClose={() => setDialogAberto(false)}
      >
        <form method="dialog" onSubmit={enviar}>
          <div className="cf-admin-modelos__dialog-heading">
            <div>
              <span className="cf-admin-modelos__eyebrow">Entrada de fabricação</span>
              <h2 id="titulo-upload-modelo">Adicionar produto 3D</h2>
            </div>
            <button type="button" aria-label="Fechar" onClick={fecharDialog}>
              ×
            </button>
          </div>

          <p className="cf-admin-modelos__dialog-copy">
            O 3MF original será preservado e uma cópia GLB será criada para visualização no site.
          </p>

          <label>
            Nome interno
            <input
              name="nome"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              disabled={processando}
              autoFocus
              required
            />
          </label>

          <label>
            Arquivo 3MF
            <input
              name="arquivo3mf"
              type="file"
              accept=".3mf,model/3mf"
              disabled={processando}
              onChange={(evento) => {
                setArquivo(evento.target.files?.[0] ?? null);
                setEtapa('ocioso');
                setErro(null);
              }}
              required
            />
          </label>

          {arquivo && (
            <p className="cf-admin-modelos__file">
              <strong>{arquivo.name}</strong>
              <span>{formatarBytes(arquivo.size)}</span>
            </p>
          )}

          {etapa !== 'ocioso' && etapa !== 'erro' && (
            <p className="cf-admin-modelos__status" role="status" aria-live="polite">
              {ROTULOS_ETAPA[etapa]}
            </p>
          )}
          {erro && dialogAberto && (
            <p className="cf-admin-modelos__error" role="alert">
              {erro}
            </p>
          )}

          <div className="cf-admin-modelos__dialog-actions">
            <button type="button" onClick={fecharDialog}>
              {processando ? 'Cancelar operação' : 'Cancelar'}
            </button>
            <button className="cf-admin-modelos__primary" type="submit" disabled={processando}>
              {processando
                ? 'Processando…'
                : etapa === 'erro'
                  ? 'Tentar novamente'
                  : 'Converter e salvar'}
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}

function removerExtensao(nome: string) {
  return nome.replace(/\.3mf$/i, '');
}

function copiarArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function formatarNumero(numero: number) {
  return new Intl.NumberFormat('pt-BR').format(numero);
}

function formatarBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MiB`;
}

async function mensagemDaResposta(resposta: Response) {
  try {
    const corpo = (await resposta.json()) as { erro?: string; error?: string };
    return corpo.erro ?? corpo.error ?? 'Não foi possível salvar o modelo localmente.';
  } catch {
    return 'Não foi possível salvar o modelo localmente.';
  }
}
