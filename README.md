# 신검단 로열파크씨티 Ⅱ — 분양 홍보 웹사이트

인천 서구 검단신도시 **신검단 로열파크씨티 Ⅱ** 분양 홍보용 정적 웹사이트입니다.

---

## 기술 스택

- **HTML / CSS / Vanilla JS** — 프레임워크 없는 순수 정적 사이트
- **GitHub Pages** — 무료 정적 호스팅
- **Google Apps Script** (예정) — 온라인 문의 폼 → Google Sheets 연동

---

## 프로젝트 구조

```
/
├── index.html                  # 메인 페이지
├── assets/
│   ├── css/style.css           # 전체 스타일
│   ├── js/property.js          # 슬라이더·라이트박스·문의폼·전화팝업 등
│   ├── img/                    # 공통 이미지 (로고 등)
│   └── logo_companies.svg      # 법적 정보 회사 로고 배너
├── content/
│   └── sample-property/
│       ├── data.json           # 물건 정보 (단지명, 세대수, 연락처 등)
│       └── images/             # 단지 이미지 (webp)
└── projects.json               # 물건 목록 (멀티 물건 확장 대비)
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 히어로 슬라이더 | 자동 슬라이드 + 인디케이터 |
| 갤러리 라이트박스 | 이미지 클릭 시 전체화면 확대 |
| 평면도 탭 | 타입별 전환 |
| 전화 연결 팝업 | `tel:` 링크 인터셉트 → 확인 모달 |
| 온라인 문의 폼 | (주석 처리) Google Sheets 연동 준비 완료 |
| 이미지 보호 | 우클릭·드래그 방지 |
| 반응형 | 모바일 / 태블릿 / PC 지원 |

---

## 콘텐츠 수정

모든 단지 정보는 **`content/sample-property/data.json`** 에서 관리합니다.

- 연락처 변경 → `contact.phone`
- 세대 정보 변경 → `units[]`
- 유튜브 영상 변경 → `videos[]`
- 온라인 문의 Google Sheets 연결 → `contact.formEndpoint` 에 Apps Script URL 입력

---

## Google Sheets 문의 연동 (예정)

1. Google Apps Script 웹앱 배포 (POST 수신)
2. `data.json` → `formEndpoint` 에 배포 URL 입력
3. `index.html` 온라인 문의 섹션 주석 해제

---

## 배포

GitHub Pages 를 통해 `main` 브랜치가 자동 배포됩니다.

```
https://hj-studio.github.io/singumdan_royalpark_city2/
```

---

## 관리

**HJ STUDIO** — 온라인 마케팅·부동산 홍보 전문
