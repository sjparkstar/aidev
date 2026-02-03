# 시작하기

## ⚡ 빠른 시작

### 1. 프로젝트 클론

```bash
git clone [repository-url]
cd redmine-board
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경설정

`.env.local` 파일을 생성하고 Redmine API 정보를 설정:

```env
# Redmine API 설정
REDMINE_URL=https://projects.rsupport.com
REDMINE_API_KEY=your-api-key-here

# Next.js 클라이언트 사이드 접근용 (필요시)
NEXT_PUBLIC_REDMINE_URL=https://projects.rsupport.com
NEXT_PUBLIC_REDMINE_API_KEY=your-api-key-here
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 🛠️ 시스템 요구사항

### 필수 요구사항
- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상
- **Git** (버전 관리)

### 권장 환경
- **Visual Studio Code** (IDE)
- **Chrome/Firefox** (최신 버전)
- **Redmine API Key** (연동용)

## 📁 프로젝트 구조 이해

```
redmine-board/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── components/        # React 컴포넌트
│   ├── lib/               # 유틸리티 라이브러리
│   └── roadmap-board/     # 게시판 페이지
├── docs/                  # 문서화
├── public/                # 정적 파일
└── 설정 파일들
```

## 🎯 첫 번째 사용

### 1. 메인 페이지 확인
- http://localhost:3000
- "로드맵 게시판 바로가기" 클릭

### 2. 게시판 화면 탐색
- http://localhost:3000/roadmap-board
- 사이드바 접기/펼치기 테스트
- 버전 목록 확인

### 3. Redmine 연동 확인
- API 키가 올바른지 확인
- 네트워크 탭에서 API 호출 상태 확인
- Console에서 에러 메시지 확인

## 🚨 일반적인 문제 해결

### 1. API 연동 오류
```bash
# 에러: 401 Unauthorized
→ API 키 확인 필요

# 에러: CORS
→ Redmine 서버 설정 확인
```

### 2. 빌드 오류
```bash
# TypeScript 오류
npm run build

# 캐시 클리어
rm -rf .next
npm run dev
```

### 3. 포트 충돌
```bash
# 다른 포트 사용
npm run dev -- -p 3001
```

## 📚 다음 단계

1. [프로젝트 구조](./03-project-structure.md) 상세 이해
2. [API 구조](./architecture/api-structure.md) 학습
3. [컴포넌트 구조](./architecture/component-structure.md) 파악
4. [개발 가이드](./development/development-setup.md) 숙지