#!/bin/bash
set -e

echo "[3/7] Configuring MariaDB database..."

cat <<EOF > /etc/my.cnf.d/00-bind-address.cnf
[mariadb]
bind-address = 127.0.0.1
EOF

systemctl enable mariadb
systemctl restart mariadb

mysql -u root << 'EOF'
CREATE DATABASE IF NOT EXISTS mywebapp;
CREATE USER IF NOT EXISTS 'mywebapp'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mywebapp.* TO 'mywebapp'@'localhost';
FLUSH PRIVILEGES;
EOF