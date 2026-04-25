#!/bin/bash
apt-get update
apt-get install -y docker.io nginx
systemctl enable --now docker
systemctl enable --now nginx
usermod -aG docker vagrant