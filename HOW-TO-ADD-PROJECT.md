# 새 프로젝트 추가 방법

## 폴더 구조 만들기

```
content/
  [프로젝트-slug]/         ← 영문, 소문자, 하이픈 사용 (예: gangnam-tower)
    data.json
    images/
      hero/               ← 메인 슬라이드 이미지 (1~5장 권장, 가로형)
      gallery/            ← 갤러리 이미지 (자유롭게, 가로형 권장)
      floorplan/          ← 평면도 이미지 (타입별 1장씩)
      location/           ← 위치 지도 이미지 또는 항공뷰
```

## data.json 작성

`content/sample-property/data.json`을 복사해서 수정하세요.

| 항목 | 설명 |
|------|------|
| `slug` | URL에 쓰이는 영문 식별자 (폴더명과 동일하게) |
| `name` | 건물/프로젝트 한글 이름 |
| `subtitle` | 짧은 슬로건 |
| `address` | 주소 |
| `description` | 개요 설명 (2~4문장) |
| `specs` | 건물 스펙 (키-값 자유롭게 추가) |
| `highlights` | 특장점 목록 (5~7개 권장) |
| `units` | 세대 타입 목록 (type, area, households, price) |
| `images.hero` | 히어로 슬라이더 이미지 경로 목록 |
| `images.gallery` | 갤러리 이미지 경로 목록 |
| `images.floorplan` | 평면도 이미지 경로 목록 (units 순서와 동일하게) |
| `images.location` | 위치 이미지 |
| `mapEmbed` | 카카오맵/네이버지도 embed URL (있으면 지도 이미지 대신 표시) |
| `contact` | 전화, 이메일, 상담시간, 홍보관 주소 |

## projects.json에 등록

```json
{
  "slug": "gangnam-tower",
  "name": "강남 타워",
  "address": "서울특별시 강남구 ...",
  "thumbnail": "hero/01.jpg"
}
```

## 이미지 권장 사이즈

| 위치 | 권장 사이즈 | 비율 |
|------|------------|------|
| hero/ | 1920×1080px | 16:9 |
| gallery/ | 1200×900px | 4:3 |
| floorplan/ | 1200×900px | 4:3 |
| location/ | 1200×900px | 4:3 |

- 파일 형식: JPG (품질 80~85%), 또는 WebP
- 파일명: 01.jpg, 02.jpg … (순서대로)

## 페이지 URL

- 개발(로컬): `property.html?p=gangnam-tower`
- 서버(Netlify/Vercel 등): `yourdomain.com/gangnam-tower`
  → `_redirects` 또는 `vercel.json` 설정 필요 (별도 안내 예정)
