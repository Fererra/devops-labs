#!/bin/bash
set -e

echo "[6/7] Configuring Nginx (Reverse Proxy)..."

cat <<EOF > /etc/nginx/conf.d/mywebapp.conf
server {
    listen 80;
    server_name _;

    location /health {
        deny all;
        return 404;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

setsebool -P httpd_can_network_connect 1

nginx -t

systemctl enable --now nginx
systemctl restart nginx