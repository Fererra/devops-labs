#!/bin/bash
set -e

echo "[1/5] Installing dependencies..."
apt-get update
apt-get install -y docker.io nginx mariadb-server

systemctl enable --now docker
usermod -aG docker vagrant

echo "[2/5] Configuring MariaDB..."
systemctl enable --now mariadb

mysql -u root << 'EOF'
CREATE DATABASE IF NOT EXISTS mywebapp;
CREATE USER IF NOT EXISTS 'mywebapp'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mywebapp.* TO 'mywebapp'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "[3/5] Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default

cat <<EOF > /etc/nginx/conf.d/mywebapp.conf
server {
    listen 80;
    server_name _;

    location /health {
        allow 192.168.121.0/24;
        allow 192.168.122.0/24;
        deny all;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

echo "[4/5] Creating Systemd Unit for NestJS..."
cat <<EOF > /etc/systemd/system/nestjs-app.service
[Unit]
Description=NestJS Application Container
After=docker.service mariadb.service
Requires=docker.service

[Service]
Restart=always
ExecStartPre=-/usr/bin/docker stop nestjs-app
ExecStartPre=-/usr/bin/docker rm nestjs-app
ExecStartPre=/usr/bin/docker pull ghcr.io/fererra/devops-labs:stable

ExecStartPre=/usr/bin/docker run --rm --network host \\
  -e DB_HOST=127.0.0.1 -e DB_PORT=3306 -e DB_USER=mywebapp -e DB_PASSWORD=password -e DB_NAME=mywebapp \\
  ghcr.io/fererra/devops-labs:stable node node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js

ExecStart=/usr/bin/docker run --name nestjs-app --network host \\
  -e PORT=3000 -e DB_HOST=127.0.0.1 -e DB_PORT=3306 -e DB_USER=mywebapp -e DB_PASSWORD=password -e DB_NAME=mywebapp \\
  ghcr.io/fererra/devops-labs:stable

ExecStop=/usr/bin/docker stop nestjs-app

[Install]
WantedBy=multi-user.target
EOF

echo "[5/5] Reloading and restarting services..."
nginx -t
systemctl restart nginx

systemctl daemon-reload

echo "Target Node setup complete!"