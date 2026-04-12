#!/bin/bash

set -e

if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run the script with sudo (sudo ./setup.sh)"
  exit 1
fi

export STUDENT_N="24" 
export APP_DIR="/opt/mywebapp"

cd /vagrant

echo "Starting Web Service deployment..."

./scripts/01_packages.sh
./scripts/02_users.sh
./scripts/03_database.sh
./scripts/04_app_setup.sh
./scripts/05_systemd.sh
./scripts/06_nginx.sh
./scripts/07_finalize.sh

echo "Deployment successfully completed! The system is ready to use."