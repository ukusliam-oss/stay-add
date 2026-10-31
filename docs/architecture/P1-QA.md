# P1 검증 기록

실행일: 2026-11-01 (Asia/Shanghai). 이 문서는 이번 기술 구조의 검사 범위다. P0 기준선 문서와 기존 QA 기록은 이전 버전의 역사로 유지한다.

## 자동 검사

`npm run verify`는 정적 빌드, Astro/TypeScript 진단, P0 기록 무결성, 14개 회귀 테스트, 전체 산출물 링크·프래그먼트·접근성 참조·JS/폰트 예산을 검사한다. 시험 기준의 메타데이터 무결성은 통과해도 G0 준비 판정은 D-02/D-03 때문에 `not_ready`다.

테스트는 기존 모델의 보존 관계·대표값·극한·입력 오류·CSV 일치, 모든 검색/Connect 목적지, JS 실행 전 본문·MathML·출처·검토 상태, 기준 곡선과 비활성 컨트롤, 정적 disclosures, SVG 아이콘 회귀와 색상 대비를 다룬다. 실제 출력의 수치는 `build-report.json`에 있다. `npm audit` 결과는 알려진 취약점 0건이었다. 보안 인증을 뜻하지 않는다.

## 브라우저 수동 검사

ChatGPT in-app browser에서 제작한 실제 정적 산출물을 검사했다. 데스크톱 브라우저의 viewport 검사이며 실제 iPhone/Android 기기 검사가 아니다.

- 홈, Explore, 가장 긴 수학 미리보기, Lab, Connect, Index를 각각 320/375/768/1024/1440 CSS px에서 확인했다. 총 30개 조합에서 문서 가로 넘침과 main 요소의 오른쪽 넘침이 없었다.
- Explore → Chemistry → 미리보기 → Lab → Practice 링크를 따라 이동했다. 개념 직접 주소·새로고침, 검색 결과의 뒤로/앞으로 이동이 성립했다.
- 요약 모달을 닫으면 원래 Quick summary 링크에 포커스가 돌아왔다. 모바일 메뉴의 Escape 닫기와 포커스 복귀, 검색 모달 초기 포커스를 확인했다.
- 모바일에서 슬라이더의 End 키로 온도 60°C·농도 2.00을 선택하고 촉매를 켰다. 초기 상대 속도 66.26×가 표시됐다. 실행 후 6.2s·생성물 1.998을 표시하고 정지했다. CSV가 실제 다운로드됐으며 초기화 후 0.0s·25°C·기본값이 돌아왔다.
- 문항 미입력 안내, A 오답 설명, B 정답 설명, 힌트 펼치기를 확인했다. 공식 시험 채점으로 표시하지 않는다.
- Index에서 energy 검색은 2개 결과, `?q=energy`를 표시하고 새로고침 후에도 유지됐다. 결과는 실제 Connect 주소로 이동했다.
- 전용 Connect에서 Physics 관점과 Feedback 페이지 이동을 확인했다. 홈 Connect의 Energy 전환은 홈 URL을 유지하며 설명을 변경했다.
- Hero의 주파수 7.0 및 모션 정지 상태가 반영됐다. 검사한 페이지의 브라우저 오류 로그는 없었다.

로컬 서버 첫 검사에서 홈 경로의 경계 검사가 루트 디렉터리를 거부하는 오류를 발견해 수정했다. 서버를 재시작한 뒤 HTTP 200과 홈 화면 및 30개 반응형 조합을 재검증했다. 이는 로컬 미리보기 서버의 문제였으며 GitHub Pages 경로에는 해당 코드가 배포되지 않는다.

## 스크립트를 차단한 상태

로컬 전용 감사 도구의 iframe을 `sandbox="allow-same-origin"`으로 설정해 `allow-scripts` 없이 로드했다. 수학 본문·네이티브 MathML·출처·Draft 상태를 읽었고, 실제 링크로 Connect로 이동한 뒤 네 관점의 disclosure를 열어 모두 읽었다. Lab 기준 SVG 곡선은 남고 실행 버튼은 비활성이었다. 이 검사와 별도로 빌드된 모든 미리보기에 본문·수식·출처가 들어 있는지 자동 검사한다.

## 접근성 자동 검사와 한계

axe-core 4.14.0, WCAG 2 A/AA·2.1 AA·2.2 AA 태그로 홈·Chemistry 미리보기·Mathematics 미리보기·Lab·Connect·Index·Practice·Design system의 8개 대표 화면을 검사했고 자동 위반은 0건이었다.

incomplete는 색상 대비였다. Canvas와 SVG 위의 좌표·범례·그래프 글자·map-caption, MathML의 연산자 일부를 자동으로 판정하지 못했다. 해당 요소의 선언된 전경/배경과 그림을 확인했으며 공통 대비 회귀 검사에서 관련 색상 쌍이 4.5:1 이상이다. MathML은 Carbon 글자와 과목별 밝은 배경을 사용한다. 자동 결과가 WCAG 준수 인증을 의미하지 않는다.

VoiceOver/NVDA 실제 낭독, 실제 iOS/Android, Safari/Firefox/Edge 호환성, 확대 전용 전체 검사, 저사양 장치 성능과 실사용 Core Web Vitals는 이번에 측정하지 않았다. P7에서 별도 증거가 필요하다.

## 로컬 증거

Git 제외 `artifacts/`에 `p1-build-audit.json`, `p1-responsive.json`, `p1-axe.json`, `p1-no-script.txt`, `p1-lesson-desktop.jpg`, `p1-math-mobile.jpg` 및 공개 반영 화면을 보존한다. 저장소에 동봉한 요약은 자동 검사 보고서의 시점별 사본이다.
