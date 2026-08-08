# Modelos 3D locais

O protótipo administrativo grava modelos convertidos em `doc/modelos/` durante o
desenvolvimento local. Cada envio recebe um diretório próprio com o 3MF original,
o GLB convertido e seus metadados.

O conteúdo de `doc/modelos/` é temporário e ignorado pelo Git. Ele não é uma
fonte do catálogo, não participa do build e não deve ser usado como armazenamento
em produção.

## Uso

1. Execute `npm run dev` na raiz do monorepo.
2. Abra `http://localhost:3000/admin/produtos`.
3. Informe um nome e selecione um arquivo `.3mf`.
4. Aguarde a conversão para GLB e o armazenamento local.

A API fica em `http://localhost:3000/api/admin/modelos` e responde apenas em
desenvolvimento quando acessada por um hostname loopback. O diretório pode ser
substituído para testes com `LOCAL_MODEL_STORAGE_DIR`.

O protótipo aceita arquivos 3MF de até 25 MiB, GLBs de até 50 MiB e modelos com
até 1.000.000 de triângulos. A conversão acontece no navegador; a API valida as
assinaturas dos arquivos e os grava no disco.
