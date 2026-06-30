# 온라인 문의 → Google 스프레드시트 연결 방법

온라인 문의 폼 제출 내용을 구글 시트에 자동으로 쌓습니다. 한 번만 설정하면 됩니다.

## 1. 구글 시트 만들기
1. https://sheets.google.com 에서 새 시트 생성 (예: "신검단 로열파크씨티 문의")
2. 1행에 헤더 입력(선택): `시간 | 성함 | 연락처 | 관심타입 | 문의내용 | 단지`

## 2. Apps Script 붙여넣기
1. 그 시트에서 메뉴 **확장 프로그램 → Apps Script**
2. 기본 코드를 모두 지우고 아래를 붙여넣기 → 저장

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = e.parameter;
    sheet.appendRow([
      p.submittedAt || new Date(),
      p.name || '',
      p.phone || '',
      p.unitType || '',
      p.message || '',
      p.property || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## 3. 웹앱으로 배포
1. 우측 상단 **배포 → 새 배포**
2. 유형 선택 ⚙️ → **웹 앱**
3. 설정:
   - 실행 계정: **나(본인)**
   - 액세스 권한: **모든 사용자(Anyone)**
4. **배포** → 권한 승인(본인 구글 계정)
5. 생성된 **웹 앱 URL** 복사 (`https://script.google.com/macros/s/.../exec`)

## 4. 사이트에 URL 연결
`content/sample-property/data.json` 의 `contact.formEndpoint` 값에 위 URL을 붙여넣기:

```json
"formEndpoint": "https://script.google.com/macros/s/AKfyc.../exec"
```

저장하고 새로고침하면, 폼 제출 시 해당 시트에 한 줄씩 자동 입력됩니다.

> 참고: 브라우저 CORS 때문에 전송은 `no-cors` 방식이라 응답 본문은 못 읽지만, 시트에는 정상 기록됩니다. URL이 비어 있으면 폼은 안내 알림만 띄우고 전송하지 않습니다.
