# P1 · 디자인과 정적 제품 구조

기록일: 2026-11-01 (Asia/Shanghai). 작업 ID ARC-001. 요구 R-01, R-06, R-08, R-09. 개발·구현 검증은 이 작업에서 수행했으며, 독립 학술 검토는 수행하지 않았다.

## 판정과 범위

사용자의 “2단계” 실행 지시에 따라 G0의 미결정 사항과 독립적인 기술 기반을 구현했다. **G1의 기술 수용 기준은 검증했다. G0는 D-02 언어와 D-03 독립 검토 역할 지정 대기로 여전히 `not_ready`다.** 정식 학습 콘텐츠 출시와 P2의 교육과정 대응 완료를 뜻하지 않는다. 기존 영어 UI를 유지하며 새 언어 정책으로 확정하지 않는다.

기존 네 과목 미리보기, 설명용 Lab 1개, 독자 문항 1개, Connect 3주제·12개 관점을 새 주소에 배치했다. 학술 내용·모델 상수·정답 규칙을 확장하거나 검토 완료로 승격하지 않았다. 모든 개념은 Draft다. 여덟 요소의 정식 Lesson, 문제은행, 목표 매핑, 계정·학습 기록은 후속 단계다.

## ADR-001 · Astro와 TypeScript의 정적 출력 채택

단일 HTML과 전체 기능 스크립트를 Astro 7.4.4의 정적 다중 페이지와 TypeScript 6.0.3으로 옮겼다. GitHub Pages에 서버 없이 HTML/CSS/JS/폰트만 배포한다. 공통 컴포넌트는 빌드 때 HTML로 합쳐지며 React 실행 환경은 추가하지 않았다. 초기 JS와 폰트 예산, 직접 주소, JS 없는 본문, 기존 Hero 회귀 검증을 근거로 채택했다.

Astro 6.4.8을 검토했으나 의존성 검사에서 알려진 문제가 확인돼 수정된 7.4.4로 변경했다. Node.js 24를 권장한다. 이 컴퓨터의 기존 Node 22.23.1은 Astro의 최소 22.23.4보다 낮아 `scripts/astro.mjs`가 npm의 고정된 Node 24.22.2 패키지로 해당 명령만 실행한다. 전역 Node 설정은 바꾸지 않는다. 첫 사용에 네트워크가 필요하며 이후 npm 캐시를 사용한다. CI는 Node 24에서 직접 실행한다.

소스는 `src/`, 배포 산출물은 생성된 `dist/`다. `dist/`의 직접 수정과 Git 추적을 중단했다. 과거 정상 배포는 Git 이력에 남아 있다. 기존 프로젝트 밖의 파일은 변경하지 않았다. 별도 계획 Canvas의 진행 상태만 갱신했다.

## ADR-002 · 경로와 점진적 인터랙션

`src/lib/paths.ts`에서 `/stay-add/` 기준 경로, 끝 슬래시, canonical을 통일한다. 일반 링크는 실제 정적 주소를 갖는다. 검색·요약·안내 모달은 JS가 있을 때만 링크를 향상시킨다. 모바일 메뉴는 스크립트가 준비되지 않으면 탐색 링크를 그대로 표시한다. 초기 인터랙티브 컨트롤은 비활성 상태로 제공하고 준비 후 활성화한다.

- `/explore/`, `/subjects/{subject}/`, `/subjects/{subject}/{concept}/`: 과목 탐색과 기존 개념 미리보기 네 개.
- `/labs/`, `/labs/reaction-rates/`: 실험 목록과 독립 Lab.
- `/practice/`, `/practice/chemistry/reaction-rates/`: 기존 문항과 선택별 피드백.
- `/connect/`, `/connect/{connection}/`: 세 주제, 네 관점의 정적 설명과 관점 전환.
- `/index/`: 링크를 먼저 제공하는 개념 색인. JS 검색은 `?q=`와 새로고침을 지원한다.
- `/about/`, `/accessibility/`, `404.html`: 범위·접근성·개인정보와 없는 주소 안내.
- `/design-system/`: noindex 검토용 토큰·아이콘·버튼·폼·모달·상태·수식 표본.

총 22개 정상 경로와 404 문서, 23개 HTML이다. 구형 홈의 `#lab`, `#connect`, `#subjects`, `#practice`도 유지한다. 홈 Connect의 주제 전환은 현재 화면에서 동작하며 전용 Connect 페이지의 주제 링크는 실제 페이지를 이동한다.

## ADR-003 · 학습 본문과 계산의 분리

본문·출처·목차·수식·연결의 네 관점·문항 모범 답안은 초기 HTML에 있다. Connect의 전체 설명과 모범 답안은 네이티브 `details`로 읽는다. Lab의 기본 곡선과 수치는 빌드 때 같은 계산 모델에서 생성한다. JS가 없으면 변수 조작은 비활성 상태이고 안내를 표시한다.

Lab은 화면에 가까워졌을 때 동적 import로 계산·입자 코드를 읽는다. 계산은 `src/lib/model.ts`, 입자 표현은 `src/scripts/lab.ts`에 분리한다. 시각화는 최대 2배 해상도, 약 30fps이며 화면 밖 Canvas 그리기와 숨긴 탭의 진행을 중단한다. 모션 토글과 시스템 모션 감소 설정을 공유한다. 실험은 화면 밖과 숨긴 탭에서 자동 정지한다. 데이터는 서버로 보내지 않는다.

## ADR-004 · 수식 표시

이번 네 개 정적 수식에는 네이티브 MathML을 채택했다. 분수·첨자·극한 구조, 텍스트 접근 이름과 기호·단위 설명을 HTML로 제공한다. 320px의 가장 긴 미분 수식을 실제 렌더링해 확인했다. 추가 수식 JS·폰트는 0바이트다. KaTeX는 이번 범위에 추가하지 않았다. 더 복잡한 수식과 지원 브라우저·스크린리더 요구가 생기면 비교를 다시 한다. 현재 검사로 모든 보조 기술의 수학 낭독 품질을 확정하지 않는다.

## 재사용 요소와 디자인 보존

Carbon #111513 / Paper #F0F0E9 / Signal Green #C9FF61 및 과목별 색상, Space Grotesk / IBM Plex Mono, Hero의 수학적 입자 구체를 보존했다. 디자인 토큰·본문·새 제품 페이지 스타일을 분리했다. Header, Footer, Action, Icon/Sprite, DraftNotice, PageMasthead, SubjectList/Art, Formula, ReactionLab, Practice, ConnectionExplorer, Dialogs를 공유한다. 방향·재생·정지·초기화 아이콘은 SVG이며 운영체제 이모지 렌더링에 의존하지 않는다.

## 검증 증거

재현: `npm ci --ignore-scripts` → `npm run verify`. CI도 같은 순서로 빌드한 `dist/`를 배포한다. 상세 자동 검사 수치는 동봉한 `build-report.json`, 검사 범위와 제한은 `P1-QA.md`, 공개 반영과 복구 절차는 `RELEASE.md`에 기록한다. 생성 보고서 원본과 화면·브라우저 결과는 Git 제외 로컬 `artifacts/p1-*`에 보존한다.

## 참고한 1차 자료

- [Astro의 GitHub Pages 배포](https://docs.astro.build/en/guides/deploy/github/)
- [Astro 클라이언트 스크립트](https://docs.astro.build/en/guides/client-side-scripts/)
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)
- [Astro 보안 수정 공지](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2)
- [MDN MathML](https://developer.mozilla.org/en-US/docs/Web/MathML)
