#!/bin/bash
set -e

echo "[7/7] Final security configurations..."

echo "$STUDENT_N" > /home/student/gradebook
chown student:student /home/student/gradebook
chmod 644 /home/student/gradebook

DEFAULT_USER=$(getent passwd 1000 | cut -d: -f1)
if [[ -n "$DEFAULT_USER" && \
      "$DEFAULT_USER" != "student" && \
      "$DEFAULT_USER" != "teacher" && \
      "$DEFAULT_USER" != "operator" && \
      "$DEFAULT_USER" != "app" ]]; then
  usermod -L "$DEFAULT_USER"
  usermod -s /sbin/nologin "$DEFAULT_USER"
  echo "User $DEFAULT_USER locked."
fi