# API 구조

## 🔌 API 엔드포인트 설계

### **Next.js API Routes**
```
/api/redmine/
├── projects/
│   └── [identifier]/
│       ├── roadmap/              # 로드맵 버전 목록
│       └── versions/
│           └── [versionId]/
│               └── issues/       # 버전별 이슈 목록
```

### **Redmine API 매핑**
| Next.js API | Redmine API | 설명 |
|-------------|-------------|------|
| `/api/redmine/projects/[id]/roadmap` | `/projects/[id]/versions.json` | 프로젝트 버전 목록 |
| `/api/redmine/projects/[id]/versions/[vid]/issues` | `/projects/[id]/issues.json?fixed_version_id=[vid]` | 버전별 이슈 목록 |

## 📡 API 상세 명세

### 1. **로드맵 API**

#### **GET** `/api/redmine/projects/[identifier]/roadmap`

**경로 매개변수:**
- `identifier`: 프로젝트 식별자 (예: `2024_qa_sebj`)

**응답 형식:**
```typescript
interface RoadmapResponse {
  versions: Version[];
  total_count: number;
}

interface Version {
  id: number;
  name: string;
  description?: string;
  status: 'open' | 'closed' | 'locked';
  due_date?: string;
  created_on: string;
  updated_on: string;
  sharing: string;
  wiki_page_title?: string;
}
```

**예시 요청:**
```bash
GET /api/redmine/projects/2024_qa_sebj/roadmap
```

**예시 응답:**
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
  ],
  "total_count": 1
}
```

### 2. **버전 이슈 API**

#### **GET** `/api/redmine/projects/[identifier]/versions/[versionId]/issues`

**경로 매개변수:**
- `identifier`: 프로젝트 식별자
- `versionId`: 버전 ID

**쿼리 매개변수:**
- `limit`: 한 페이지당 항목 수 (기본값: 100)

**응답 형식:**
```typescript
interface IssuesResponse {
  issues: Issue[];
  total_count: number;
  version_id: string;
}

interface Issue {
  id: number;
  subject: string;
  description?: string;
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  fixed_version?: {
    id: number;
    name: string;
  };
  created_on: string;
  updated_on: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
}
```

## 🔧 API 구현 상세

### **로드맵 API 구현**

```typescript
// app/api/redmine/projects/[identifier]/roadmap/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    
    // 환경변수에서 설정 가져오기
    const redmineUrl = process.env.REDMINE_URL || 'https://projects.rsupport.com';
    const apiKey = process.env.REDMINE_API_KEY;

    // Redmine API 호출
    const url = `${redmineUrl}/projects/${identifier}/versions.json`;
    const response = await fetch(url, {
      headers: {
        'X-Redmine-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json({
      versions: data.versions || [],
      total_count: data.versions?.length || 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## 🛡️ 보안 및 인증

### **API 키 관리**
```typescript
// 환경변수에서 API 키 가져오기
const apiKey = process.env.REDMINE_API_KEY || process.env.NEXT_PUBLIC_REDMINE_API_KEY;

// 안전성 검증
if (!apiKey) {
  return NextResponse.json(
    { error: 'Missing API configuration' },
    { status: 500 }
  );
}
```

### **요청 헤더**
```typescript
const headers = {
  'X-Redmine-API-Key': apiKey,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Redmine-Board/1.0.0'
};
```

## 🚨 에러 처리

### **HTTP 상태 코드**
| 코드 | 의미 | 대응 방안 |
|------|------|-----------|
| 200 | 성공 | 정상 처리 |
| 401 | 인증 실패 | API 키 확인 |
| 403 | 권한 없음 | 프로젝트 접근 권한 확인 |
| 404 | 리소스 없음 | 프로젝트/버전 존재 여부 확인 |
| 500 | 서버 오류 | 로그 확인 및 재시도 |

### **에러 응답 형식**
```typescript
interface ErrorResponse {
  error: string;
  details?: string;
  url?: string;
  status?: number;
}
```

### **클라이언트 에러 처리**
```typescript
try {
  const response = await fetch(`/api/redmine/projects/${projectId}/roadmap`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${errorData.error}`);
  }
  
  const data = await response.json();
  setVersions(data.versions);
} catch (error) {
  console.error('Failed to fetch versions:', error);
  setError('버전 정보를 불러오는데 실패했습니다.');
}
```

## 📊 로깅 및 모니터링

### **API 호출 로깅**
```typescript
console.log('🔗 Calling Redmine API:', url);
console.log('📡 Response status:', response.status);
console.log('📊 Response:', data.versions?.length || 0, 'versions');
```

### **성능 측정**
```typescript
const startTime = Date.now();
const response = await fetch(url);
const endTime = Date.now();
console.log(`⏱️ API call took: ${endTime - startTime}ms`);
```

## 🔄 캐싱 전략

### **Next.js 자동 캐싱**
- API Routes는 기본적으로 캐싱되지 않음
- 필요시 `cache` 옵션으로 제어

### **향후 개선 방안**
- Redis 캐싱 도입
- SWR 또는 React Query 활용
- 버전별 캐시 무효화 전략

## 🚀 확장 가능성

### **추가 API 엔드포인트**
```
/api/redmine/
├── projects/[id]/
│   ├── issues/                   # 전체 이슈 목록
│   ├── members/                  # 프로젝트 멤버
│   └── activities/               # 활동 로그
├── users/
│   ├── current/                  # 현재 사용자 정보
│   └── [id]/                     # 특정 사용자 정보
└── search/                       # 통합 검색
```

### **GraphQL 도입 고려**
- 필요한 데이터만 요청
- 단일 엔드포인트로 복잡한 쿼리
- 타입 안전성 보장