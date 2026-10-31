# P0 실행 기록 — 기준선과 결정 확정

기준일: 2026-10-31 · 상태: 독립적으로 수행 가능한 조사·기록 완료, 사용자 선택 및 검토 역할 지정 대기.

**G0를 통과했다고 표시하지 않는다.** 시험 기준은 사용자 답변으로 확정했고, 아직 답변이 없는 학습 언어·검토 책임은 임의로 채우지 않았다. 다음 정식 콘텐츠 제작 단계로 넘어갔다고 주장하지 않는다.

## 1. 실제로 수행한 일

- 현재 공개 프로토타입의 코드, 모델, 문항, 검색 색인, 배포 기록을 조사했다.
- 실행 전 기준 커밋 `44661fd0b2b70db7a9fc0bfec93080ec9ceb6b65`와 실행 자원별 SHA-256을 기록했다. 이 해시는 앞으로 비교할 과거 기준선이며, 후속 문서 커밋의 HEAD와 같아야 한다는 뜻이 아니다.
- 기존 기술 검사 11개를 다시 실행했다. 학술 검토와 기술 검사를 구분했다.
- 공식 Cambridge 과목 페이지와 syllabus/업데이트 링크를 확인해 다섯 개 판본 후보와 세 개 선택 프로필을 등록했다.
- D-01~D-05 결정 기록, 책임 역할, 위험 목록, G0 통과 판정 규칙을 작성했다.
- 사용자에게 시험 기준·언어·독립 검토 담당에 대한 세 질문을 제시했다. 미제출된 선택지를 동의로 처리하지 않았다.

기록 파일: [기준선](baseline.json), [결정과 역할](decisions.json), [공식 자료 후보](curriculum-sources.json), [위험 목록](risks.json).

## 2. 현재 기능의 판정

작동하는 초안은 네 과목의 개념 미리보기 4개, 반응 속도 Lab 1개, 독자 문항 1개, Connect 3주제/12관점, 검색 항목 9개다. Hero 조작과 SVG 아이콘도 구현돼 있다. 기술적으로 작동한다는 뜻이며 검토된 정식 레슨 수나 교육과정 대응률로 바꾸어 계산하지 않는다.

독립적인 학술 검토 완료 기록은 현재 저장소와 대화에서 확인되지 않았다. 정식 Lesson 주소·교육과정 대응표·여러 실험의 공통 구조·일반화된 평가 엔진·개인 학습 기록은 미구현이다. 실제 휴대폰과 스크린리더 검사를 수행했다는 증거도 아직 없다.

현재 콘텐츠 상태는 Draft다. 공개 웹사이트의 배포 성공과 교육 자료의 Published/Verified 상태는 별개다.

## 3. 결정 기록

### D-01 시험 기준 — 사용자 답변으로 확정

사용자는 2026-10-31 질문에 **Cambridge IGCSE · 2028년 시험 · 과학 Extended**를 선택했다. 이에 따라 채택한 프로필은 `cambridge-igcse-2028-extended`다. Chemistry 0620·Biology 0610·Physics 0625는 2026–2028 판본, Additional Mathematics 0606은 2028–2030 판본을 참조한다. 과학의 Extended와 수학의 별도 분류를 구분한다. 다음 문단의 후보 목록은 선택 과정의 기록이다.

기존 요구에서 확정된 것은 IGCSE 중심의 Chemistry, Biology, Physics, Additional Mathematics다. 시험위원회, 실제 시험 연도, 응시 경로는 정해지지 않았다.

선택 가능하도록 준비한 후보는 Cambridge IGCSE 2027년 과학 Extended, Cambridge IGCSE 2028년 과학 Extended, 그리고 시험 대응을 주장하지 않는 범용 탐구 프로필이다. 다른 기준은 사용자 답변에 따라 등록할 수 있다. Additional Mathematics에 과학 과목의 Core/Extended 분류를 복사하지 않는다.

2027 프로필의 수학 후보는 2025–2027 판본이고, 2028 프로필의 수학 후보는 2028–2030 판본이다. 세 과학 과목은 두 프로필에서 모두 2026–2028 적용 판본을 참조한다. 모든 후보를 동시에 채택한 것은 아니며, 위 사용자 답변의 2028 프로필만 선택 결과다. [Biology 공식 자료](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-biology-0610/), [Physics 공식 자료](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-physics-0625/), [Additional Mathematics 공식 자료](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/)

등급도 과목별로 기록한다. 과학 후보의 A*–G 체계를 Additional Mathematics에 일괄 복사하지 않는다. 0606은 A*–E이며, 시험 경로와 계산기 사용 정책 역시 과목별로 확인해야 한다. [0606 평가 안내](https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf)

### D-02 언어와 범위 — 언어 선택 대기

현재 UI는 영어다. 한국어로 대화했다는 사실만으로 학습 과정 전체를 두 언어로 제작하기로 결정하지 않았다. 영어 중심, 영한 병행, 한국어 중심 중 사용자 선택을 기다린다.

작업 범위는 기존 계획의 제한 베타를 작업 기준으로 기록했다: 과목별 레슨 3개·Lab 1개·독자 문항 8개, 합계 12/4/32. 먼저 완성할 Chemistry 한 주제의 산출물은 이 총량에 포함한다. 이것은 제작 목표이며 현재 완료량 또는 전체 교육과정 크기가 아니다. 계정·동기화·대규모 그래프·공식 점수 예측은 초기 범위에서 제외한다.

### D-03 검토 책임 — 실제 지정 대기

제품 방향 결정은 프로젝트 소유자가, 구현과 기술 증거 수집은 Codex가 맡는다. 과목별 학술 검토, 독립 모델 검토, 실제 포함할 자료의 권리 확인 책임자는 아직 지정되지 않았다. 한 사람이 여러 역할을 맡을 수 있지만, 실제 배정과 책임 범위를 기록해야 한다.

담당자가 없으면 초안을 유지한다. 참고문헌 링크나 자동 검사 결과를 독립 학술 검토로 표시하지 않는다. 검토 담당을 지정하는 것과 해당 자료의 검토를 완료하는 것도 서로 다른 사실이다.

### D-04 구조 — 기존 지시에 따라 확정

GitHub 공개 저장소와 GitHub Pages 정적 배포를 유지한다. 현재 HTML/CSS/ES modules를 그대로 기준선으로 남긴다. Astro+TypeScript는 P1에서 검증할 후보이며, 이번 단계에서 이관하거나 채택 완료로 기록하지 않았다. 로그인이나 서버 저장을 핵심 학습의 필수 조건으로 만들지 않는다.

### D-05 공개 상태와 한계 표시 — 기존 요구에 따라 확정

초안·검토 중·검토 완료·공개·수정 필요를 분리한다. 설명용 모델과 실측 결과를 구분하고, 아직 대응하지 않은 시험 범위나 공식 점수를 제공한다고 표현하지 않는다. 제품의 CORE/DEEP/BEYOND와 시험기관의 내용·응시 분류도 별도로 다룬다.

## 4. 공식 자료 조사에서 확인한 것과 남은 것

다섯 후보 판본을 등록했다. Biology 0610의 표지에서는 Version 3, Physics 0625에서는 Version 2, Additional Mathematics 0606의 두 판본에서는 각각 Version 1을 확인했다. Chemistry 0620은 공식 페이지에서 해당 기간의 syllabus와 업데이트 링크를 확인했지만 본문 재조회가 반복 시간 초과돼 문서 버전은 미확인으로 남겼다. [Biology syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf), [Physics syllabus](https://www.cambridgeinternational.org/Images/697209-2026-2028-syllabus.pdf), [수학 2025–2027](https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf), [수학 2028–2030](https://www.cambridgeinternational.org/Images/745683-2028-2030-syllabus.pdf)

업데이트 PDF의 링크 확인은 해당 변경 내용의 검토 완료를 뜻하지 않는다. 공식 PDF 전체를 저장하거나 해시를 고정했다고 주장하지 않는다. 선택한 판본과 변경 사항의 재확인·고정은 P2 대응표를 만들기 전에 수행해야 한다. 저작권이 있는 PDF나 공식 문항을 공개 저장소에 복제하지 않았다. [Chemistry 공식 자료](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-chemistry-0620/)

## 5. G0 판정과 다음 행동

통과한 준비 항목은 기준선 확보, 현재 기능 분류, 제한 베타 작업 범위 기록, 정적 배포 제약, 공개 상태 정책, 후보 출처 식별, 위험 등록이다.

아직 충족되지 않은 항목은 D-02 언어, D-03 검토 책임이다. D-01은 사용자 답변으로 확정됐다. 현재 G0 상태는 `not_ready`다.

검증 명령은 다음과 같다.

```text
npm run foundation:check
npm run foundation:ready
```

첫 명령은 기록의 구조·참조·연도 일치·미응답 선택의 보존을 검사한다. 두 번째는 같은 검사에 G0 통과 조건을 추가하며, 미결정 상태에서는 의도적으로 실패한다. `foundation:check`가 성공했다는 이유로 단계 통과를 선언하지 않는다.

사용자 답변이 오면 선택 근거와 역할 배정을 기록하고 판정기를 다시 실행한다. 확인되지 않은 선택, 역할 또는 검토 완료를 임의로 입력하지 않는다. G0 통과 전에는 미확정 기준에 의존하는 정식 콘텐츠 제작을 시작하지 않는다.
