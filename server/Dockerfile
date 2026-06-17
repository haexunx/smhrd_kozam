# 1. Base Image
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 4. 소스 코드 복사 (server 폴더 내용물)
COPY . .

# 5. 포트 설정 및 실행
EXPOSE 3000

CMD ["npm", "start"]
