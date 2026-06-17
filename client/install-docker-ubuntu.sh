#!/bin/bash
echo "============================================="
echo " Installing Docker on Ubuntu"
echo "============================================="

# 1. Docker 공식 편리한 스크립트로 Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. 현재 접속 사용자(보통 ubuntu 등)를 docker 그룹에 추가하여 sudo 없이 실행 가능하도록 설정
sudo usermod -aG docker $USER

# 3. 설치 확인
docker --version

echo "============================================="
echo " Docker Installation Complete!"
echo " IMPORTANT: Please reconnect/re-login to your SSH session"
echo " to apply user group changes (sudo-less docker commands)."
echo "============================================="
