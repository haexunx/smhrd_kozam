# 1. Base Image
FROM node:20-slim

# 2. 시스템 패키지 설치
# - python3, pip, venv (가상환경)
# - libsndfile1 (오디오 처리 라이브러리 librosa의 필수 의존성)
# - build-essential (Python 패키지 컴파일용 컴파일러)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    libsndfile1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 5. 소스 코드 복사 (ai 폴더 전체)
COPY . .

# 6. Python 가상환경 생성 및 라이브러리 설치
RUN python3 -m venv .venv
RUN .venv/bin/pip install --upgrade pip
RUN .venv/bin/pip install -r requirements.txt

# 7. 포트 설정 및 실행
EXPOSE 5000

CMD ["node", "ai_server.js"]
