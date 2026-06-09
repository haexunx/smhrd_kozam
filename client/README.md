# 🐼 Kozam Frontend - React & Vite

Kozam 서비스의 사용자 인터페이스를 담당하는 프론트엔드 프로젝트입니다.
수면 모니터링, AI 코골이 판별을 위한 마이크 권한 제어 및 오디오 변환, 수면 히스토리 시각화 리포트를 제공합니다.

---

## 🏛️ 아키텍처: Feature-Sliced Design (FSD)

본 프로젝트는 코드의 확장성, 가독성 및 지속 가능한 유지보수를 위해 **FSD(Feature-Sliced Design) 아키텍처**를 채택했습니다. 
특히 의존성이 한 방향으로 흐르도록 정립하여 **순환 참조(Circular Dependency) 문제를 엄격하게 통제**하고 있습니다.

### 📐 의존성 원칙 (단방향 의존성)
* **상위 ➔ 하위** 레이어 임포트만 허용됩니다. (`app` ➔ `pages` ➔ `shared`)
* 하위 레이어(`shared`)는 상위 레이어(`pages`, `app`)의 모듈을 임포트할 수 없습니다.
* 모든 레이어의 폴더는 `index.js` (Public API)를 통해 필요한 모듈만 외부에 명시적으로 공유(export)하며, 내부 세그먼트의 결합을 캡슐화합니다.

---

## 📂 폴더 구조 및 세그먼트

```text
src/
├── app/                  # App 레이어: 앱의 시작점 및 전역 설정
│   ├── router/           # react-router-dom을 이용한 페이지 라우팅 설정
│   ├── store/            # 앱 전역에 필요한 Context Provider (AuthProvider, ModalProvider)
│   ├── styles/           # 전역 CSS 스타일셋 및 테마 설정
│   ├── App.jsx           # 라우터 및 글로벌 Provider 조립
│   └── main.jsx          # React 앱 엔트리 포인트
│
├── pages/                # Pages 레이어: 라우트와 매핑되는 주요 화면
│   ├── login/            # 로그인 화면
│   ├── my-page/          # 사용자 프로필 및 모니터링 경보 조건 설정
│   ├── sleeping-history/ # 지난 수면 기록 대시보드 리포트
│   └── snore-monitoring/ # 실시간 AI 코골이 감지 및 스마트 경보 모니터링 화면
│       # [페이지 내부 세그먼트 구조]
│       ├── api/          # 해당 페이지에서 사용하는 로컬 API 함수
│       ├── model/        # 상태 관리 커스텀 훅 및 설정값
│       ├── ui/           # 페이지의 화면 레이아웃 및 폼 컴포넌트
│       └── index.js      # Public API (진입점)
│
└── shared/               # Shared 레이어: 비즈니스 도메인에 비의존적인 공통 모듈
    ├── api/              # Axios 클라이언트(client.js), 비동기 헬퍼(useAsync.js), 공통 API 리퀘스터
    ├── assets/           # 폰트, 이미지, 사운드 등 정적 자원
    ├── lib/              # 공용 라이브러리 및 커스텀 훅
    │   ├── audio/        # 마이크 권한 탐색 및 Float32Array ➔ WAV 인코더
    │   ├── auth/         # 인증 관련 Context(AuthContext) 및 useAuth 훅 정의
    │   ├── modal/        # 모달 제어 관련 Context(ModalContext) 및 useModal 훅 정의
    │   └── time/         # 밀리초 ➔ 시간 포맷 변환 유틸
    └── ui/               # 범용 공통 UI 컴포넌트 (Modal, LoadingSpinner 등)
```

---

## 🚀 개발 및 실행 스크립트

프로젝트 루트 또는 `client/` 폴더로 이동한 후 아래 패키지 스크립트를 사용하여 실행합니다.

```bash
# 종속성 설치 (최초 1회)
npm install

# 1. 로컬 개발 서버 구동 (HMR 적용)
npm run dev # (또는 npm start)

# 2. 배포용 빌드 결과물 생성 (Vite Build)
npm run build

# 3. 코드 스타일 및 아키텍처 규칙 검사 (ESLint)
npm run lint

# 4. 빌드 결과물 로컬 프리뷰
npm run preview
```
