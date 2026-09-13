#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat >&2 <<'EOF'
Uso:
  SUPABASE_DB_URL='postgresql://...' ./scripts/restore-supabase-backup.sh ./backup_name.backup
  SUPABASE_DB_URL='postgresql://...' ./scripts/restore-supabase-backup.sh ./backup_name.backup.gz

La URL debe apuntar al proyecto nuevo de Supabase. No la guardes en el repositorio.
EOF
}

if [[ $# -ne 1 ]]; then
  usage
  exit 64
fi

backup_path=$1
database_url=${SUPABASE_DB_URL:-${DATABASE_URL:-}}

if [[ -z "$database_url" ]]; then
  echo "Falta SUPABASE_DB_URL (o DATABASE_URL)." >&2
  exit 64
fi

if [[ ! -f "$backup_path" ]]; then
  echo "No existe el archivo de respaldo: $backup_path" >&2
  exit 66
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql no está instalado o no está disponible en PATH." >&2
  exit 69
fi

temporary_backup=''
cleanup() {
  if [[ -n "$temporary_backup" ]]; then
    rm -f -- "$temporary_backup"
  fi
}
trap cleanup EXIT

if [[ "$backup_path" == *.gz ]]; then
  if ! command -v gzip >/dev/null 2>&1; then
    echo "gzip no está instalado o no está disponible en PATH." >&2
    exit 69
  fi

  temporary_backup=$(mktemp "${TMPDIR:-/tmp}/ximnanzas-backup.XXXXXX")
  gzip -cd -- "$backup_path" > "$temporary_backup"
  backup_path=$temporary_backup
fi

echo "Restaurando respaldo en el proyecto Supabase indicado..."
echo "Los errores de objetos que ya existen pueden ser esperados en un proyecto nuevo."
psql --no-password --dbname "$database_url" --file "$backup_path"
echo "Restauración finalizada."
