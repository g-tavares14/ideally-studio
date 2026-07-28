# infra

Terraform que descreve a Vercel e o Neon.

## Estado atual

**Nunca foi aplicado.** Os arquivos foram escritos mas não passaram por
`terraform init`, `validate` ou `plan` — nenhum dos dois provedores foi
baixado, e não há Terraform instalado nesta máquina. Trate o conteúdo como um
ponto de partida a ser validado, não como algo em produção.

Aplicar exige credenciais que só você tem: um token da Vercel, uma chave de API
do Neon e contas nos dois serviços.

## Primeiro uso

```bash
export VERCEL_API_TOKEN=...   # vercel.com/account/tokens
export NEON_API_KEY=...       # console.neon.tech → Account settings → API keys

cd infra
terraform init
terraform validate
terraform plan
```

Confira o plano com atenção antes do primeiro `apply`: ele cria um projeto na
Vercel ligado ao repositório do GitHub, o que dispara deploys automáticos.

## Antes do primeiro apply

**Configure um backend remoto.** O state guarda a connection string do banco em
texto puro. O bloco `backend "remote"` está comentado em `providers.tf`; o plano
gratuito do Terraform Cloud dá conta. Enquanto ele estiver comentado, o state
fica em `terraform.tfstate` no disco — que **não** pode ser commitado.

## Custo

Zero nesta fase: Neon no plano gratuito (0,5 GB, scale-to-zero) e Vercel no
Hobby.

O Hobby, porém, é restrito a uso **não comercial**. Hoje o site não vende nada —
não há checkout nem pagamento —, então é um portfólio e está dentro dos termos.
No dia em que houver uma venda de verdade, o projeto precisa ir para o Pro
(US$ 20/assento/mês). Trate isso como o custo de entrada da operação comercial,
não como algo a contornar.

## Notas sobre os provedores

- `vercel/vercel` é o provider **oficial** da Vercel.
- `kislerdm/neon` é **comunitário**, patrocinado pelo Neon mas não mantido por
  eles. Vale saber antes de depender dele para algo crítico.

Os nomes de atributo dos recursos do Neon (`connection_uri_pooler`,
`uri_pooler`, a forma do bloco `branch`) foram escritos a partir da
documentação do provider e são o ponto mais provável de falhar no primeiro
`terraform validate`. Comece por eles se algo quebrar.
