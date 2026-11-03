#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp index.html styles.css app.js _headers dist/
printf 'Fortal Market: arquivos estaticos copiados para dist/\n'
