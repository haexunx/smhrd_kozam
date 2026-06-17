#!/bin/bash
echo "============================================="
echo " Deploying Backend Server with Docker"
echo "============================================="

# 1. 스크립트가 존재하는 server 폴더로 이동
cd "$(dirname "$0")"

# 2. 기존 컨테이너 및 이미지 정리
echo "Cleaning up old container..."
docker stop kozam-backend-container 2>/dev/null || true
docker rm kozam-backend-container 2>/dev/null || true

# 3. 새 이미지 빌드 (현재 위치 '.' 기준 빌드)
echo "Building new backend Docker image..."
docker build -t kozam-backend .

# 4. 새 컨테이너 실행 (3000 포트)
# - 동일 폴더 내의 .env 파일에 적힌 환경 변수들(DB_HOST, JWT_SECRET, LLM_API_KEY 등)을 컨테이너에 자동 주입합니다.
echo "Running new backend container..."
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name kozam-backend-container \
  kozam-backend

echo "============================================="
echo " Backend deployment completed successfully!"
echo " Port: 3000"
echo "============================================="
