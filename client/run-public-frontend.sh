#!/bin/bash
echo "============================================="
echo " Deploying Frontend with Docker"
echo "============================================="

# 1. 기존 컨테이너 및 이미지 정리
echo "Cleaning up old container..."
docker stop kozam-client-container 2>/dev/null || true
docker rm kozam-client-container 2>/dev/null || true

# 2. 새 이미지 빌드 (스크립트가 client 폴더 내에 있으므로 현재 위치 '.' 기준 빌드)
echo "Building new frontend Docker image..."
docker build -t kozam-client .

# 3. 새 컨테이너 실행 (80 포트로 바인딩)
# - BACKEND_HOST 및 BACKEND_PORT 환경변수를 주입합니다.
# - 필요 시 BACKEND_HOST 값을 실제 백엔드 컨테이너명이나 IP 주소로 변경하여 실행하세요.
echo "Running new frontend container..."
docker run -d \
  -p 80:80 \
  -e BACKEND_HOST=10.0.2.6 \
  -e BACKEND_PORT=3000 \
  --name kozam-client-container \
  kozam-client

echo "============================================="
echo " Frontend deployment completed successfully!"
echo " Port: 80"
echo "============================================="
