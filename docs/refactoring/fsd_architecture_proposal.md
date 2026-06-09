# FSD (Feature-Sliced Design) 아키텍처 적용 제안

이 문서에서는 현재 `client/src` 아래의 코드를 **Feature-Sliced Design (FSD)** 아키텍처에 맞게 재구조화할 때의 폴더 및 파일 구조(Tree)와 매핑 가이드를 제안합니다.

---

## 1. FSD 핵심 레이어 개념 매핑

FSD 아키텍처는 코드를 6개의 계층(Layers)으로 나누고, 각 계층 내부에 슬라이스(Slices)와 세그먼트(Segments)를 두어 결합도를 낮추고 모듈성을 극대화합니다.

| 레이어 (Layer) | 설명 | 현재 프로젝트에서의 매핑 대상 |
| :--- | :--- | :--- |
| **`app`** | 애플리케이션 전체 설정, 전역 스타일, 프로바이더, 엔트리 포인트 | `main.jsx`, `App.jsx`, `App.css`, `index.css`, `layouts/AppWrapper` |
| **`pages`** | 라우트 단위의 화면 구성을 위한 레이어 (화면 그 자체) | `pages/Login`, `pages/MyPage`, `pages/SleepingHistory`, `pages/SnoreMonitoring` |
| **`widgets`** | 여러 피처와 엔티티를 조합해 만드는 독립적이고 완성도 높은 UI 영역 | `components/Header`, `pages/MyPage` 내 설정/정보 영역 결합체 등 |
| **`features`** | 사용자가 비즈니스적 가치를 느낄 수 있는 실제 상호작용/액션 (예: 로그인, 설정 변경, 모니터링 시작/종료) | `components/SnoreMonitoring/ActionButtonContent`, 설정 폼 변경 동작 |
| **`entities`** | 비즈니스 도메인 데이터 모델 및 핵심 비즈니스 로직 (User, History, Monitoring Session 등) | `api/`의 도메인별 API, `contexts/AuthContext`, `hooks/useAuth` 등 |
| **`shared`** | 비즈니스 로직에 종속되지 않는 재사용 가능한 컴포넌트, 공통 유틸리티, 라이브러리 | `components/Common` (Modal, Spinner), `components/InputField`, `utils/`, `hooks/useAsync` |

---

## 2. FSD 구조 트리 (Directory Tree)

기존 프로젝트의 파일들을 FSD에 맞게 재배치한 구조는 다음과 같습니다. 각 폴더는 해당 슬라이스의 외부 진입점인 `index.js` (또는 `index.jsx`)를 통해 필요한 모듈만 노출(Public API)시킵니다.

```text
client/src/
├── app/                              # 애플리케이션 초기화 및 전역 설정
│   ├── providers/                    # 전역 Context / Providers
│   │   ├── AuthProvider.jsx          # (구 contexts/AuthContext.jsx)
│   │   └── ModalProvider.jsx         # (구 contexts/ModalContext.jsx)
│   ├── router/                       # 라우팅 설정
│   │   ├── appRouter.jsx
│   │   └── ProtectedRoute.jsx        # (구 router/ProtectedRoute.jsx)
│   ├── styles/                       # 전역 CSS 스타일
│   │   ├── index.css
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
│
├── pages/                            # 라우트별 페이지 컴포넌트
│   ├── login/                        # 로그인 페이지
│   │   ├── ui/Login.jsx
│   │   ├── ui/Login.css
│   │   └── index.js
│   ├── my-page/                      # 마이페이지
│   │   ├── ui/MyPage.jsx
│   │   ├── ui/MyPage.css
│   │   └── index.js
│   ├── sleeping-history/             # 수면 히스토리 기록 페이지
│   │   ├── ui/SleepingHistory.jsx
│   │   ├── ui/SleepingHistory.module.css
│   │   └── index.js
│   └── snore-monitoring/             # 실시간 코골이 모니터링 페이지
│       ├── ui/SnoreMonitoring.jsx
│       ├── ui/SnoreMonitoring.module.css
│       └── index.js
│
├── widgets/                          # 피처와 엔티티를 조합한 독립적 UI 블록
│   ├── header/                       # 상단 헤더 영역
│   │   ├── ui/Header.jsx
│   │   ├── ui/Header.css
│   │   └── index.js
│   ├── monitoring-panel/             # 모니터링 상태 대시보드
│   │   ├── ui/MonitoringPanel.jsx    # 타이머, 차트 등을 묶은 대형 컴포넌트
│   │   └── index.js
│   └── history-list/                 # 수면 기록 목록 및 상세 정보 영역
│       ├── ui/HistoryList.jsx
│       └── index.js
│
├── features/                         # 비즈니스 가치가 있는 액션/상호작용 단위
│   ├── auth-by-login/                # 로그인 폼 & 계정 인증 액션
│   │   ├── ui/LoginForm.jsx
│   │   └── index.js
│   ├── edit-user-profile/            # 내 정보 변경 및 관리
│   │   ├── ui/UserInfoForm.jsx       # (구 pages/MyPage/UserInfo.jsx)
│   │   └── index.js
│   ├── configure-monitoring/         # 모니터링 경보 및 감도 설정
│   │   ├── ui/SettingForm.jsx        # (구 pages/MyPage/MonitoringSetting.jsx)
│   │   └── index.js
│   └── toggle-monitoring/            # 모니터링 시작/정지 제어
│       ├── ui/StartStopButton.jsx    # (구 components/SnoreMonitoring/ActionButtonContent.jsx)
│       └── index.js
│
├── entities/                         # 비즈니스 실체(Data Domain Model)
│   ├── user/                         # 사용자 정보 도메인
│   │   ├── api/userApi.js            # (구 api/user.js 및 auth.js 일부)
│   │   ├── model/useUser.js          # (구 hooks/useAuth.js 등 사용자 상태 관련)
│   │   └── index.js
│   ├── sleep/                        # 수면 기록 및 히스토리 데이터 도메인
│   │   ├── api/historyApi.js         # (구 api/history.js)
│   │   ├── ui/ReportModal.jsx        # (구 components/SleepingHistory/ReportSelectModal.jsx)
│   │   ├── ui/FeedbackModal.jsx      # (구 components/SleepingHistory/FeedbackDetailModal.jsx)
│   │   └── index.js
│   └── monitoring/                   # 코골이 모니터링 세션 데이터 도메인
│       ├── api/monitoringApi.js      # (구 api/monitoring.js)
│       ├── config/constants.js       # (구 constants/monitoring.js)
│       ├── model/useAlarm.js         # (구 hooks/SnoreMonitoring/useAlarm.js)
│       ├── model/useMonitoring.js    # (구 hooks/SnoreMonitoring/useSnoreMonitoring.js)
│       ├── ui/ElapsedTimer.jsx       # (구 components/SnoreMonitoring/ElapsedTimer.jsx)
│       ├── ui/StatsBar.jsx           # (구 components/SnoreMonitoring/StatsBar.jsx)
│       ├── ui/StatusPill.jsx         # (구 components/SnoreMonitoring/StatusPill.jsx)
│       └── index.js
│
└── shared/                           # 특정 도메인에 종속되지 않는 공통 자원
    ├── api/                          # 공통 API 클라이언트 설정
    │   ├── base.js                   # (구 utils/client.js - Axios instance)
    │   └── index.js
    ├── ui/                           # 디자인 시스템 공통 UI 컴포넌트
    │   ├── modal/                    # (구 components/Common/Modal.jsx)
    │   ├── loading-spinner/          # (구 components/Common/LoadingSpinner.jsx)
    │   ├── input-field/              # (구 components/InputField.jsx)
    │   └── index.js
    ├── lib/                          # 공통 유틸리티 함수 및 프레임워크 래퍼
    │   ├── audio/                    # 오디오 가공 관련 유틸리티 (audioConverter.js, micPermission.js)
    │   ├── hooks/                    # 비즈니스와 무관한 react hooks (useAsync.js)
    │   └── index.js
    └── layouts/                      # 레이아웃 뼈대 컴포넌트
        ├── app-layout/               # (구 layouts/AppMainLayout, WebContent, AppWrapper 등 결합 및 정리)
        └── index.js
```

---

## 3. 리팩토링 시 주요 이점

1. **상향식 의존성 규칙 보장**:
   - `shared`는 어느 레이어든 참조할 수 있지만, 타 레이어에 의존하지 않습니다.
   - `entities`는 서로를 참조하지 않고 오직 `shared`만 의존합니다.
   - `features`는 `entities`, `shared`를 조립해 비즈니스 액션을 구성합니다.
   - 이를 통해 한 번 구축해 두면, 특정 기능이나 화면을 변경할 때 다른 도메인이 깨질 염려가 크게 줄어듭니다.
2. **명확한 결합과 도메인 분리**:
   - 현재 `components/` 폴더에 혼재된 `Header`와 `Common`, `SnoreMonitoring` 등 성격이 매우 다른 컴포넌트들이 그 역할과 범위(Scope)에 맞춰 분배됩니다.
   - 모니터링 관련 상태 및 훅(`useSnoreMonitoring.js`, `useAlarm.js`)이 `entities/monitoring`으로 집중되어 다른 페이지나 위젯에서 손쉽게 가져다 쓸 수 있습니다.
3. **높은 확장성**:
   - 신규 기능이 추가될 경우 `features/`나 `entities/`에 새로운 폴더(Slice)를 생성하고 API를 선언하는 방식으로 단순하고 체계적인 확장이 가능합니다.
