# skala-vue

SK AX Full-stack Engineering 3 — Frontend Framework: Vue.js 과정 실습 저장소입니다.

강의에서 배운 문법을 하나씩 실습 컴포넌트로 만들고, 단원별 Hands on 과제를 구현하고 있습니다.

---

## 실행 방법

```bash
npm install
```

프로젝트 루트에 `.env.local` 파일을 만들고 API 키를 입력합니다. (`.env.example` 참고)

```
VITE_WEATHER_API_KEY=OpenWeatherMap API Key
VITE_PEXELS_API_KEY=Pexels API Key
VITE_PRIMEUI_LICENSE=PrimeUI Community License Key
```

```bash
npm run dev
```

---

## 프로젝트 구조

```
src/
├── App.vue                             sticky 헤더 + RouterView
├── router/
│   └── index.js                        라우트 정의, 지연 로딩, Catch-all
├── stores/                             Pinia 전역 상태 저장소
│   ├── counter.js                      Code Challenge 실습용
│   ├── configStore.js                  온도 단위, 정렬 기준
│   ├── favoriteStore.js                즐겨찾기 목록
│   ├── weatherStore.js                 현재 날씨, 도시 추가/삭제
│   ├── forecastStore.js                5일 예보
│   ├── airStore.js                     대기질
│   └── photoStore.js                   Pexels 배경 이미지
├── utils/
│   └── weatherTheme.js                 그라디언트 / 이미지 검색어 / 기상 코드 한글 매핑
├── views/                              페이지 단위 컴포넌트
│   ├── WeatherHomeView.vue             메인 대시보드 (히어로 + 타일 그리드)
│   ├── WeatherDetailView.vue           /weather/:cityId 상세 페이지
│   ├── WeatherAboutView.vue            서비스 소개
│   ├── FavoriteView.vue                즐겨찾기 목록
│   ├── PracticeView.vue                실습 모음 (챕터 탭 + 아코디언)
│   └── NotFoundView.vue                Catch-all Route
├── components/
│   ├── exercise/                       과제용 부품 컴포넌트
│   │   ├── WeatherMockup.vue           과제 1, 2
│   │   ├── BaseDashboardCard.vue       slot 기반 공통 레이아웃
│   │   ├── SearchBar.vue
│   │   ├── WeatherCard.vue             과제 3·4용 가로형 카드
│   │   ├── WeatherBadge.vue
│   │   ├── TempGauge.vue
│   │   ├── UnitToggler.vue             온도 단위 전환 (Pinia 직접 사용)
│   │   ├── ForecastChart.vue           시간별 예보 차트 (SVG)
│   │   ├── CityAdder.vue               Geocoding 기반 도시 추가
│   │   ├── WeatherHero.vue             선택 지역 대형 표시
│   │   ├── WeatherTile.vue             그리드용 세로형 타일
│   │   └── WeatherAnimation.vue        날씨별 CSS 애니메이션 배경
│   └── practices/
│       ├── basic/                      Ch3 실습 컴포넌트
│       └── library/                    Pinia / Axios / Element Plus 실습
└── assets/
```

---

## 사용한 외부 API

| API | 용도 |
|---|---|
| OpenWeatherMap — Current Weather | 도시별 현재 날씨, 아이콘 |
| OpenWeatherMap — 5 Day / 3 Hour Forecast | 시간별 예보 차트 |
| OpenWeatherMap — Air Pollution | 대기질(AQI), PM10 / PM2.5 |
| OpenWeatherMap — Geocoding | 사용자 도시 추가 시 좌표·명칭 조회 |
| Pexels — Photo Search | 날씨 상태에 맞는 상세 페이지 배경 이미지 |

Pexels 가이드라인에 따라 상세 페이지 하단에 사진작가 크레딧과 원본 링크를 표기했습니다.

---

## 실습 진행 현황

**1일차 (p.7–93)**
Modern JavaScript, Vue 개요와 환경 구축, Vue Syntax 디렉티브까지 실습했습니다.
`v-html`, `v-text`, `v-bind`, `v-if`/`v-show`, `v-for`, `v-pre`/`v-cloak`/`v-once`/`v-memo`를 각각 컴포넌트로 만들었습니다.

**2일차 (p.94–144)**
이벤트 핸들링, 폼 바인딩, 스타일을 마무리하고 Composition API로 넘어갔습니다.
`ref`/`reactive`, `computed`, `watch`(기본 / Multi-Source / Deep / reactive), `watchEffect`를 실습했습니다.

**3일차 (p.145–195)**
Composition API Hands on 과제를 진행하고, Vue Components와 Vue Router로 넘어갔습니다.
Lifecycle Hooks, Props & Emits, Provide & Inject, Slot을 각각 컴포넌트로 만들었습니다.

**4일차 (p.196–249)**
Vue Router Hands on 과제를 진행하고 Pinia, Axios, UI Library로 넘어갔습니다.
Store의 state / getters / actions, `storeToRefs`, REST API CRUD 통신, Element Plus 컴포넌트를 실습했습니다.

---

## 작업 기록

<details>
<summary><b>2026-08-19 — 실습과 과제 페이지 분리</b></summary>

<br>

처음에는 `App.vue`에 실습 컴포넌트를 전부 나열했는데, 개수가 20개를 넘어가니까 과제물이 스크롤 맨 아래에 묻혀버렸습니다.
그래서 실습은 `PracticeIndex.vue`로 옮기고, `App.vue`는 어떤 화면을 보여줄지만 결정하도록 바꿨습니다.

페이지를 나누는 거라 원래는 Vue Router를 쓰는 게 맞겠지만 6장에서 배우는 내용이라, 지금은 `ref`와 `v-if`로 대신했습니다.
6장까지 가면 `v-if` 자리를 `<RouterView />`로 바꾸면 그대로 라우터 구조가 될 것 같아서, 나중에 갈아타기 쉽도록 미리 컴포넌트를 분리해 두었습니다.

</details>

<details>
<summary><b>2026-08-20 — 과제 2를 과제 1 위에 확장</b></summary>

<br>

과제 2는 새 파일을 만들지 않고 1일차의 `WeatherMockup.vue`를 그대로 확장했습니다.
요구사항 1번이 "(1일차 동일)"이라고 명시되어 있어서, 같은 데이터 위에 Composition API를 얹는 구조로 의도된 과제라고 생각했습니다.

컴포넌트를 나누고 싶은 마음도 있었지만 5장에서 배우는 내용이라 단일 파일을 유지했습니다.
파일이 길어지고 있어서 5장에 가면 카드, 검색창, 상태바 정도로 쪼갤 생각입니다.

</details>

<details>
<summary><b>2026-08-20 — 과제 3은 별도 폴더로 분리</b></summary>

<br>

과제 3은 과제 2를 컴포넌트로 쪼개는 리팩토링이라 `WeatherMockup.vue`를 덮어쓸까 고민했습니다.
그런데 과제 1, 2와 과제 3은 각각 별개의 제출물이고 강사님이 과제별로 확인하실 수도 있어서, `weather/` 하위 폴더를 만들고 원본은 그대로 두기로 했습니다.
`App.vue`에 버튼을 하나 더 만들어서 두 버전을 번갈아 볼 수 있게 했습니다.

</details>

<details>
<summary><b>2026-08-21 — v-if 페이지 전환을 라우터로 교체</b></summary>

<br>

첫날 README에 적어둔 대로 `App.vue`의 `v-if` 자리를 `<RouterView />`로 바꿨습니다.
미리 컴포넌트를 분리해 둔 덕분에 `WeatherParent`를 `views/WeatherHomeView.vue`로 옮기고 라우트에 등록하는 것만으로 대부분 끝났습니다.

`App.vue`에서 `ref`도 `v-if`도 import 세 줄도 전부 사라졌습니다.
어떤 화면이 존재하는지에 대한 정보가 `router/index.js` 한곳에 모이면서, `App.vue`는 모든 페이지에 공통으로 남는 껍데기만 갖게 됐습니다.

</details>

<details>
<summary><b>2026-08-21 — provide/inject를 Pinia로 교체</b></summary>

<br>

과제 4에서 즐겨찾기 상태를 `App.vue`로 올리고 `provide`했는데, UI 컴포넌트가 상태 저장소 역할까지 하는 게 계속 걸렸습니다.
`favoriteStore.js`로 옮기고 나니 `App.vue`에서 `ref`, `provide`, `watch`가 전부 사라지고 다시 껍데기가 됐습니다.

`App.vue`가 여전히 스토어를 import하긴 하지만 성격이 다릅니다.
전에는 상태를 소유했고 지금은 즐겨찾기 개수를 조회만 합니다. 상태의 주인이 스토어로 옮겨간 것이라고 이해했습니다.

</details>

<details>
<summary><b>2026-08-21 — 목 데이터를 실제 API로 교체</b></summary>

<br>

과제 4와 5에서 "Mock Data를 임시로" 두었던 부분을 전부 걷어냈습니다.
홈과 상세, 즐겨찾기가 각자 갖고 있던 세 벌의 데이터가 `weatherStore` 하나로 합쳐졌습니다.

세 화면이 같은 배열을 보게 되니 상세 페이지에서 도시를 바꿔도, 목록에 새 도시를 추가해도 자동으로 반영됩니다.
과제 4 README에 "7장 Pinia에서 해결될 것"이라고 적어둔 걸 이번에 실행한 셈입니다.

</details>

<details>
<summary><b>2026-08-21 — 전역 CSS 정리와 레이아웃 재설계</b></summary>

<br>

화면 레이아웃, 구조 등 전면 재설계 했습니다.

화면 폭을 넓히려다 보니 배경이 검게 남는 부분이 계속 생겼습니다.
원인을 따라가 보니 배경을 정하는 곳이 `base.css`, `main.css`, `exercise.css` 세 군데로 흩어져 있었습니다.

`body` 배경은 `base.css` 한 곳에서만 정하고 나머지는 지웠습니다.
전역 `a` 태그 색과 hover 배경도 스캐폴딩 잔재였는데, 로고에 마우스를 올릴 때 각진 초록 박스가 뜨는 원인이었습니다.

가장 큰 수확은 `body`의 글자색이었습니다.
`var(--color-text)`가 OS 다크 모드에서 밝은 회색이 되는 바람에, 흰 카드를 만들 때마다 글자가 안 보여 매번 `color`를 다시 지정하고 있었습니다.
전역에서 색을 고정하니 그 반복이 사라졌습니다.

</details>

---

## 과제

<details>
<summary><b>과제 1 — Weather Mockup (Ch3 Hands on, p.116)</b></summary>

<br>

| 요구사항 | 구현 |
|---|---|
| 1. 배열 렌더링 | `v-for` + `:key="item.id"` |
| 2. 조건부 렌더링 | `v-if` / `v-else-if` / `v-else` 3단 분기 |
| 3. 한글 처리 | `:value` + `@input` |
| 4. 이벤트 및 수식어 | 카드 `@click`, 상세보기 `@click.stop` |

### 추가로 넣은 것 (요구사항 5)

도시 6개 확장, 온도 구간별 카드 색상(`:class`), 온도 게이지(`:style`), 기온순 정렬, 최고 기온 표시, 관측 불가 데이터 처리

### 이렇게 판단했습니다

**`:key`에 `index` 대신 `id`를 썼습니다.**

강의자료 p.87은 `:key`에 반드시 고유한 값을 바인딩하라고 하는데, 정작 p.88 예제는 `:key="index"`를 씁니다.
인덱스는 지금 이 순간에는 고유하지만 항목을 중간에 지우면 뒤쪽이 전부 한 칸씩 밀립니다.
그러면 Vue 입장에서는 같은 key인데 다른 데이터가 되니까 엉뚱한 DOM을 재사용할 수 있겠다고 생각해서, p.87의 원칙 쪽을 따랐습니다.

**`:class`와 `:style`을 용도에 따라 나눴습니다.**

p.82에 정해진 상태 전환은 클래스, 연속적인 수치는 스타일이라는 기준이 있어서 그대로 적용해봤습니다.
더움/선선함처럼 미리 정해둔 두 가지 상태는 `:class`로, 값에 따라 길이가 연속적으로 달라지는 온도 게이지는 `:style`로 처리했습니다.

게이지는 처음에 `temp * 3 + 'px'`로 만들었는데 왜 3배인지 설명할 수가 없었습니다.
기온이 어디까지 갈 수 있는지를 먼저 정해야 비율이 나온다는 생각이 들어서, 한국 기온을 -10도에서 40도로 잡고 그 폭을 0~100%로 환산하는 함수를 따로 만들었습니다.

**기본값을 줄 때 `||`가 아니라 `??`를 썼습니다.**

관측이 안 되는 도시를 하나 넣어보려고 `temp`를 `null`로 두었습니다.
`item.temp || '측정 불가'`로 쓰면 될 것 같았는데, `||`는 0도 falsy로 취급한다는 게 생각났습니다.
실제로 기온이 0도인 도시가 있으면 "측정 불가"로 바뀌어버리는데, 이건 조용히 잘못된 값이 나오는 거라 찾기도 어려울 것 같았습니다.
`??`는 `null`과 `undefined`만 걸러내기 때문에 0도는 그대로 살아남습니다.

**`sort()` 대신 `toSorted()`를 썼습니다.**

기온순 정렬 버튼을 만들면서 `sort()`를 쓰면 원본 배열이 그 자리에서 바뀝니다.
1일차 Modern JavaScript에서 ES2023의 불변 배열 메서드를 배웠던 게 떠올라서 `toSorted()`로 바꿨습니다.
새 배열을 만들어 재할당하는 쪽이 반응형 데이터를 다룰 때 더 예측 가능할 것 같았습니다.

</details>

<details>
<summary><b>과제 2 — Weather Composition (Ch4 Hands on, p.145)</b></summary>

<br>

| 요구사항 | 구현 |
|---|---|
| 1. 반응형 상태 관리 | `searchQuery`, `selectedCityInfo`, `weatherList` (1일차 동일) |
| 2. 검색 도시 필터링 | `computed` → `filteredWeatherList` |
| 3. 반응형 변수 감시 | `selectedCityInfo` → `watch`, `searchQuery` → `watchEffect` |
| 4. 검색 결과 표시 | `v-for` 대상 교체 + 0건 시 `v-if` 안내 |

### 추가로 넣은 것 (요구사항 5)

| 구분 | 내용 |
|---|---|
| 상태 | `unit` (섭씨/화씨 토글), `favoriteIds` (즐겨찾기) |
| Computed | `hottestCity` — 기존 일반 함수를 승격 |
| Watcher | `unit` 변경 감시, `favoriteIds` 변경 감시 (`deep`) |

### 이렇게 판단했습니다

**즐겨찾기에서 `deep: true`가 왜 필요한지 직접 확인해봤습니다.**

처음에는 `deep` 없이 `watch(favoriteIds, ...)`를 걸어두고 별 버튼을 눌러봤는데 콘솔에 아무것도 찍히지 않았습니다.
`push`와 `splice`는 배열 안쪽만 바꾸기 때문에 배열이 있는 주소 자체는 그대로라서, 기본 `watch`가 변화를 못 잡는다는 걸 알게 됐습니다.

여기서 한 가지 더 확인한 것은 `newVal`과 `oldVal`이 완전히 같은 값으로 들어온다는 점이었습니다.
처음엔 `deep` 옵션 때문에 이전 값이 막히는 줄 알았는데, 생각해보니 내부 값을 덮어쓴 상황에서는 예전 상태가 메모리 어디에도 남아있지 않았습니다.
즉 `deep`이 이전 값을 없애는 게 아니라, `deep`이 필요한 상황 자체가 이전 값이 존재할 수 없는 상황이었습니다.

**온도 단위를 바꿔도 원본 데이터는 섭씨로 유지했습니다.**

`weatherList`의 `temp`를 아예 화씨로 바꿔버릴까 생각했는데, 그러면 25도 기준으로 더움/선선함을 나누는 조건이 무너져서 전부 "더움"이 될 것 같았습니다.
원본은 섭씨 하나로 고정하고 화면에 그릴 때만 `convertTemp`로 변환하도록 했더니, 라벨 판정과 게이지 길이가 단위와 무관하게 유지됐습니다.

**최고 기온 함수를 `computed`로 바꿨습니다.**

1일차의 `hottestCity()`는 일반 함수라서, 카드를 클릭할 때마다 배열 전체를 다시 정렬하고 있었습니다.
`computed`로 바꾸니 `weatherList`가 실제로 바뀔 때만 재계산됩니다.

반대로 `convertTemp`는 함수로 두었습니다. 카드마다 다른 온도를 인자로 받아야 하는데 `computed`는 인자를 받을 수 없기 때문입니다.

</details>

<details>
<summary><b>과제 3 — Weather Component (Ch5 Hands on, p.178)</b></summary>

<br>

기능 변경 없이 과제 2를 컴포넌트로 분리한 리팩토링 과제입니다.

| 요구사항 | 구현 |
|---|---|
| 1. WeatherParent | 모든 반응형 데이터와 computed / watch 유지 |
| 2. BaseDashboardCard | `<slot>`으로 검색박스·리스트박스 공통 디자인 |
| 3. SearchBar | props `query` / emits `update-query` |
| 4. WeatherCard | props `city` 등 / emits `select-card`, `click-detail` |
| 5. 스타일 분리 | 각 컴포넌트의 `<style scoped>`로 이동 |

### 추가로 넣은 것 (요구사항 7)

| 컴포넌트 | 분리한 이유 |
|---|---|
| `WeatherBadge` | 더움 / 선선함 / 관측 불가 3단 조건 분기를 카드 밖으로 |
| `TempGauge` | 게이지 너비만 받는 단순 표시 컴포넌트 |

### 이렇게 판단했습니다

**계산은 부모가 하고 자식은 그리기만 하도록 나눴습니다.**

`WeatherCard`에 도시 객체만 넘기면 될 줄 알았는데, 온도 변환과 게이지 너비를 자식이 계산하려니 `unit` 같은 부모 상태까지 전부 내려보내야 했습니다.
그래서 `convertTemp`와 `tempToWidth`는 부모에 두고 결과값만 props로 넘기기로 했습니다.
`isSelected`, `isFavorite`도 `selectedId === city.id` 판정을 부모가 하고 자식은 `true`/`false`만 받습니다.
props가 6개로 늘어나긴 했지만, 자식이 판단하지 않고 받은 대로 그리기만 하니 역할이 명확해졌습니다.

**`BaseDashboardCard`에는 props도 emits도 넣지 않았습니다.**

`SearchBar`가 `BaseDashboardCard` 안에 들어가 있어서 처음엔 중간에서 데이터를 한 번 더 넘겨줘야 하나 싶었습니다.
그런데 요구사항 6번 설명대로, slot으로 전달되는 내용은 부모 스코프에서 컴파일되기 때문에 `WeatherParent`가 `SearchBar`와 직접 통신할 수 있었습니다.
결과적으로 `BaseDashboardCard`는 디자인만 담당하는 껍데기가 됐습니다.

**`WeatherBadge`는 조건 분기를 안으로 감췄습니다.**

`v-if` / `v-else-if` / `v-else` 세 줄이 카드 안에 있으니 카드 템플릿이 길어졌습니다.
배지 컴포넌트로 옮기고 온도만 넘기니, 카드는 "배지가 있다"만 알고 어떤 배지를 보여줄지는 배지가 스스로 정하게 됐습니다.

**스타일을 옮기다 화면이 깨졌습니다.**

`<style scoped>`가 자식 컴포넌트 내부에는 적용되지 않는데, `.dashboard-wrapper h4` 같은 규칙이 부모에 남아 있어서 자식 안의 글자 색이 안 걸렸습니다.
`.weather-card` 기본 스타일은 전역 CSS에, 덮어쓰는 `is-hot` / `is-cool`은 `scoped`에 있어서 우선순위까지 꼬였습니다.
같은 요소의 스타일이 두 파일에 흩어져 있는 게 원인이었고, 컴포넌트별로 한곳에 모으니 해결됐습니다.
요구사항 5번이 스타일도 함께 분리하라고 한 이유를 이때 이해했습니다.

</details>

<details>
<summary><b>과제 4 — Weather Router (Ch6 Hands on, p.196)</b></summary>

<br>

과제 3의 컴포넌트 구조를 라우터 기반으로 전환했습니다.

| 요구사항 | 구현 |
|---|---|
| 1. Router 설정 | 전 라우트 동적 import(지연 로딩), `/:pathMatch(.*)*` Catch-all |
| 2. App.vue | `<RouterLink>` 네비게이션 바 + `<RouterView />` |
| 3. WeatherHomeView | `WeatherParent` 승격. 상세보기를 `alert`에서 `router.push`로 변경 |
| 4. WeatherDetailView | `route.params.cityId`로 `onMounted` 시점에 Mock Data 조회 |
| 5. WeatherAboutView | 서비스 소개 + 대시보드 복귀 링크 |

### 추가로 넣은 것 (요구사항 6)

| 항목 | 내용 |
|---|---|
| `FavoriteView` | 즐겨찾기한 지역 목록. `provide`/`inject`로 라우트 간 상태 공유 |
| 검색어 URL 동기화 | `?search=` 쿼리 스트링과 검색 상태를 양방향으로 맞춤 |
| `/mockup`, `/practice` | 기존 과제·실습 화면도 라우트로 편입 |

### 이렇게 판단했습니다

**상세 페이지가 Mock Data를 따로 갖게 된 이유를 짚어봤습니다.**

요구사항 4번이 "Mock Data를 **임시로** 활용"이라고 적혀 있는 게 처음엔 이상했습니다.
홈 화면에 이미 `weatherList`가 있는데 왜 또 만드나 싶었는데, 만들다 보니 이유를 알게 됐습니다.

홈과 상세는 부모-자식이 아니라 형제 라우트라서 서로의 데이터를 볼 수 있는 통로가 없습니다.
5장에서 "형제끼리는 직접 대화하는 선이 없다"고 배운 게 실제 문제로 나타난 것이었습니다.
"임시로"라는 단어는 7장 Pinia에서 이걸 해결한다는 뜻으로 읽혔습니다.

**즐겨찾기 페이지에서는 `provide`/`inject`로 우회했습니다.**

즐겨찾기 목록도 같은 문제를 만났습니다. `favoriteIds`가 홈 안에 있어서 다른 라우트에서 못 봅니다.
Mock Data처럼 복사해두면 별을 켜도 목록에 반영이 안 되니, 이번엔 진짜로 상태를 공유해야 했습니다.

`favoriteIds`를 `App.vue`로 올리고 `provide`한 뒤 두 화면에서 `inject`했습니다.
5장에서 배운 방식이고, 자료가 "Pinia 때문에 사용 빈도가 높지 않다"고 적어둔 이유도 이때 이해했습니다.
전역 상태 하나를 공유하려고 최상위 컴포넌트에 상태를 올리는 게 자연스럽지는 않았습니다.

**검색어를 URL 쿼리에 담고, `push`가 아닌 `replace`로 반영했습니다.**

검색어가 `ref`에만 있으면 새로고침할 때 날아가고 링크를 공유해도 검색 결과가 안 열립니다.
`?search=` 쿼리로 옮기니 두 문제가 같이 해결됐습니다.

처음에 `router.push`로 만들었더니 글자를 칠 때마다 히스토리가 쌓여서, 뒤로가기를 누르면 검색어가 한 글자씩 지워졌습니다.
한글은 조합 단계마다 이벤트가 나서 더 심했습니다.
`replace`로 바꾸니 현재 항목을 덮어써서 히스토리가 깨끗해졌습니다.
6장에서 "뒤로 가기 불가"가 `replace`의 특징으로 나왔는데, 여기서는 그게 장점이 되는 경우였습니다.

**`params`와 `query`를 용도에 따라 나눴습니다.**

상세 페이지의 도시 ID는 `params`로, 검색어는 `query`로 넣었습니다.
리소스를 식별하는 값은 경로에, 필터나 상태는 쿼리에 두는 게 맞다고 판단했습니다.
백엔드에서 `@PathVariable`과 `@RequestParam`을 나누던 기준과 같았습니다.

</details>

<details>
<summary><b>과제 5 — Weather Store (Ch7 Hands on, p.212)</b></summary>

<br>

| 요구사항 | 구현 |
|---|---|
| configStore | state `unit` / getters `unitSymbol` / actions `toggleUnit` |
| 1. UnitToggler.vue | 스토어를 직접 사용. props·emits 없음 |
| 2. Nav Bar 옆 배치 | `App.vue`의 네비게이션 우측 |
| 3. 메인·상세 단위 적용 | 홈 `convertTemp`, 상세 `displayTemp` |

### 추가로 넣은 것 (요구사항 4)

| 대상 | 내용 |
|---|---|
| `configStore` 확장 | `sortOrder`(state) / `sortLabel`(getters) / `toggleSort`(actions) |
| `favoriteStore` 신설 | `favoriteIds` / `favoriteCount`·`hasFavorite` / `toggleFavorite`·`isFavorite` |

### 이렇게 판단했습니다

**`provide`/`inject`로 우회했던 즐겨찾기를 Pinia로 옮겼습니다.**

과제 4에서는 형제 라우트끼리 상태를 공유할 방법이 없어서 `favoriteIds`를 `App.vue`로 올리고 `provide`했습니다.
동작은 했지만 화면을 그리는 컴포넌트가 전역 상태까지 들고 있는 구조가 어색했습니다.

`favoriteStore.js`로 옮기니 `App.vue`에서 상태 선언과 `watch`가 전부 빠졌습니다.
p.199 표에서 provide/inject와 Store를 비교해 둔 이유를 두 방식을 다 써보고 나서야 알게 됐습니다.
"아무 곳에서나 수정 가능해서 추적이 어렵다"는 설명이, `App.vue`에 함수를 두고 두 화면에서 `inject`해 쓰던 상황과 정확히 맞았습니다.

**`isFavorite`는 getter가 아니라 action으로 만들었습니다.**

`favoriteCount`는 인자가 없어서 `computed`로 만들 수 있었는데, `isFavorite(cityId)`는 도시 ID를 받아야 했습니다.
`computed`는 인자를 받을 수 없어서 일반 함수로 두었습니다.
과제 2에서 `convertTemp`를 `computed`로 안 바꾸고 함수로 남겨둔 것과 같은 이유였습니다.

**정렬을 원본 배열 수정에서 `sortOrder` 상태로 바꿨습니다.**

기존 `sortByTemp`는 `weatherList`를 통째로 정렬된 배열로 덮어쓰고 있어서 원래 순서로 돌아갈 방법이 없었습니다.
`configStore`에 `sortOrder`를 두고 `computed`로 파생시키니 원본이 그대로 남아 `none`으로 되돌릴 수 있게 됐습니다.
`toSorted()`를 쓴 덕분에 이 전환이 쉬웠습니다.

**단위 값은 `'C'`가 아니라 `'celsius'`로 바꿨습니다.**

기존에는 `unit`이 `'C'`/`'F'`라서 `°${unit}`으로 기호를 만들 수 있었습니다.
자료가 초기값을 `'celsius'`로 지정하면서 이 방식이 안 통하게 됐고, 그래서 `unitSymbol` getter가 필요해졌습니다.
요구사항이 왜 굳이 getter를 요구했는지 이때 알았습니다.

### 알고 있는 한계

홈의 `convertTemp`와 상세의 `displayTemp`가 같은 화씨 변환 공식을 중복해서 갖고 있습니다.
자료 p.212도 "유사한 코드가 중복됨 → Composable로 해결 가능(범위 제외)"이라고 짚어두었습니다.
지금은 범위 밖이라 그대로 두었고, 변환 로직을 `useTemperature()` 같은 Composable로 묶는 것이 해결책이라고 이해했습니다.

</details>

<details>
<summary><b>과제 6 — Weather Axios (Ch8 Hands on, p.230)</b></summary>

<br>

지금까지 하드코딩해 온 목 데이터를 실제 API 응답으로 교체하고, 화면을 확장했습니다.

| 요구사항 | 구현 |
|---|---|
| 1. 실제 날씨 데이터 적용 | `weatherStore`에서 Current Weather API 호출, 홈·상세·즐겨찾기가 모두 이 데이터를 공유 |
| 2. OpenWeatherMap API 추가 | 날씨 아이콘 / 5 Day Forecast / Air Pollution / Geocoding |
| 3. 기타 외부 API 추가 | Pexels로 날씨 상태에 맞는 상세 페이지 배경 이미지 |

### 화면별로 추가한 것

| 화면 | 내용 |
|---|---|
| 홈 | 실시간 날씨, 날씨 아이콘, 선택 도시 기준 배경 그라디언트, 도시 추가·삭제 |
| 상세 | 좌우 2단 레이아웃, Pexels 배경, 시간별 예보 차트(탭 4종), 대기질, 도시 간 이동 |

### 이렇게 판단했습니다

**6개 도시를 `Promise.all`로 한 번에 요청했습니다.**

처음에는 반복문 안에서 `await`을 쓰려고 했는데, 그러면 앞 도시의 응답을 받아야 다음 요청이 나가서 6배가 걸립니다.
서로 의존 관계가 없는 요청이라 1일차에 배운 `Promise.all`로 묶었습니다.
개발자도구 Network 탭에서 요청 6개가 나란히 출발하는 걸 보고 차이를 확인했습니다.

한 가지 더 신경 쓴 것은 `Promise.all`이 하나라도 실패하면 전체가 reject된다는 점이었습니다.
도시 하나가 실패했다고 나머지 5개까지 못 보면 안 되니, 개별 조회 함수 안에서 `try/catch`로 잡고 빈 데이터를 반환하도록 했습니다.
그러면 바깥 `Promise.all`은 항상 성공합니다.

**같은 요청을 두 번 하지 않도록 스토어에서 캐싱했습니다.**

홈 → 상세 → 홈으로 오갈 때마다 API를 다시 부르면 무료 티어 한도가 금방 찹니다.
`onMounted`에서 `if (!hasData)` 로 검사해 이미 데이터가 있으면 건너뛰게 했습니다.

예보·대기질·배경 이미지도 각 스토어에서 도시별, 검색어별로 캐싱했습니다.
특히 배경 이미지는 날씨 상태가 몇 종류뿐이라 캐싱 효과가 컸습니다.

**상세 페이지에서 `onMounted` 대신 `computed`로 도시를 찾았습니다.**

과제 4에서는 `onMounted` 안에서 `route.params.cityId`로 도시를 찾았습니다.
이번에 우측 패널에 다른 도시로 이동하는 목록을 만들면서 문제가 드러났습니다.
같은 라우트에서 파라미터만 바뀌면 Vue Router가 컴포넌트를 재사용하기 때문에 `onMounted`가 다시 실행되지 않았습니다.

`computed`로 바꾸니 `route.params.cityId`를 의존성으로 추적해서 자동으로 다시 계산됩니다.
`watch`를 따로 걸 필요도 없어졌습니다.

**API 키를 `.env.local`로 분리했습니다.**

자료 p.224는 API 키를 코드에 직접 적어두는데, 과제 저장소가 Public이라 그대로 커밋하면 안 되겠다고 생각했습니다.
`.env.local`은 `.gitignore`의 `*.local` 규칙에 걸려서 저장소에 올라가지 않습니다.

다만 `VITE_` 접두사가 붙은 값은 빌드 결과물에 문자열로 박히기 때문에 브라우저에서 확인할 수 있습니다.
완전히 감추는 것은 아니고, 저장소에 남기지 않아 봇 수집을 피하고 키를 교체하기 쉽게 만드는 정도라고 이해했습니다.
정말로 감춰야 하는 키라면 백엔드를 거쳐야 한다는 것도 같이 알게 됐습니다.

**예보 차트는 SVG `polyline`으로 직접 그렸습니다.**

차트 라이브러리는 9장 범위라 쓰지 않았습니다.
값의 최소·최대를 잡고 그 안에서 비율로 y좌표를 환산하는 방식인데, 과제 1에서 온도 게이지 너비를 계산할 때와 같은 발상이었습니다.
다만 이번에는 범위가 고정값이 아니라 데이터에 따라 자동으로 정해집니다.

탭을 4개 만들면서 `activeTab` 하나만 바꾸면 값 배열과 좌표가 연쇄적으로 다시 계산되도록 `computed`를 엮었습니다.
강수확률이 모두 0%일 때 최대·최소가 같아져서 0으로 나누는 문제가 생겨, `max - min || 1` 로 방어했습니다.

**Pexels는 키를 헤더로 보냅니다.**

지금까지 다룬 API는 전부 키를 쿼리 스트링으로 보냈는데 Pexels는 `Authorization` 헤더를 씁니다.
`axios.get(url, { headers: { ... } })` 형태로 config에 넣어 해결했습니다.
p.226 표의 `axios.get(url, [config])` 형식이 이런 경우에 쓰인다는 걸 알게 됐습니다.

사진 위에 흰 글자를 얹어야 해서 가독성이 걱정됐는데, 어두운 그라디언트 오버레이를 한 겹 덮어 해결했습니다.
Pexels 가이드라인에 사진작가 크레딧 표기 조항이 있어서 우측 하단에 원본 링크와 함께 넣었습니다.

**flex 안에서 넘치는 요소 때문에 레이아웃이 무너졌습니다.**

예보 차트를 좌측 히어로 영역에 넣었더니 우측 패널이 찌그러졌습니다.
`overflow-x: auto`를 줬는데도 스크롤이 생기지 않았습니다.

flex 아이템의 `min-width` 기본값이 `auto`여서 "내용물보다 작아지지 않는다"는 것이 원인이었습니다.
바깥 컨테이너부터 스크롤 영역까지 `min-width: 0`을 이어서 지정하니 해결됐습니다.

### 알고 있는 한계

추가한 도시는 새로고침하면 사라집니다. `weatherList`가 메모리에만 있기 때문입니다.
7장 p.209의 `authStore`가 `localStorage`를 함께 쓰던 것처럼 동기화하면 해결되지만, 요구사항 범위가 아니라 그대로 두었습니다.

무료 티어의 5 Day Forecast는 3시간 간격이라 시간별 그래프의 촘촘함이 실제 날씨 서비스보다 덜합니다.
1시간 간격은 유료 API에서만 제공됩니다.

</details>

<details open>
<summary><b>과제 7 — Weather UI Library (Ch9 Hands on, p.249)</b></summary>

<br>

요구사항 1~3은 과제 6과 동일한 문구라 그대로 유지하고, "외부 UI Library를 선정하고 자유롭게 적용한다"는 첫 줄에 집중했습니다.

| 항목 | 내용 |
|---|---|
| 선정한 라이브러리 | PrimeVue (Aura 프리셋) |
| 실습용 | Element Plus — Ch9 Code Challenge 3종은 자료대로 유지 |
| 레이아웃 | 전체 폭 전환, sticky 유리 헤더, 히어로 + 타일 그리드 |
| 모션 | 날씨별 CSS 애니메이션 배경, `TransitionGroup` 타일 전환, hover 마이크로 인터랙션 |
| 실습 페이지 | 챕터 탭 + 아코디언으로 재구성 |

### 이렇게 판단했습니다

**Element Plus 대신 PrimeVue를 골랐습니다.**

자료 p.233이 "국내에서는 Element Plus의 점유율이 높고 학습 난이도가 가장 낮다"고 적어둔 걸 보고, 오히려 다른 걸 써보면 차별화가 되겠다고 생각했습니다.
같은 표에서 PrimeVue를 "가장 트렌디하고 유연"하다고 평가한 것도 근거가 됐습니다.

다만 Ch9 Code Challenge 3개는 Element Plus로 만들라는 실습이라 그대로 두었습니다.
두 라이브러리가 한 프로젝트에 공존하게 되어 CSS 우선순위가 꼬일 수 있었는데, PrimeVue 설정의 `cssLayer` 옵션으로 레이어 순서를 명시해 해결했습니다.

**설치 직후 "Invalid PrimeUI License" 배지가 떴습니다.**

PrimeVue 컴포넌트 자체는 MIT지만 테마 패키지인 `@primeuix/themes`는 별도 라이선스였습니다.
과제 제출물에 저 배지가 박혀 있으면 안 되겠다 싶어서, 무료 Community 등급을 등록해 키를 받고 적용했습니다.

키도 저장소에 남기면 안 되니 API 키들과 같이 `.env.local`로 뺐습니다.

**동적인 느낌은 라이브러리가 아니라 직접 만들어야 했습니다.**

처음에는 UI 라이브러리를 바꾸면 화면이 살아날 줄 알았는데, 라이브러리가 주는 건 버튼과 인풋 같은 정적인 부품이었습니다.
움직임은 Vue 내장 `<TransitionGroup>`과 CSS 애니메이션으로 직접 만들었습니다.

`<TransitionGroup>`의 `move` 클래스가 가장 효과가 컸습니다.
정렬 기준을 바꾸면 타일들이 자리를 바꾸며 미끄러지는데, 이건 라이브러리로는 못 하는 것이었습니다.
사라지는 요소에 `position: absolute`를 주지 않으면 남은 타일이 툭 끊기며 자리를 채운다는 것도 이때 알았습니다.

**애니메이션 입자는 `computed`로 미리 만들어 두었습니다.**

빗줄기 60개의 위치와 속도를 `v-for` 안에서 `Math.random()`으로 뽑았더니, 리렌더링이 일어날 때마다 값이 새로 계산되어 비가 순간이동했습니다.
`computed`로 한 번만 만들어 재사용하니 해결됐습니다.
`ref`가 아니라 `computed`를 쓴 것은 이 값이 파생 데이터이고 바깥에서 바꿀 일이 없기 때문입니다.

**메인은 세로 목록에서 히어로 + 그리드로 바꿨습니다.**

화면 폭을 넓혔는데도 답답한 느낌이 남아 있었습니다.
회색 박스 안에 흰 박스가 들어간 이중 껍데기 구조였고, 도시 카드가 한 줄에 하나씩 놓여 가로 공간을 낭비하고 있었습니다.

선택한 지역을 위에 크게 띄우고 나머지를 타일 그리드로 깔았습니다.
`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` 로 잡으니 미디어 쿼리 없이도 화면 폭에 따라 열 개수가 알아서 바뀌었습니다.

기존 `WeatherCard`는 가로형이라 그리드에 맞지 않았지만, 과제 3·4의 결과물이기도 해서 지우지 않고 `WeatherTile`을 새로 만들었습니다.

**API 한글 번역이 어색해서 기상 코드로 직접 매핑했습니다.**

`lang=kr`로 받은 설명이 "실 비", "온흐림", "튼구름"처럼 어색했습니다.
응답의 `weather[0].id`가 언어와 무관한 숫자 코드라는 걸 보고, 이걸 키로 삼아 한글 표를 만들었습니다.

`description`을 키로 쓰면 언어 설정을 바꾸는 순간 매핑이 전부 깨지지만, 숫자 코드는 어느 언어로 받아도 같습니다.
표에 없는 코드가 와도 화면이 비지 않도록 API 원문을 폴백으로 두었습니다.

**실습 30개를 챕터 탭 + 아코디언으로 정리했습니다.**

실습 컴포넌트가 30개를 넘어가면서 한 페이지에 나열하는 방식이 한계에 왔습니다.
좌측에 챕터 목록, 우측에 해당 챕터의 실습을 아코디언으로 놓고 자료 페이지 번호를 배지로 달았습니다.

`<component :is="...">` 로 컴포넌트를 데이터처럼 배열에 담아 관리했습니다.
`v-if`로 펼친 것만 렌더링하니 타이머가 도는 실습이 백그라운드에서 계속 실행되는 문제도 같이 해결됐습니다.

**전역 CSS를 정리하고 나서야 반복되던 문제가 사라졌습니다.**

카드를 만들 때마다 다크 모드에서 글자가 안 보여 `color`를 다시 지정하고 있었습니다.
원인은 `base.css`의 `body { color: var(--color-text) }` 였고, 이 변수가 OS 다크 모드에서 밝은 회색이 되고 있었습니다.

배경과 글자색을 전역에서 고정하고, 스캐폴딩에 남아 있던 전역 `a` 스타일도 걷어냈습니다.
로고에 마우스를 올릴 때 각진 초록 박스가 뜨던 것도 그 규칙 때문이었습니다.

### 알고 있는 한계

Element Plus와 PrimeVue가 함께 설치되어 있어 번들 크기가 커집니다.
`cssLayer`로 충돌은 막았지만, 실제 서비스라면 하나로 통일하는 것이 맞습니다.
과제에서는 Ch9 Code Challenge 결과물을 남겨야 해서 공존시켰습니다.

</details>