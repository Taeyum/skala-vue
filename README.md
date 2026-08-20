# skala-vue

SK AX Full-stack Engineering 3 — Frontend Framework: Vue.js 과정 실습 저장소입니다.

강의에서 배운 문법을 하나씩 실습 컴포넌트로 만들고, 단원별 Hands on 과제를 구현하고 있습니다.

---

## 프로젝트 구조

```
src/
├── App.vue                             과제 / 실습 페이지 전환
├── components/
│   ├── exercise/
│   │   └── WeatherMockup.vue           과제 1, 2
│   └── practices/
│       ├── PracticeIndex.vue           실습 컴포넌트 모음
│       └── basic/                      실습 컴포넌트
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

**3일차 (p.145)**
Composition API Hands on 과제를 진행했습니다.

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

<details open>
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

---

## 실습하면서 막혔던 것들

<details>
<summary>Prettier를 돌렸더니 화면이 통째로 깨졌습니다.</summary>

<br>

카드를 클릭할 때 선택 상태와 상태바를 같이 바꾸려고 `@click` 안에 두 문장을 세미콜론으로 이어 썼습니다.
그런데 `npm run format`을 돌리자 Prettier가 세미콜론을 지웠고, 두 문장이 붙어버려서 Vue 컴파일러가 파싱을 못 했습니다.
p.95에서 간단한 연산은 인라인, 복잡한 로직은 함수로 빼라고 했던 게 이런 이유였구나 싶었습니다.

</details>

<details>
<summary>체크박스가 화면 폭만큼 늘어났습니다.</summary>

<br>

과제 검색창을 넓히려고 CSS에 `input { width: 90% }`를 넣었는데, 실습 페이지의 체크박스와 라디오 버튼까지 전부 늘어나서 라벨이 화면 오른쪽 끝으로 밀려버렸습니다.
태그 선택자를 전역에 두면 어디까지 영향이 가는지 예상하기 어렵다는 걸 확인했습니다.
`.search-box input`처럼 범위를 좁히거나 `<style scoped>` 안에 넣는 쪽으로 정리했습니다.

</details>