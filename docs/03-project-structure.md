# 프로젝트 구조

## 📁 전체 디렉터리 구조

```
redmine-board/
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📁 api/                      # API 라우트
│   │   └── 📁 redmine/              # Redmine API 엔드포인트
│   │       └── 📁 projects/
│   │           └── 📁 [identifier]/
│   │               ├── 📁 roadmap/
│   │               └── 📁 versions/
│   ├── 📁 components/               # React 컴포넌트
│   │   ├── ErrorBoundary.tsx        # 에러 경계
│   │   ├── RoadmapBoard.tsx         # 레거시 게시판 (사용안함)
│   │   └── SimpleRoadmapBoard.tsx   # 메인 게시판 컴포넌트
│   ├── 📁 lib/                      # 유틸리티 라이브러리
│   │   └── i18n.tsx                 # 다국어 Context
│   ├── 📁 roadmap-board/            # 게시판 페이지
│   │   └── page.tsx                 # 게시판 메인 페이지
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 홈페이지
│   └── globals.css                  # 전역 CSS
├── 📁 docs/                         # 프로젝트 문서화
│   ├── 📁 architecture/             # 아키텍처 문서
│   ├── 📁 api/                      # API 문서
│   ├── 📁 development/              # 개발 가이드
│   ├── 📁 features/                 # 기능별 문서
│   ├── 📁 tech-stack/               # 기술 스택 문서
│   └── 📁 ui/                       # UI/UX 문서
├── 📁 public/                       # 정적 파일 (SVG, 이미지 등)
├── .env.local                       # 환경변수 (git 제외)
├── .gitignore                       # Git 제외 파일
├── next.config.js                   # Next.js 설정
├── package.json                     # 프로젝트 의존성
├── postcss.config.js                # PostCSS 설정
├── tailwind.config.js               # Tailwind CSS 설정
└── tsconfig.json                    # TypeScript 설정
```

## 🏗️ 주요 디렉터리 상세

### `/app` - Next.js 15 App Router
```typescript
app/
├── layout.tsx          // 전체 앱 레이아웃 (HTML, body)
├── page.tsx            // 홈페이지 (/)
├── globals.css         // 글로벌 CSS 스타일
└── roadmap-board/
    └── page.tsx        // 게시판 페이지 (/roadmap-board)
```

### `/app/api` - API 라우트
```typescript
api/redmine/projects/[identifier]/
├── roadmap/route.ts                    // GET 버전 목록
└── versions/[versionId]/issues/
    └── route.ts                        // GET 버전별 이슈 목록
```

**API 엔드포인트:**
- `GET /api/redmine/projects/2024_qa_sebj/roadmap`
- `GET /api/redmine/projects/2024_qa_sebj/versions/123/issues`

### `/app/components` - React 컴포넌트
```typescript
components/
├── ErrorBoundary.tsx           // 에러 처리 컴포넌트
├── RoadmapBoard.tsx           // 레거시 (사용 안함)
└── SimpleRoadmapBoard.tsx     // 메인 게시판 컴포넌트
```

### `/app/lib` - 라이브러리
```typescript
lib/
└── i18n.tsx                   // 다국어 Context & Hook
```

## 📱 컴포넌트 계층 구조

```
App Layout (layout.tsx)
└── ErrorBoundary
    └── LanguageProvider
        └── SimpleRoadmapBoard
            ├── Sidebar (남색 사이드바)
            │   ├── Header (로고, 제목)
            │   ├── Navigation (메뉴)
            │   └── LanguageSelector
            └── MainContent
                ├── TopHeader (제목, 경로)
                ├── FilterSection (검색, 필터)
                ├── VersionTable (버전 목록)
                └── IssuesTable (선택된 버전의 이슈)
```

## 🔄 데이터 흐름

```mermaid
graph TD
    A[SimpleRoadmapBoard] --> B[useState Hooks]
    B --> C[useEffect - API 호출]
    C --> D[/api/redmine/projects/roadmap]
    D --> E[Redmine API Server]
    E --> F[Response: Versions]
    F --> G[setVersions]
    G --> H[VersionTable Render]
    H --> I[User Click Version]
    I --> J[fetchVersionIssues]
    J --> K[/api/redmine/versions/issues]
    K --> E
    E --> L[Response: Issues]
    L --> M[setVersionIssues]
    M --> N[IssuesTable Render]
```

## 📝 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `SimpleRoadmapBoard.tsx`
- **기능별 접두사**: `Error`, `Simple`, `Roadmap` 등

### API 라우트
- **kebab-case**: `[identifier]`, `[versionId]`
- **RESTful**: `route.ts` (GET, POST, PUT, DELETE)

### 문서
- **kebab-case**: `project-structure.md`
- **번호 접두사**: `01-project-overview.md`

## 🔧 설정 파일들

| 파일 | 목적 | 중요도 |
|------|------|--------|
| `next.config.js` | Next.js 설정 | ⭐⭐⭐ |
| `tailwind.config.js` | Tailwind CSS 설정 | ⭐⭐⭐ |
| `tsconfig.json` | TypeScript 설정 | ⭐⭐⭐ |
| `postcss.config.js` | PostCSS 설정 | ⭐⭐ |
| `.env.local` | 환경변수 (API 키) | ⭐⭐⭐ |
| `package.json` | 의존성 관리 | ⭐⭐⭐ |

## 🎯 핵심 파일들

### 가장 중요한 파일 TOP 5
1. **`app/components/SimpleRoadmapBoard.tsx`** - 메인 게시판 로직
2. **`app/api/redmine/projects/[identifier]/roadmap/route.ts`** - Redmine API 연동
3. **`app/lib/i18n.tsx`** - 다국어 지원
4. **`.env.local`** - API 키 설정
5. **`app/layout.tsx`** - 전체 앱 구조