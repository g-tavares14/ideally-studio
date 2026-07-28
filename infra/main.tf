# Banco -----------------------------------------------------------------------

resource "neon_project" "principal" {
  name      = var.nome_projeto
  region_id = var.regiao_neon
  pg_version = var.versao_postgres

  # Escala a zero quando ocioso. É o que mantém o plano gratuito viável para um
  # site com tráfego esporádico.
  branch {
    name          = "main"
    database_name = "criaforma"
    role_name     = "criaforma_owner"
  }
}

# Branch separada para desenvolvimento e para as migrations. `prisma migrate dev`
# nunca deve apontar para a branch de produção.
resource "neon_branch" "desenvolvimento" {
  project_id = neon_project.principal.id
  parent_id  = neon_project.principal.branch.id
  name       = "desenvolvimento"
}

resource "neon_endpoint" "desenvolvimento" {
  project_id = neon_project.principal.id
  branch_id  = neon_branch.desenvolvimento.id
  type       = "read_write"
}

# Aplicação -------------------------------------------------------------------

resource "vercel_project" "web" {
  name      = var.nome_projeto
  framework = "nextjs"

  # O app não está na raiz do repositório.
  root_directory = "apps/web"

  git_repository = {
    type              = "github"
    repo              = var.repo_github
    production_branch = var.branch_producao
  }

  # Monorepo npm workspaces: o install precisa acontecer na raiz para que
  # @cria-forma/shared e @cria-forma/db sejam resolvidos.
  install_command = "npm install --workspaces --include-workspace-root"
}

resource "vercel_project_environment_variables" "web" {
  project_id = vercel_project.web.id

  variables = [
    {
      # A URL *pooled* do Neon: o adapter @prisma/adapter-neon existe para
      # aproveitar o pooler em ambiente serverless.
      key       = "DATABASE_URL"
      value     = neon_project.principal.connection_uri_pooler
      target    = ["production"]
      sensitive = true
    },
    {
      key       = "DATABASE_URL"
      value     = neon_endpoint.desenvolvimento.uri_pooler
      target    = ["preview"]
      sensitive = true
    },
  ]
}

resource "vercel_project_domain" "principal" {
  count      = var.dominio == "" ? 0 : 1
  project_id = vercel_project.web.id
  domain     = var.dominio
}
