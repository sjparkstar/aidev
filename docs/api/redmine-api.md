# Redmine API 연동 가이드

## 🔌 Redmine REST API 개요

### **API 버전**: v1.0
### **베이스 URL**: `https://projects.rsupport.com`
### **인증**: API Key 기반

## 🔑 API 키 설정

### **API 키 발급**
1. Redmine 로그인
2. 계정 설정 → API 액세스 키
3. "API 액세스 키 표시" 클릭
4. 키 복사 및 안전 보관

### **환경변수 설정**
```env
# .env.local
REDMINE_URL=https://projects.rsupport.com
REDMINE_API_KEY=your-32-character-api-key-here
```

## 📡 주요 API 엔드포인트

### **프로젝트 관련**
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/projects.json` | 전체 프로젝트 목록 |
| GET | `/projects/{id}.json` | 특정 프로젝트 정보 |
| GET | `/projects/{id}/versions.json` | 프로젝트 버전 목록 |

### **이슈 관련**
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/issues.json` | 전체 이슈 목록 |
| GET | `/projects/{id}/issues.json` | 프로젝트별 이슈 목록 |
| GET | `/issues.json?fixed_version_id={vid}` | 특정 버전의 이슈들 |

### **사용자 관련**
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/users/current.json` | 현재 사용자 정보 |
| GET | `/users/{id}.json` | 특정 사용자 정보 |

## 🛠️ API 호출 예제

### **프로젝트 버전 목록 조회**
```bash
curl -H "X-Redmine-API-Key: your-api-key" \
     "https://projects.rsupport.com/projects/2024_qa_sebj/versions.json"
```

**응답 예시:**
```json
{
  "versions": [
    {
      "id": 123,
      "name": "v8.0.1",
      "description": "버그 수정 릴리스",
      "status": "open",
      "due_date": "2025-03-15",
      "created_on": "2025-01-01T00:00:00Z",
      "updated_on": "2025-02-01T00:00:00Z"
    }
  ]
}
```

### **버전별 이슈 목록 조회**
```bash
curl -H "X-Redmine-API-Key: your-api-key" \
     "https://projects.rsupport.com/projects/2024_qa_sebj/issues.json?fixed_version_id=123&limit=50"
```

## 🔧 Next.js API Routes 구현

### **프록시 패턴 구현**
```typescript
// app/api/redmine/projects/[identifier]/roadmap/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    const redmineUrl = process.env.REDMINE_URL;
    const apiKey = process.env.REDMINE_API_KEY;

    const response = await fetch(
      `${redmineUrl}/projects/${identifier}/versions.json`,
      {
        headers: {
          'X-Redmine-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## 🚨 에러 처리

### **HTTP 상태 코드**
| 코드 | 의미 | 해결 방법 |
|------|------|-----------|
| 200 | 성공 | 정상 처리 |
| 401 | 인증 실패 | API 키 확인 |
| 403 | 권한 없음 | 프로젝트 접근 권한 확인 |
| 404 | 리소스 없음 | URL 및 ID 확인 |
| 422 | 잘못된 요청 | 요청 파라미터 확인 |
| 500 | 서버 오류 | 서버 상태 확인 |

### **에러 응답 처리**
```typescript
const handleApiError = (error: any, response?: Response) => {
  if (response) {
    switch (response.status) {
      case 401:
        return 'API 키가 유효하지 않습니다.';
      case 403:
        return '프로젝트에 접근할 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 422:
        return '요청 파라미터가 잘못되었습니다.';
      default:
        return '서버 오류가 발생했습니다.';
    }
  }
  return '네트워크 오류가 발생했습니다.';
};
```

## 🔍 쿼리 파라미터

### **페이징**
- `offset`: 시작 위치 (기본값: 0)
- `limit`: 한 페이지당 항목 수 (기본값: 25, 최대값: 100)

### **정렬**
- `sort`: 정렬 기준 (예: `id`, `updated_on:desc`)

### **필터링**
- `status_id`: 상태 ID
- `assigned_to_id`: 담당자 ID
- `fixed_version_id`: 대상 버전 ID
- `created_on`: 생성일 (예: `>=2025-01-01`)

### **사용 예시**
```bash
# 최근 업데이트 순으로 20개 이슈 조회
/projects/2024_qa_sebj/issues.json?sort=updated_on:desc&limit=20

# 특정 버전의 진행중인 이슈만 조회
/issues.json?fixed_version_id=123&status_id=2

# 특정 담당자의 이슈 조회
/issues.json?assigned_to_id=456
```

## 📊 응답 데이터 구조

### **버전 객체**
```typescript
interface Version {
  id: number;
  name: string;
  description?: string;
  status: 'open' | 'closed' | 'locked';
  sharing: 'none' | 'descendants' | 'hierarchy' | 'tree' | 'system';
  due_date?: string;
  created_on: string;
  updated_on: string;
  custom_fields?: CustomField[];
}
```

### **이슈 객체**
```typescript
interface Issue {
  id: number;
  project: { id: number; name: string };
  tracker: { id: number; name: string };
  status: { id: number; name: string };
  priority: { id: number; name: string };
  author: { id: number; name: string };
  assigned_to?: { id: number; name: string };
  fixed_version?: { id: number; name: string };
  subject: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  is_private: boolean;
  estimated_hours?: number;
  spent_hours?: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
  custom_fields?: CustomField[];
}
```

## 🔒 보안 고려사항

### **API 키 보호**
- 서버 사이드에서만 사용
- 환경변수로 관리
- Git에 커밋하지 않음
- 정기적으로 갱신

### **권한 검증**
- 사용자별 프로젝트 접근 권한 확인
- 민감한 정보 필터링
- 읽기 전용 권한 사용 권장

## 📈 성능 최적화

### **캐싱 전략**
```typescript
// 메모리 캐시 (개발 환경)
const cache = new Map();

// Redis 캐시 (운영 환경)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### **배치 요청**
- 여러 API 호출을 병렬로 처리
- Promise.all() 활용

```typescript
const [versions, issues, users] = await Promise.all([
  fetchVersions(projectId),
  fetchIssues(projectId),
  fetchUsers(projectId)
]);
```

## 🧪 테스트

### **API 응답 모킹**
```typescript
// __mocks__/redmine-api.ts
export const mockVersionsResponse = {
  versions: [
    {
      id: 123,
      name: 'v8.0.1',
      status: 'open',
      created_on: '2025-01-01T00:00:00Z'
    }
  ]
};

// 테스트에서 사용
jest.mock('./redmine-api');
```

## 📝 API 사용량 모니터링

### **로깅**
```typescript
console.log('🔗 API Call:', {
  endpoint: url,
  method: 'GET',
  timestamp: new Date().toISOString(),
  responseTime: `${endTime - startTime}ms`
});
```

### **Rate Limiting**
- Redmine 서버 부하 고려
- 요청 간격 제한 (1초당 10회 권장)
- 에러 발생시 백오프 전략