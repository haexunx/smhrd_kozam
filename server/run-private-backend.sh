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
# - 호스트 OS(NCP 서버)의 환경 변수 값을 컨테이너에 다이렉트로 주입합니다.
# - 배포 디렉토리 내에 .env 텍스트 파일이 없어도 안전하게 기동됩니다.
echo "Running new backend container with host environment variables..."
docker run -d \
  -p 3000:3000 \
  -e DB_HOST \
  -e DB_PORT \
  -e DB_USER \
  -e DB_PASSWORD \
  -e DB_NAME \
  -e JWT_SECRET \
  -e LLM_API_KEY \
  -e RUN_AI_EMBEDDED \
  -e AI_SERVER_URL \
  --name kozam-backend-container \
  kozam-backend

echo "============================================="
echo " Backend deployment completed successfully!"
echo " Port: 3000"
echo "============================================="
