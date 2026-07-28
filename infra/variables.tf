variable "nome_projeto" {
  description = "Nome do projeto na Vercel e no Neon."
  type        = string
  default     = "cria-forma-studio"
}

variable "repo_github" {
  description = "Repositório que a Vercel observa, no formato org/repo."
  type        = string
  default     = "g-tavares14/cria-forma-studio"
}

variable "branch_producao" {
  description = "Branch que dispara o deploy de produção."
  type        = string
  default     = "main"
}

variable "regiao_neon" {
  description = "Região do Neon. Mantenha próxima da região das funções da Vercel."
  type        = string
  default     = "aws-us-east-2"
}

variable "versao_postgres" {
  description = "Versão maior do Postgres no Neon."
  type        = number
  default     = 17
}

variable "dominio" {
  description = "Domínio customizado. Vazio desliga o recurso."
  type        = string
  default     = ""
}
