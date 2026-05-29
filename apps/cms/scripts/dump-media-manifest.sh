#!/usr/bin/env bash
# Regenerate src/seed/media-manifest.ts from the current upload library (files
# table). Run this after uploading new media so a fresh database (e.g. a new
# production deploy) can relink it from S3 without the local Documentation/ files.
#
# Usage: from apps/cms, with the dev DB running:  bash scripts/dump-media-manifest.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PW=$(grep '^DATABASE_PASSWORD=' .env | cut -d= -f2-)
USER=$(grep '^DATABASE_USERNAME=' .env | cut -d= -f2-)
HOST=$(grep '^DATABASE_HOST=' .env | cut -d= -f2-)
PORT=$(grep '^DATABASE_PORT=' .env | cut -d= -f2-)
NAME=$(grep '^DATABASE_NAME=' .env | cut -d= -f2-)
export PGPASSWORD="$PW"

RAW=$(mktemp)
psql -h "${HOST:-127.0.0.1}" -U "${USER:-postgres}" -d "${NAME:-damasaru}" -p "${PORT:-5432}" -tAc "
select json_agg(r) from (
  select name, alternative_text as \"alternativeText\", caption, width, height,
         formats, size, url, preview_url as \"previewUrl\",
         provider, provider_metadata as \"providerMetadata\", hash, ext, mime,
         coalesce(folder_path,'/') as \"folderPath\"
  from files order by name
) r" > "$RAW"

node -e '
const fs=require("fs");
const data=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
const header=`// AUTO-GENERATED — do not edit by hand.
// Snapshot of the Strapi upload library (files table) so a fresh database can
// relink media that already lives in S3, without the client Documentation/
// source files. Regenerate after uploading new media: bash scripts/dump-media-manifest.sh
//
// Each entry is created in plugin::upload.file by seedMediaLibrary() when a file
// with the same \`name\` does not yet exist; page/collection seeds then relink by name.

export interface MediaManifestEntry {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number | null
  height: number | null
  formats: Record<string, unknown> | null
  size: number | null
  url: string
  previewUrl: string | null
  provider: string
  providerMetadata: Record<string, unknown> | null
  hash: string
  ext: string
  mime: string
  folderPath: string
}

export const MEDIA_MANIFEST: MediaManifestEntry[] = `;
fs.writeFileSync("src/seed/media-manifest.ts", header + JSON.stringify(data,null,2) + "\n");
console.log(`wrote src/seed/media-manifest.ts (${data.length} entries)`);
' "$RAW"

rm -f "$RAW"
