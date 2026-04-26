#!/bin/bash
set -e

echo "[1/2] Installing dependencies..."
apt-get update
apt-get install -y curl docker.io jq

systemctl enable --now docker
usermod -aG docker vagrant

echo "[2/2] Preparing GitHub Runner directory..."
RUNNER_DIR="/home/vagrant/actions-runner"
mkdir -p $RUNNER_DIR
cd $RUNNER_DIR

curl -o actions-runner-linux-x64-2.334.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.334.0/actions-runner-linux-x64-2.334.0.tar.gz

tar xzf ./actions-runner-linux-x64-2.334.0.tar.gz

chown -R vagrant:vagrant $RUNNER_DIR

echo "✅ Runner environment prepared in $RUNNER_DIR"
echo "⚠️  Action Required: Login via SSH and manually run ./config.sh and ./svc.sh install"