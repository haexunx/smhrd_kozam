# 🐼 Kozam 프론트엔드 리팩토링 로드맵 & 포트폴리오 전략

이 가이드는 현재 Kozam 프로젝트의 프론트엔드(React 19 + Vite) 코드를 분석하여 기술적 한계를 진단하고, 이를 리팩토링하여 포트폴리오의 매력적인 '문제 해결 스토리'로 발전시키는 계획을 제공합니다.

---

## 🛠️ Part 1. 프론트엔드 코드 진단 및 리팩토링 계획

현재 프로젝트는 **React 19**와 **Web Audio API(AudioWorklet)**를 활용하는 등 기술적으로 흥미로운 시도를 하고 있습니다. 하지만 코드 구조와 비즈니스 로직 결합도 관점에서 리팩토링할 요소들이 많이 존재합니다.

### 1. `useSnoreMonitoring.js` 훅 분리 (관심사 분리, SoC)
*   **문제 진단**: [useSnoreMonitoring.js](file:///C:/Users/smhrd1/project_kozam/client/src/hooks/SnoreMonitoring/useSnoreMonitoring.js) 파일은 약 480라인에 달하며 다음과 같은 너무 많은 역할을 수행하고 있습니다.
    *   마이크 권한 및 raw PCM 데이터 수집 (Web Audio API 및 AudioWorklet 설정)
    *   3초마다 WAV 변환 및 AI 예측 API 요청 관리
    *   코골이 세션(Session) 및 알람 로그(Alarm Log) 데이터베이스 통신
    *   알람 타이머 및 쿨다운(30분 방해 금지) 상태 제어
    *   연속 감지 횟수 / 1분당 감지 패턴 등 복잡한 알람 트리거 평가 로직
*   **리팩토링 계획**:
    ```mermaid
    graph TD
        useSnoreMonitoring[useSnoreMonitoring - 통합 조정자]
        useAudioCapture[useAudioCapture - 마이크 캡처/PCM 수집]
        useAlarmTrigger[useAlarmTrigger - 알람 트리거/쿨다운 관리]
        apiMonitoring[api/monitoring - 백엔드 API 연동]
        
        useSnoreMonitoring --> useAudioCapture
        useSnoreMonitoring --> useAlarmTrigger
        useSnoreMonitoring --> apiMonitoring
    ```
    *   `useAudioCapture`: AudioContext, AudioWorklet 노드 관리 및 PCM Buffer 병합 로직만 전담하는 커스텀 훅으로 추출.
    *   `useAlarmTrigger`: 유저의 설정(`alarmCondition`)에 따른 연속 감지 / 빈도 분석 로직 및 쿨다운(`isCooldown`) 타이머 관리를 전담하는 커스텀 훅으로 추출.
    *   **기대 효과**: 각 기능 단위로 코드가 독립되어 유닛 테스트 작성이 쉬워지고, 메인 모니터링 로직이 크게 간결해집니다.

### 2. Web Audio API / AudioWorklet 최적화 및 안정성 강화
*   **문제 진단**: 브라우저 오디오 스트림은 탭 백그라운드 전환이나 마이크 끊김, 브라우저 정책(Autoplay 방지 등)에 의해 쉽게 오작동할 수 있습니다. 또한 `workletNodeRef.current.port.onmessage` 내부에서 예외 처리나 메모리 누수 방지 장치가 부족합니다.
*   **리팩토링 계획**:
    *   `AudioContext` 상태 변화(`statechange`) 감지 및 자동 재시작(Resume) 로직 추가.
    *   녹음이 비정상적으로 종료되거나 중단되었을 때, `pcmBufferRef`와 `URL.createObjectURL`로 생성된 임시 URL 리소스를 완벽히 GC(Garbage Collector)의 대상이 되도록 해제 단계 보강.
*   **기대 효과**: 백그라운드 수면 중에도 마이크 연결 안정성을 확보하고, 수 시간의 지속적인 트래킹 동안 탭의 메모리 점유율이 점진적으로 증가하는 현상 방지.

### 3. 개발/데모 모드(Demo Mode) 디커플링
*   **문제 진단**: `useSnoreMonitoring.js` 내부에 시연을 위한 하드코딩 로직(10초 후 무조건 코골이 판정)이 들어있습니다.
    *   `// --- 시연용 패치: 시작 후 10초 뒤부터 무조건 코골이 판정 ---` (L154-L163)
    *   이로 인해 프로덕션 빌드 시 실수로 데모 코드가 배포될 위험이 있으며, 코드 오염도가 높습니다.
*   **리팩토링 계획**:
    *   환경 변수(`.env.development` / `.env.production`)를 활용하여 `VITE_USE_DEMO_MODE=true`일 때만 활성화되는 오디오 모크(Mocking) 레이어 또는 별도의 데모 훅 데코레이터 적용.
*   **기대 효과**: 비즈니스 로직과 프레젠테이션/데모 로직을 분리하여 안전하고 깨끗한 프로덕션 코드 유지.

### 4. `SleepingHistory.jsx` 컴포넌트 및 순수 연산 함수 모듈화
*   **문제 진단**: [SleepingHistory.jsx](file:///C:/Users/smhrd1/project_kozam/client/src/pages/SleepingHistory/SleepingHistory.jsx)에 `Timeline`, `Summary`, `Feedback`, `ProfileRows` 등 서브 컴포넌트와 시간 연산 헬퍼 함수가 전부 한 파일(370라인)에 정의되어 있습니다.
*   **리팩토링 계획**:
    *   `Timeline`, `Summary`, `Feedback`, `ProfileRows` 컴포넌트를 각 파일로 분리하고 CSS Module도 세분화하여 결합도를 낮춤.
    *   `buildTimelineBars` (L149-L174) 등 특정 도메인 연산 함수를 유틸(`utils/timeline.js`)로 분리.
*   **기대 효과**: 파일당 라인 수를 100줄 이내로 축소하여 가독성을 향상시키고, 독립된 서브 컴포넌트의 재사용성 확보.

### 5. React 19 최적화 및 렌더링 성능 최적화
*   **문제 진단**: Vite 설정에 `babel-plugin-react-compiler`가 설정되어 있으나, 상태 객체가 3초마다 지속적으로 업데이트(감지 횟수, 타이머 등)되고 있어 불필요한 하위 컴포넌트 렌더링이 일어날 가능성이 있습니다.
*   **리팩토링 계획**:
    *   상태의 세분화 또는 `useRef`의 적절한 조합을 통해 화면 갱신 횟수를 제한.
    *   React Compiler가 메모이제이션을 제대로 수행할 수 있도록 규칙에 부합하게 코드 리팩토링 (규칙 위반 요소 점검).

---

## 💼 Part 2. 프론트엔드 개발자 포트폴리오 작성 전략

기업이 프론트엔드 포트폴리오에서 가장 보고 싶어 하는 것은 **"단순히 API를 받아 화면에 그리는 것"을 넘어 "기술적 한계를 어떻게 돌파했고, 왜 그런 설계를 선택했는가?"**입니다.

### 🚀 포트폴리오에 담을 핵심 기술 포인트 (4가지)

#### ① Web Audio API와 AudioWorklet을 활용한 실시간 음성 처리 최적화
*   **핵심 요약**: 미디어 레코더 방식의 오버헤드를 극복하기 위해, 오디오 워크렛을 통해 브라우저 백그라운드 스레드에서 저수준 raw PCM 데이터를 3초 간격으로 추출하고 WAV 파일로 인메모리 변환하여 서버에 가볍게 전송하는 파이프라인 구축.
*   **포트폴리오 어필 포인트**: "네트워크 오버헤드를 최소화하고, 브라우저 메인 스레드의 UI 차단(Jank) 현상 없이 실시간 소리 감지를 구현한 경험"으로 포장.

#### ② 복잡한 트래킹 로직의 관심사 분리 (SoC) 및 커스텀 훅 구조화
*   **핵심 요약**: 500줄에 육박하던 모니터링 스파게티 코드를 오디오 수집, 알람 판단, API 동기화의 3가지 핵심 관심사로 쪼개어 가독성을 높이고 유지보수성을 확보한 리팩토링 여정.
*   **포트폴리오 어필 포인트**: "단일 책임 원칙(SRP)을 준수하며 모듈화된 설계를 고민하는 프론트엔드 아키텍처 설계 역량" 어필.

#### ③ React 19 & React Compiler 실무 적용 및 최적화 경험
*   **핵심 요약**: 최신 React 19 사양을 선제 도입하고 React Compiler가 자동으로 메모이제이션을 처리할 수 있는 구조로 리팩토링하여, 컴포넌트 최적화(useMemo/useCallback 도배) 비용을 덜고 DX(개발자 경험)를 개선한 과정.
*   **포트폴리오 어필 포인트**: "트렌디한 기술을 검토 및 도입하고 코드가 최적화된 상태를 유지하는 성능 분석력" 어필.

#### ④ UX와 인터렉션 디자인 고도화
*   **핵심 요약**: `Framer Motion`을 활용하여 모니터링 상태에 따른 캐릭터 판다의 애니메이션 전환, 수면 점수를 시각화한 원형 프로그레스 링, 타임라인 인터렉션 구현.
*   **포트폴리오 어필 포인트**: "사용자의 불안감을 낮추고 직관적인 정보를 전달하기 위한 모션 그래픽과 마이크로 인터렉션 구현 능력" 강조.

---

## 📝 Part 3. 리팩토링 전/후 비교(STAR 기법) 템플릿

이 리팩토링 과정을 포트폴리오에 쓸 때는 **STAR 기법(Situation - Task - Action - Result)**에 맞춰 작성해야 면접관의 시선을 끌 수 있습니다.

| 단계 | 작성 가이드라인 | Kozam 프로젝트 적용 예시 |
| :--- | :--- | :--- |
| **Situation** (상황) | 기존 프로젝트의 한계나 문제 상황을 설명합니다. | "실시간 코골이 분석 모니터링 화면에서 오디오 스트림 수집, 알람 판단 로직, DB API 전송 로직이 500줄짜리 단일 훅에 밀집해 유지보수가 불가능했고, 장시간 트래킹 시 메모리 및 프레임 드랍 우려가 있었음." |
| **Task** (과제) | 해결해야 할 목표와 핵심 기준을 정의합니다. | "비즈니스 로직과 UI 관심사를 완전히 분리하고, 오디오 처리 부하를 최소화하며, 브라우저 자원 누수를 차단하여 8시간 이상 안정적으로 돌아가는 프론트엔드 환경 구축." |
| **Action** (행동) | 자신이 취한 리팩토링 조치와 설계적 고민을 기술합니다. | "1) `AudioWorklet`을 활용해 브라우저 백그라운드 스레드로 연산을 이관하고 리소스 해제 사이클을 정교화함.<br>2) 훅을 `useAudioCapture`, `useAlarmTrigger`로 분리하여 역할 분담.<br>3) 순수 수학 연산(`buildTimelineBars` 등)을 유틸 함수로 순수화(Pure Function)해 독립적 테스트 확보.<br>4) React 19 컴파일러 규칙에 맞는 코드 정렬." |
| **Result** (결과) | 리팩토링 후 얻어낸 정량적/정성적 성과를 증명합니다. | "1) 모니터링 코드 라인 수 약 60% 감소 및 단위 컴포넌트 재사용성 확보.<br>2) 메모리 누수를 완전히 차단하여 장시간 실행 시 메모리 점유율을 일정하게 유지.<br>3) 관심사 분리를 통해 테스트 용이성 및 기능 추가 유연성 대폭 향상." |

---

## 📅 다음 단계 실행 계획 (Action Item)

1.  **브랜치 생성**: 리팩토링을 마음껏 진행할 수 있는 전용 브랜치(`refactor/snore-monitoring-clean`)를 생성합니다.
2.  **구조 설계**: 리팩토링 대상 파일들을 쪼개기 위한 디렉토리 구조 정의.
3.  **오디오 로직 분리**: `useAudioCapture` 훅을 구현하여 Web Audio API 로직 이관 및 메모리 클린업 검증.
4.  **알람 로직 분리**: `useAlarmTrigger` 훅 구현 및 알람 조건 테스트.
5.  **성능 분석**: React Developer Tools나 Chrome DevTools를 통해 리팩토링 전후 메모리 상태 및 렌더링 횟수 측정/캡처 (포트폴리오 첨부용 이미지 확보).
