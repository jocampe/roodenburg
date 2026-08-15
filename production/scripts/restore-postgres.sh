#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${BACKUP_FILE:?BACKUP_FILE must identify a dump under /backups}"

if [ "${ALLOW_DATABASE_RESTORE:-false}" != "true" ]; then
  printf '%s\n' 'Restore refused. Set ALLOW_DATABASE_RESTORE=true after confirming the target database.' >&2
  exit 2
fi

case "$BACKUP_FILE" in
  /backups/*.dump) ;;
  *)
    printf '%s\n' 'BACKUP_FILE must be an explicit .dump file under /backups.' >&2
    exit 2
    ;;
esac

if [ ! -f "$BACKUP_FILE" ]; then
  printf 'Backup not found: %s\n' "$BACKUP_FILE" >&2
  exit 2
fi

if [ -f "$BACKUP_FILE.sha256" ]; then
  sha256sum --check "$BACKUP_FILE.sha256"
fi

pg_restore --list "$BACKUP_FILE" >/dev/null
pg_restore \
  --dbname "$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  "$BACKUP_FILE"

printf 'Database restored from: %s\n' "$BACKUP_FILE"
