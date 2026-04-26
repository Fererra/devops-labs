#!/bin/bash
set -e

echo "[1/4] Installing dependencies..."
apt-get update
apt-get install -y docker.io nginx mariadb-server

systemctl enable --now docker
usermod -aG docker vagrant

echo "[2/4] Configuring MariaDB..."
systemctl enable --now mariadb

mysql -u root << 'EOF'
CREATE DATABASE IF NOT EXISTS mywebapp;
CREATE USER IF NOT EXISTS 'mywebapp'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mywebapp.* TO 'mywebapp'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "[3/4] Configuring Nginx..."
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

echo "[4/4] Restarting services..."
nginx -t
systemctl restart nginx

echo "Target Node setup complete!"