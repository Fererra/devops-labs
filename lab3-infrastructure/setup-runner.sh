#!/bin/bash
apt-get update
apt-get install -y curl docker.io
systemctl enable --now docker
usermod -aG docker vagrant