#!/bin/bash
set -e

echo "[4/7] Preparing the web application..."

mkdir -p "$APP_DIR"

cp -r ./* "$APP_DIR/"

cd "$APP_DIR"

npm ci

npm run build

npm ci --omit=dev

chown -R app:app "$APP_DIR"

echo "Web application prepared successfully."