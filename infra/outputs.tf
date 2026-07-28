output "projeto_vercel_id" {
  description = "Id do projeto na Vercel."
  value       = vercel_project.web.id
}

output "neon_projeto_id" {
  description = "Id do projeto no Neon."
  value       = neon_project.principal.id
}

output "database_url_desenvolvimento" {
  description = "Connection string da branch de desenvolvimento — use no .env local."
  value       = neon_endpoint.desenvolvimento.uri_pooler
  sensitive   = true
}
