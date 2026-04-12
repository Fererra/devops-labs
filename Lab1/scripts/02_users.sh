#!/bin/bash
set -e

echo "[2/7] Creating users..."

if ! id "student" &>/dev/null; then
    useradd -m -G wheel student
    echo "student:12345678" | chpasswd
fi

if ! id "teacher" &>/dev/null; then
    useradd -m -G wheel teacher
    echo "teacher:12345678" | chpasswd
    chage -d 0 teacher
fi

echo "APP_DIR: $APP_DIR"

if ! id "app" &>/dev/null; then
    useradd -r -s /sbin/nologin -d "$APP_DIR" app
fi

if id "operator" &>/dev/null; then
    OPERATOR_UID=$(id -u operator)
    if [ "$OPERATOR_UID" -lt 1000 ]; then
        echo "Видаляємо вбудованого системного operator..."
        userdel operator
    fi
fi

if ! id "operator" &>/dev/null; then
    useradd -m -s /bin/bash operator
    echo "operator:12345678" | chpasswd
    chage -d 0 operator
fi

cat <<EOF > /etc/sudoers.d/operator
operator ALL=(ALL) NOPASSWD: \
    /usr/bin/systemctl start mywebapp.service, \
    /usr/bin/systemctl stop mywebapp.service, \
    /usr/bin/systemctl restart mywebapp.service, \
    /usr/bin/systemctl status mywebapp.service, \
    /usr/bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/operator