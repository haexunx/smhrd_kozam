# 1. Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# 빌드 시점에 API 엔드포인트를 변경할 수 있도록 ARG 선언 (기본값 /api)
# 이 설정 덕분에 빌드 결과물은 상대 경로인 '/api'를 통해 백엔드와 통신하게 됩니다.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2. Production Stage
FROM nginx:alpine

# 백엔드 컨테이너의 호스트명과 포트 환경변수 기본값 설정
ENV BACKEND_HOST=server
ENV BACKEND_PORT=3000

# nginx 설정 템플릿 파일을 templates 폴더로 복사 (컨테이너 실행 시 default.conf로 자동 치환됨)
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
