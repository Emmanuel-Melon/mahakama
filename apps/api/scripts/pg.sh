#!/usr/bin/env bash
#
# pg.sh
#
# Ensures the `vector` extension (pgvector) exists on the target Postgres
# database. Run this before `drizzle-kit push` / `drizzle-kit migrate`
# whenever pointing at a fresh database (new dev machine, CI, staging, prod).
#
# Usage:
#   ./scripts/pg.sh
#   DATABASE_URL="postgres://user:pass@host:5432/db" ./scripts/pg.sh
#
# Reads DATABASE_URL from the environment, or from apps/api/.env if present.
# CREATE EXTENSION requires superuser, so the script connects as the local
# postgres superuser (override with PG_SUPERUSER).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Try to pick up DATABASE_URL from apps/api/.env if it's not already set.
if [[ -z "${DATABASE_URL:-}" ]]; then
  ENV_FILE="$SCRIPT_DIR/../.env"
  if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC2046
    export $(grep -E '^DATABASE_URL=' "$ENV_FILE" | xargs)
  fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "error: DATABASE_URL is not set and could not be found in apps/api/.env" >&2
  echo "       set it inline: DATABASE_URL=postgres://... ./scripts/pg.sh" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "error: psql is not installed or not on PATH" >&2
  exit 1
fi

# Extract host, port, database name from DATABASE_URL for the superuser connection.
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:\/]*\).*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-postgres}"

# Superuser for CREATE EXTENSION (needs superuser privileges).
PG_SUPERUSER="${PG_SUPERUSER:-postgres}"

echo "Checking pgvector availability on target database..."

# First confirm the extension is even installed on the Postgres server
# (as opposed to just not enabled in this DB). This gives a clearer error
# than the raw 'type "vector" does not exist' from drizzle-kit.
AVAILABLE=$(psql "$DATABASE_URL" -tAc \
  "SELECT count(*) FROM pg_available_extensions WHERE name = 'vector';")

if [[ "$AVAILABLE" -eq 0 ]]; then
  echo "error: the 'vector' extension is not available on this Postgres server." >&2
  echo "       If local/Docker: use the pgvector/pgvector:pg<version> image instead of vanilla postgres." >&2
  echo "       If managed (RDS/etc): confirm the engine version/parameter group supports pgvector." >&2
  exit 1
fi

echo "Enabling pgvector extension (as $PG_SUPERUSER)..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$PG_SUPERUSER" -d "$DB_NAME" \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "pgvector is enabled. Safe to run drizzle-kit push/migrate now."