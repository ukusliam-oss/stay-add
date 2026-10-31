# STAY ADD. — Curiosity compounds.

실제로 조작할 수 있는 반응형 프런트엔드 프로토타입입니다. 기존 프로젝트와 분리된 새 폴더에 구현했습니다.

공개 웹사이트: [ukusliam-oss.github.io/stay-add](https://ukusliam-oss.github.io/stay-add/)

공개 저장소: [github.com/ukusliam-oss/stay-add](https://github.com/ukusliam-oss/stay-add)

## GitHub Pages 배포

`main`에 푸시하면 GitHub Actions가 Node.js 24에서 `npm ci --ignore-scripts`와 `npm run check`를 실행한 뒤 `dist/`만 GitHub Pages에 배포합니다. 수동 배포는 저장소 Actions의 `Verify and deploy GitHub Pages`에서 실행할 수 있습니다. 별도 배포 토큰이나 외부 서비스 키가 필요하지 않습니다.

GitHub Pages 설정의 배포 소스는 **GitHub Actions**입니다. 모든 앱 파일 참조가 상대경로이므로 `/stay-add/` 하위 주소에서도 작동합니다.

## 실행

Node.js 20 이상에서 `npm run dev`를 실행하고 표시되는 로컬 주소를 엽니다. 기본 주소는 `http://127.0.0.1:4173`입니다. 배포할 때는 `dist/`를 정적 사이트로 제공하면 됩니다. 제품 실행에는 패키지 설치나 빌드 단계가 필요하지 않습니다.

`npm run check`는 JavaScript 구문과 9개 모델·콘텐츠·대비 테스트를 검사합니다. `npm test`는 테스트만 실행합니다.

접근성 자동 검사를 재현하려면 `npm ci` 후 개발 서버의 `/__qa`를 열고 검사 버튼을 누르세요. 이 경로와 axe-core는 개발 서버에만 있고 `dist/`에 포함되지 않습니다.

## 구현 범위

- Carbon / Paper / Signal Green, Space Grotesk / IBM Plex Mono, Neo-Swiss 그리드와 과목별 색상.
- 포인터·주파수·일시정지에 반응하는 수학적 입자 Hero.
- Chemistry, Biology, Physics, Additional Mathematics의 독립적인 개념 미리보기 4개.
- 반응 속도 Lab: 온도·초기 농도·상대 표면적·촉매, 실행·정지·재개·초기화, 입자 표현, 기준/선택 곡선, 수치 및 CSV.
- 변화율·에너지 전달·피드백의 3가지 연결과 각각 4개 과목 관점.
- 검색, 독자적으로 작성한 연습문제 1개, 선택별 피드백과 힌트.
- 모바일 메뉴, 네이티브 모달, 키보드 컨트롤, 장치의 움직임 감소 선호 반영, 현재 탭 세션 내 모션 토글.
- 프로토타입 범위, 학습 콘텐츠 검토 상태, 모델 가정·한계·출처, 접근성·개인정보 안내.

## 교육 콘텐츠와 모델

정식 강좌, 검증된 문제은행, 시험위원회·syllabus·시험 연도 매핑, 로그인, 학습 기록은 구현하지 않았습니다. 초안 상태를 화면과 모달에서 표시합니다.

Lab은 실재 반응에 적합시킨 모델이 아닌, 표면적 배수를 포함하는 설명용 비가역 1차 반응 A → B 프록시입니다. `dist/model.js`의 결정론적 계산과 입자 애니메이션은 분리됩니다. 입자 충돌을 계산하거나 실제 실험값을 제공한다고 주장하지 않습니다.

수식: `k = S × A × exp(-Ea / RT)`, `[B](t) = [A]₀(1-exp(-kt))`. 기본 25 °C, S=1, Ea=40 kJ mol⁻¹에서 k=0.035 s⁻¹이 되도록 A를 정합니다. 촉매는 동일한 A와 Ea=35 kJ mol⁻¹를 사용합니다. 초기 농도는 k에 영향을 주지 않습니다. 화면 밖이나 숨긴 탭에서는 진행을 자동 정지합니다.

## 구성

- `dist/index.html`: 의미 구조와 본문
- `dist/style.css`: 디자인 토큰과 반응형 스타일
- `dist/app.js`: UI, 네이티브 Canvas와 SVG
- `dist/content.js`: 미니 레슨, 검색 색인, Connect 데이터
- `dist/model.js`: 계산 및 CSV 내보내기
- `tests/`: 재실행 가능한 테스트와 로컬 접근성 감사 도구
- `docs/QA.md`: 확인한 항목과 한계
- `artifacts/`: 로컬 검증 이미지와 배포 산출물. Git에서 제외됨.

폰트는 로컬 WOFF2로 제공하며 SIL Open Font License를 포함합니다. 이미지·외부 UI 라이브러리·분석 스크립트·외부 폰트 요청은 없습니다. 접근성 인증과 실사용 Core Web Vitals를 달성했다는 주장은 하지 않습니다.
