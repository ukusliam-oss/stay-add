# STAY ADD. — Curiosity compounds.

Carbon / Paper / Signal Green과 과학적 생성형 시각화를 사용하는 반응형 학습 프런트엔드입니다. 공개 사이트는 학술 검토 전인 프로토타입입니다.

- [공개 웹사이트](https://ukusliam-oss.github.io/stay-add/)
- [과목 탐색](https://ukusliam-oss.github.io/stay-add/explore/)
- [공개 저장소](https://github.com/ukusliam-oss/stay-add)
- [단계별 실행 계획](docs/IMPLEMENTATION-PLAN.md)

P0에서 시험 기준은 Cambridge IGCSE 2028 · 과학 Extended로 확정했습니다. 언어 정책·독립 검토 역할은 미정이므로 G0는 아직 `not_ready`입니다. P1에서 G0의 미결정과 독립적인 정적 제품 구조를 구현했습니다. [구조 결정과 범위](docs/architecture/P1-STRUCTURE.md), [검증 기록](docs/architecture/P1-QA.md), [배포·복구 절차](docs/architecture/RELEASE.md)를 참고하세요.

## 실행

Node.js 24 권장. `npm ci --ignore-scripts`로 의존성을 설치합니다.

```sh
npm run dev
```

개발 주소는 `http://127.0.0.1:4321/stay-add/`입니다. 실제 배포 산출물은 다음으로 확인합니다.

```sh
npm run build
npm run preview
```

미리보기 주소는 `http://127.0.0.1:4173/stay-add/`입니다. Astro 7.4.4는 Node ≥22.23.4가 필요합니다. 지원되지 않는 로컬 Node에서는 실행 도우미가 고정된 npm Node 24.22.2로 Astro 명령만 실행합니다. 전역 Node를 바꾸지 않으며 최초 실행에 네트워크가 필요합니다. 모델 테스트와 미리보기 서버는 Node ≥22.18을 사용합니다.

## 검증과 공개 배포

```sh
npm run verify
```

정적 빌드 → TypeScript/Astro 검사 → P0 기록 검사 → 회귀 테스트 14개 → 모든 내부 링크·접근성 참조·JS/폰트 예산 검사 순서입니다. `npm test`는 기존 빌드에 대한 테스트만, `npm run check`는 빌드 이후 코드·기록·테스트만 실행합니다. `npm run foundation:ready`는 미결정 항목 때문에 현재 의도적으로 실패합니다. 데이터 무결성을 검사하는 `foundation:check`와 준비 판정은 다릅니다.

`main`에 푸시하면 GitHub Actions가 Node 24에서 `npm ci --ignore-scripts`와 `npm run verify`를 실행하고 생성한 `dist/`만 GitHub Pages에 배포합니다. 저장소 Pages의 소스는 GitHub Actions입니다. `/stay-add/` 기준 링크와 자원 경로를 공통 함수로 생성합니다. `dist/`는 Git 제외 생성물이며 직접 수정하지 않습니다.

로컬 접근성 도구는 미리보기 서버의 `/__qa`입니다. 경로 선택 후 axe 검사를 실행하거나, 스크립트를 차단한 iframe으로 정적 본문을 확인할 수 있습니다. 이 도구와 axe는 공개 산출물에 포함되지 않습니다.

## 실제 구현 범위

- 기존 대형 타이포그래피·수학적 입자 Hero·과목별 색상과 SVG 방향 아이콘.
- Explore, 네 과목 허브, 개념 미리보기 4개, Lab, Practice, Connect, Index의 독립 주소.
- 반응 속도 Lab: 온도·초기 농도·상대 표면적·촉매, 실행·정지·재개·초기화, 입자 표현, 선택/기준 곡선, 수치·CSV.
- 변화율·에너지 전달·피드백의 세 연결 주제와 각각 네 과목 관점.
- 검색과 독자 문항 1개, 선택별 피드백·힌트·네이티브 모범 답안 disclosure.
- JS 없이 읽을 수 있는 본문·MathML·출처·연결 설명·Lab 기준 곡선. 준비 후에만 활성화하는 인터랙티브 컨트롤.
- 키보드 탐색·네이티브 모달·포커스 복귀·모바일 메뉴·모션 감소 설정 및 정지.

정식 여덟 요소 Lesson, 검토된 문제은행, 공식 목표 매핑, 전체 syllabus 대응, 로그인·학습 기록은 미구현입니다. 기존 영어 UI를 유지하는 것은 새로운 언어 정책의 확정을 의미하지 않습니다. 콘텐츠는 Draft이며 공식 시험 자료가 아닙니다.

Lab은 실재 반응에 적합시킨 모델이 아닌, 표면적 배수를 포함하는 설명용 비가역 1차 반응 A → B 프록시입니다. 결정론적 계산과 입자 애니메이션은 분리됩니다. 입자 충돌을 계산하거나 실험값을 제공하지 않습니다.

`k = S × A × exp(-Ea / RT)`, `[B](t) = [A]₀(1-exp(-kt))`. 기본 25°C, S=1, Ea=40 kJ mol⁻¹에서 k=0.035 s⁻¹이 되도록 A를 정합니다. 촉매는 동일한 A와 Ea=35 kJ mol⁻¹입니다. 초기 농도는 k에 영향을 주지 않습니다. 화면 밖과 숨긴 탭에서는 실험을 자동 정지합니다.

## 구성

- `src/pages/`: 정적 경로와 페이지
- `src/components/`, `src/layouts/`, `src/styles/`: 공통 디자인·접근성 구조
- `src/data/`: 미리보기·연결·검색·주소 데이터
- `src/lib/model.ts`: 계산·단위·CSV
- `src/scripts/`: 필요한 페이지의 인터랙션, Lab 지연 로드
- `public/`, `src/assets/`: 로컬 아이콘·폰트·라이선스
- `tests/`, `scripts/`: 회귀 검사·산출물 감사·실행 도우미
- `docs/foundation/`: 역사적 P0 기준선과 미결정 기록
- `docs/architecture/`: P1 결정·검사·배포·복구 기록
- `artifacts/`, `.sites-local/`: Git 제외 로컬 검증 자료

폰트는 로컬 WOFF2와 SIL Open Font License를 포함합니다. 제품에 외부 폰트·분석 스크립트·서버 저장·비밀 키는 없습니다. 폭 조절 검사를 실제 휴대폰 검사, 자동 검사 결과를 접근성 인증, 번들 크기를 실사용 Core Web Vitals 달성으로 표현하지 않습니다.
