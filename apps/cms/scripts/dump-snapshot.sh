#!/usr/bin/env bash
#
# Refreshes database/snapshot.sql from the production database.
# The snapshot holds personal data and is gitignored (*.sql) — never commit it.
#
# Production runs Postgres 18; the local `pg_dump` is older and refuses to dump a
# newer server, so we run pg_dump inside the `postgres:18-alpine` Docker image.
# The dump is piped through a filter that strips three PG18-only lines
# (\restrict / \unrestrict / SET transaction_timeout) so the snapshot replays
# cleanly into an older local server under `ON_ERROR_STOP=1`.
#
# Usage (from apps/cms):
#   REMOTE_DATABASE_URL='postgresql://user:pass@host:port/db' pnpm seed:dump
#
# The prod URL is intentionally NOT hardcoded — pass it via env so it stays out
# of the committed repo.
set -euo pipefail

if [[ -z "${REMOTE_DATABASE_URL:-}" ]]; then
  echo "Set REMOTE_DATABASE_URL to the production connection string, e.g.:" >&2
  echo "  REMOTE_DATABASE_URL='postgresql://user:pass@host:port/db' pnpm seed:dump" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
OUT="database/snapshot.sql"

echo "▶ Dumping production via postgres:18-alpine → ${OUT}"
docker run --rm -e REMOTE_DATABASE_URL="$REMOTE_DATABASE_URL" postgres:18-alpine \
  pg_dump "$REMOTE_DATABASE_URL" -F p --no-owner --no-privileges --no-acl \
  | grep -vE '^\\(un)?restrict |^SET transaction_timeout' \
  > "$OUT"

LINES=$(wc -l < "$OUT" | tr -d ' ')
echo "✓ Wrote ${OUT} (${LINES} lines). Restore locally with: pnpm seed:sql"
