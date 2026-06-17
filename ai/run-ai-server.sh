#!/bin/bash
echo "============================================="
echo " Deploying AI Engine Server with Docker"
echo "============================================="

# 1. 스크립트가 존재하는 ai 폴더로 이동
cd "$(dirname "$0")"

# 2. 기존 컨테이너 및 이미지 정리
echo "Cleaning up old container..."
docker stop kozam-ai-container 2>/dev/null || true
docker rm kozam-ai-container 2>/dev/null || true

# 3. 새 이미지 빌드
echo "Building new AI server Docker image..."
docker build -t kozam-ai .

# 4. 새 컨테이너 실행 (5000 포트)
echo "Running new AI container..."
docker run -d \
  -p 5000:5000 \
  --name kozam-ai-container \
  kozam-ai

echo "============================================="
echo " AI Server deployment completed successfully!"
echo " Port: 5000"
echo "============================================="
