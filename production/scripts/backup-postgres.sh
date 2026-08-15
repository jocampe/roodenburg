#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL must be set}"

backup_dir="${BACKUP_DIR:-/backups}"
mkdir -p "$backup_dir"
umask 077

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$backup_dir/lv-roodenburg-$timestamp.dump"

pg_dump \
  --dbname "$DATABASE_URL" \
  --format custom \
  --no-owner \
  --no-privileges \
  --file "$target"

pg_restore --list "$target" >/dev/null
sha256sum "$target" >"$target.sha256"

printf 'Database backup created: %s\n' "$target"
