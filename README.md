# skala-vue

SK AX Full-stack Engineering 3 — Frontend Framework: Vue.js 과정 실습 저장소입니다.

강의에서 배운 문법을 하나씩 실습 컴포넌트로 만들고, 단원별 Hands on 과제를 구현하고 있습니다.

---

## 프로젝트 구조

```
src/
├── App.vue                             네비게이션 바 + RouterView
├── router/
│   └── index.js                        라우트 정의, 지연 로딩, Catch-all
├── stores/                             Pinia 전역 상태 저장소
│   ├── counter.js                      Code Challenge 실습용
│   ├── configStore.js                  온도 단위, 정렬 기준
│   └── favoriteStore.js                즐겨찾기 목록
├── views/                              페이지 단위 컴포넌트
│   ├── WeatherHomeView.vue             메인 대시보드 (과제 3의 WeatherParent)
│   ├── WeatherDetailView.vue           /weather/:cityId 상세 페이지
│   ├── WeatherAboutView.vue            서비스 소개
│   ├── FavoriteView.vue                즐겨찾기 목록
│   └── NotFoundView.vue                Catch-all Route
├── components/
│   ├── exercise/                       과제용 부품 컴포넌트
│   │   ├── WeatherMockup.vue           과제 1, 2
│   │   ├── BaseDashboardCard.vue       slot 기반 공통 레이아웃
│   │   ├── SearchBar.vue
│   │   ├── WeatherCard.vue
│   │   ├── WeatherBadge.vue
│   │   ├── TempGauge.vue
│   │   └── UnitToggler.vue             온도 단위 전환 (Pinia 직접 사용)
│   └── practices/
│       ├── PracticeIndex.vue           실습 컴포넌트 모음
│       ├── basic/                      실습 컴포넌트
│       └── library/                    Pinia 실습
└── assets/
```

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

**4일차 (p.196–212)**
Vue Router Hands on 과제를 진행하고 Pinia로 넘어갔습니다.
Store의 state / getters / actions 구조와 `storeToRefs`를 실습했습니다.

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

<details open>
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