terraform {
  required_version = ">= 1.9"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = ">= 4.8"
    }
    # Provider comunitário, patrocinado pelo Neon mas não oficial.
    # Vale saber antes de depender dele para algo crítico.
    neon = {
      source  = "kislerdm/neon"
      version = ">= 0.9"
    }
  }

  # O state carrega a connection string do banco: nunca no repositório.
  # Configure um backend remoto (Terraform Cloud tem plano gratuito) antes do
  # primeiro `apply` — `terraform init -backend-config=...`.
  #
  # backend "remote" {
  #   organization = "cria-forma"
  #   workspaces { name = "cria-forma-prod" }
  # }
}

provider "vercel" {
  # lido de VERCEL_API_TOKEN
}

provider "neon" {
  # lido de NEON_API_KEY
}
