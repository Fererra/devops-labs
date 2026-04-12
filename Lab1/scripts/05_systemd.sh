#!/bin/bash
set -e

echo "[5/7] Configuring Systemd and Socket Activation..."

cat <<EOF > /etc/systemd/system/mywebapp.socket
[Unit]
Description=My Web Application Socket

[Socket]
ListenStream=127.0.0.1:5000
NoDelay=true

[Install]
WantedBy=sockets.target
EOF

cat <<EOF > /etc/systemd/system/mywebapp.service
[Unit]
Description=My Web Application
After=network.target mariadb.service

[Service]
Type=simple
User=app
WorkingDirectory=$APP_DIR

ExecStartPre=/usr/bin/node $APP_DIR/node_modules/typeorm/cli.js migration:run -d $APP_DIR/dist/database/data-source.js -- --db-host=127.0.0.1 --db-port=3306 --db-user=mywebapp --db-password=password --db-name=mywebapp

ExecStart=/usr/bin/node $APP_DIR/dist/main.js --db-host=127.0.0.1 --db-port=3306 --db-user=mywebapp --db-password=password --db-name=mywebapp

Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl stop mywebapp.service || true
systemctl disable mywebapp.service || true
systemctl enable --now mywebapp.socket


sleep 2
if systemctl is-active --quiet mywebapp.socket; then
  echo "mywebapp.socket is running successfully."
else
  echo "✗ Error starting socket. Please check the logs for details:"
  journalctl -u mywebapp.socket -n 20
  exit 1
fi