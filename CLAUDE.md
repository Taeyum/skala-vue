# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 반드시 먼저 읽어야 하는 컨텍스트입니다.

---

## 이 프로젝트의 정체

**자유 개발 프로젝트가 아닙니다.**

SK AX Full-stack Engineering 3 — Frontend Framework(Vue.js) 과정의 **학습용 과제 저장소**입니다.
강의 자료(275페이지 PDF)의 진도를 따라가며, 각 단원이 끝날 때마다 Hands on 과제를 제출해 왔습니다.

과제는 **"그 시점까지 배운 문법만 사용한다"** 는 제약 아래 작성됐습니다.
예를 들어 과제 1(p.116)은 `computed`가 아직 안 나왔기 때문에 일반 함수로 파생값을 만들었고,
과제 4(p.196)는 Pinia를 배우기 전이라 `provide`/`inject`로 상태를 공유했습니다.

따라서 **"이 코드는 더 좋은 방식으로 바꿀 수 있습니다"** 라는 판단으로 리팩토링하면 안 됩니다.
그 선택에는 대부분 학습 단계상의 이유가 있고, 그 이유가 README.md에 기록되어 있습니다.

**작업 전에 반드시 `README.md`를 읽으세요.** 각 과제의 요구사항과 판단 근거가 전부 그 문서에 있습니다.

---

## 절대 하지 말 것

### 1. 과제 결과물 파일을 삭제하지 마세요

아래 파일들은 현재 메인 화면에서 쓰이지 않거나 중복처럼 보일 수 있지만,
**각각 특정 과제의 채점 대상 결과물**입니다.

| 파일 | 근거 |
|---|---|
| `components/exercise/WeatherMockup.vue` | 과제 1·2 제출물 (`/mockup` 라우트) |
| `components/exercise/BaseDashboardCard.vue` | 과제 3 요구사항 2번 (slot 기반 공통 레이아웃) |
| `components/exercise/SearchBar.vue` | 과제 3 요구사항 3번 (props/emits) |
| `components/exercise/WeatherCard.vue` | 과제 3 요구사항 4번 (가로형 카드) |
| `components/exercise/WeatherBadge.vue` | 과제 3 요구사항 7번 (추가 분리) |
| `components/exercise/TempGauge.vue` | 과제 3 요구사항 7번 (추가 분리) |
| `components/practices/**` 전체 | 각 단원 Code Challenge 실습 (`/practice` 라우트) |
| `stores/counter.js` | Ch7 Code Challenge |

`WeatherCard`(가로형)와 `WeatherTile`(그리드용 세로형)이 둘 다 존재하는 것은 의도된 것입니다.
전자는 과제 3·4 화면용, 후자는 현재 메인 화면용입니다.

### 2. 강의 자료가 지정한 이름을 바꾸지 마세요

과제 요구사항이 문자열 단위로 명시한 것들입니다. 채점자가 대조할 수 있습니다.

- **이벤트명**: `update-query`, `select-card`, `click-detail`
- **스토어 구조**: `configStore`의 `unit` / `unitSymbol` / `toggleUnit`
- **`unit` 값**: `'celsius'` / `'fahrenheit'` (`'C'`/`'F'` 아님)
- **컴포넌트명**: `BaseDashboardCard`, `SearchBar`, `WeatherCard`, `WeatherHomeView`
- **`:key`는 반드시 고유 id** (인덱스 금지 — 자료 p.87 원칙)

### 3. API 키를 코드에 하드코딩하지 마세요

이 저장소는 **Public**입니다. 모든 키는 `.env.local`에 있고 `VITE_` 접두사로 접근합니다.

```
VITE_WEATHER_API_KEY    OpenWeatherMap
VITE_PEXELS_API_KEY     Pexels
VITE_PRIMEUI_LICENSE    PrimeVue Community License
```

`.env.local`은 `.gitignore`의 `*.local` 규칙으로 제외됩니다. 이 파일을 커밋 대상에 넣지 마세요.

### 4. 학습 범위를 벗어난 라이브러리를 임의로 도입하지 마세요

- 예보 차트는 **차트 라이브러리 없이 SVG `<polyline>`으로 직접** 작성했습니다. 이게 차별점입니다
- 애니메이션은 **Vue 내장 `<Transition>` / `<TransitionGroup>` + CSS `@keyframes`** 로만 구현했습니다
- Composable(`useXxx()` 커스텀 훅)은 강의 범위 밖이라 의도적으로 쓰지 않았습니다

새 패키지가 꼭 필요하면 **먼저 제안하고 승인을 받으세요.**

### 5. 리팩토링 제안은 하되, 임의로 실행하지 마세요

README에 "알고 있는 한계"로 명시해 둔 것들이 있습니다.

- 홈 `convertTemp`와 상세 `displayTemp`의 화씨 변환 중복 (Composable이 해결책이나 범위 밖)
- 지도 뷰가 홈의 시간여행 로직(`forecastMap`·`timeIndex`·`projectCity`)을 복사해 씀 (같은 이유)
- 추가한 도시가 새로고침 시 소실 (localStorage 미연동)
- Element Plus와 PrimeVue 공존으로 인한 번들 크기

**이미 인지하고 있는 사항이며, 의도적으로 남겨둔 것입니다.**

---

## 현재 구조

```
src/
├── App.vue                          sticky 유리 헤더 + RouterView
├── router/index.js                  전 라우트 동적 import, Catch-all
├── stores/                          Pinia
│   ├── counter.js                   Ch7 실습용
│   ├── configStore.js               unit, sortOrder
│   ├── favoriteStore.js             favoriteIds
│   ├── weatherStore.js              현재 날씨, 도시 추가/삭제 (핵심)
│   ├── forecastStore.js             5일 예보
│   ├── airStore.js                  대기질
│   └── photoStore.js                Pexels 이미지
├── utils/
│   ├── weatherTheme.js              그라디언트 / 검색어 / 기상코드 / 온도색 매핑
│   ├── koreaMap.js                  시도 경계 투영·SVG path·육지 판정·마커 배치
│   └── windField.js                 바람 벡터 분해·IDW·격자 캐시 (import 없는 순수 모듈)
├── views/
│   ├── WeatherHomeView.vue          메인 (히어로 + 타일 그리드)
│   ├── WeatherDetailView.vue        /weather/:cityId (좌우 2단, 사진 배경)
│   ├── WeatherAboutView.vue         소개
│   ├── FavoriteView.vue             즐겨찾기
│   ├── PracticeView.vue             실습 (챕터 탭 + 아코디언)
│   └── NotFoundView.vue             404
└── components/
    ├── exercise/                    과제용 (위 "삭제 금지" 목록 참고)
    └── practices/                   단원별 실습 (basic/, library/)
```

**라우트**

| 경로 | 화면 |
|---|---|
| `/` | 메인 대시보드 |
| `/map` | 전국 지도 (기온 채색 + 바람) |
| `/weather/:cityId` | 상세 |
| `/favorites` | 즐겨찾기 |
| `/practice` | 실습 모음 |
| `/about` | 소개 |
| `/mockup` | 과제 1·2 (nav에는 없고 About에서 링크) |
| `/:pathMatch(.*)*` | 404 |

---

## 기술 스택 특이사항

**UI 라이브러리 두 개가 공존합니다.**

- **PrimeVue** (Aura 프리셋) — 과제 화면용. 커뮤니티 라이선스 키 필요
- **Element Plus** — Ch9 Code Challenge 실습 전용. 자료가 지정한 실습이라 유지

`main.js`의 PrimeVue 설정에서 `cssLayer` 옵션으로 레이어 순서를 명시해 충돌을 막고 있습니다.
이 설정을 지우면 두 라이브러리의 CSS 우선순위가 꼬입니다.

**전역 CSS는 최근에 정리했습니다.**

- `assets/base.css` — `body` 배경(그라디언트 고정)과 글자색(`#2c3e50` 고정)을 여기서만 관리
- `assets/main.css` — `#app` 초기화, `a { color: inherit }` 만
- `assets/exercise.css` — `.app-container`, 과제 1·2용 `.dashboard-wrapper` / `.status-bar`

OS 다크 모드에 따라 색이 바뀌던 것을 고정한 상태입니다. **다시 `var(--color-text)` 등으로 되돌리지 마세요.**
흰 카드 위에서 글자가 안 보이는 문제가 반복됐던 원인입니다.

**API 호출은 전부 스토어에서만** 합니다. 컴포넌트에서 직접 axios를 부르지 않습니다.
각 스토어는 도시별·검색어별 캐싱을 하고 있습니다. 무료 티어 한도 때문입니다.

---

## 작업 방식

1. **한 번에 하나씩** 작업하고, 매번 확인을 받으세요
2. 여러 파일을 동시에 고쳐야 하면 **먼저 계획을 설명**하고 승인을 받으세요
3. 코드를 고친 뒤에는 **무엇을 왜 바꿨는지** 요약해 주세요
4. **`npm run format`을 저장소 전체에 돌리지 마세요.**
   Prettier가 세미콜론을 제거하는데, `WeatherMockup.vue`의 템플릿 인라인 핸들러가
   세미콜론으로 두 문장을 잇고 있어 **빌드가 깨집니다** (2026-08-22에 실제로 발생).
   제출물(`practices/**`, 과제 3 컴포넌트, `WeatherMockup.vue`)도 통째로 재포맷되어
   채점 대상 파일의 diff가 오염됩니다.
   포맷이 필요하면 방금 작성한 파일만 지정해서 돌리세요.
   새 코드를 쓸 때도 템플릿 인라인 핸들러에 두 문장을 세미콜론으로 잇지 마세요.
5. 스타일 작업 시 **`<style scoped>`는 자식 컴포넌트 내부에 적용되지 않습니다.**
   자식 내부를 건드려야 하면 `:deep()`을 쓰거나 해당 컴포넌트 파일에서 수정하세요

---

## 남은 진도

강의는 Ch.10(p.250–274)만 남았습니다 — ESLint, Prettier, Vite Configuration, 환경 변수, 빌드, 배포.
마지막 과제가 **배포(p.274)** 이므로, 빌드가 깨지는 변경은 피해 주세요.

```bash
npm run build   # 변경 후 반드시 통과하는지 확인
```
