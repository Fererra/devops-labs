#!/bin/bash
set -e

echo "[1/7] Installing required packages..."
dnf install -y nodejs npm mariadb-server nginx git curl
