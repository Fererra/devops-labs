#!/bin/bash
set -e

source /home/vagrant/.env

echo "[1/5] Installing dependencies..."
apt-get update
apt-get install -y docker.io nginx mariadb-server

systemctl enable --now docker
usermod -aG docker vagrant

echo "[2/5] Configuring MariaDB..."
systemctl enable --now mariadb

mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
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
        
        proxy_pass http://127.0.0.1:5500;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:5500;
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

ExecStartPre=/usr/bin/docker run --rm --network host --entrypoint node ghcr.io/fererra/devops-labs:stable node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js -- --db-host=127.0.0.1 --db-port=3306 --db-user=${DB_USER} --db-password=${DB_PASSWORD} --db-name=${DB_NAME}
ExecStart=/usr/bin/docker run --name nestjs-app --network host --entrypoint node ghcr.io/fererra/devops-labs:stable dist/main.js --port=3000 --db-host=127.0.0.1 --db-port=3306 --db-user=${DB_USER} --db-password=${DB_PASSWORD} --db-name=${DB_NAME}
ExecStop=/usr/bin/docker stop nestjs-app

[Install]
WantedBy=multi-user.target
EOF

echo "[5/5] Reloading and restarting services..."
nginx -t
systemctl restart nginx

systemctl daemon-reload

echo "Target Node setup complete!"