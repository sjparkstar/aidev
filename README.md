# 🚀 Redmine 관리 서비스

> RemoteCall UI 스타일의 Redmine API 연동 게시판 시스템

[![Next.js](https://img.shields.io/badge/Next.js-15.5.11-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 프로젝트 소개

RemoteCall v8.0 User Admin 인터페이스를 완벽하게 재현한 Redmine API 연동 게시판 시스템입니다. 현대적인 UI/UX와 실시간 데이터 연동을 통해 효율적인 프로젝트 관리를 제공합니다.

### ✨ 주요 특징

- 🎨 **RemoteCall UI 완전 재현** - 남색 사이드바, 접이식 메뉴
- 🔗 **실시간 Redmine API 연동** - 로드맵, 버전, 이슈 관리
- 🌍 **다국어 지원** - 한국어/영어/일본어 완벽 지원
- 📱 **완전 반응형** - 모바일/태블릿/데스크탑 최적화
- ⚡ **Next.js 15** - 최신 App Router, React 19 활용
- 🔒 **타입 안전성** - TypeScript 완전 적용

## 🚀 빠른 시작

### 1. 설치 및 설정

```bash
# 프로젝트 클론
git clone [repository-url]
cd redmine-board

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local에서 Redmine API 키 설정
```

### 2. 환경변수 설정

```env
# .env.local
REDMINE_URL=https://projects.rsupport.com
REDMINE_API_KEY=your-api-key-here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 🎯 주요 페이지

- **홈페이지**: http://localhost:3000
- **로드맵 게시판**: http://localhost:3000/roadmap-board

## 📁 프로젝트 구조

```
redmine-board/
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📁 api/redmine/              # Redmine API 프록시
│   ├── 📁 components/               # React 컴포넌트
│   ├── 📁 lib/                      # 유틸리티 (다국어 등)
│   └── 📁 roadmap-board/            # 게시판 페이지
├── 📁 docs/                         # 📚 프로젝트 문서
│   ├── 📁 architecture/             # 아키텍처 문서
│   ├── 📁 api/                      # API 연동 가이드
│   ├── 📁 development/              # 개발 환경 설정
│   ├── 📁 features/                 # 기능별 상세 문서
│   └── README.md                    # 📖 문서 목차
└── 설정 파일들
```

## 🛠️ 기술 스택

| 분야 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Frontend** | Next.js | 15.5.11 | React 메타 프레임워크 |
| **UI Library** | React | 19.0.0 | 사용자 인터페이스 |
| **Language** | TypeScript | 5.6.0 | 타입 안전성 |
| **Styling** | Tailwind CSS | 3.4.14 | 유틸리티 CSS |
| **Icons** | Heroicons | 2.2.0 | SVG 아이콘 |
| **API** | Redmine REST API | v1.0 | 데이터 소스 |

## 🎨 UI 미리보기

### 데스크탑 화면
```
┌─────────────┬─────────────────────────────────────────┐
│             │  RemoteCall v8.0 User Admin            │
│   남색      ├─────────────────────────────────────────┤
│   사이드바   │  일반 로그인 관리 생성법                  │
│             │  일반 사용자 > 일반 사용자 > 일반 로그인   │
│   - 사용자관리 ├─────────────────────────────────────────┤
│   - 로그인관리 │                                       │
│   - 네트워크  │         게시판 영역                     │
│             │    - 필터/검색 영역                     │
│   [ko▼]     │    - 버전 목록 테이블                   │
│             │    - 이슈 목록 (선택시)                 │
└─────────────┴─────────────────────────────────────────┘
```

## 🌟 주요 기능

### 🎛️ 사이드바 메뉴
- **접이식 네비게이션** - 클릭으로 열기/닫기
- **메뉴 구조** - RemoteCall UI와 동일한 계층 구조
- **활성 상태** - 현재 페이지 하이라이트

### 📊 로드맵 게시판
- **프로젝트 버전 목록** - Redmine 로드맵 데이터 표시
- **버전 클릭 → 이슈 표시** - 해당 버전의 이슈들 하단에 표시
- **실시간 데이터** - API 연동으로 최신 정보 유지

### 🌐 다국어 지원
- **자동 언어 감지** - 브라우저 설정 기반
- **실시간 변경** - 새로고침 없이 언어 전환
- **완전 번역** - UI, 메시지, 상태값 모든 텍스트

## 📖 문서

상세한 문서는 [docs 폴더](./docs/)에서 확인할 수 있습니다:

### 📚 주요 문서들
- **[시작하기](./docs/02-getting-started.md)** - 설치 및 설정 가이드
- **[프로젝트 구조](./docs/03-project-structure.md)** - 코드베이스 이해
- **[시스템 아키텍처](./docs/architecture/system-architecture.md)** - 전체 설계 구조
- **[API 연동 가이드](./docs/api/redmine-api.md)** - Redmine API 사용법
- **[개발 환경 설정](./docs/development/development-setup.md)** - 개발 도구 세팅

### 🎨 기능별 문서
- **[사이드바 시스템](./docs/features/sidebar-menu.md)** - 네비게이션 메뉴
- **[다국어 지원](./docs/features/i18n-support.md)** - 국제화 구현

## 🚀 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint

# 타입 체크
npm run type-check
```

## 🧪 테스트 (예정)

```bash
# 단위 테스트
npm run test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 📊 성능

- **빌드 시간**: ~5.3초
- **첫 로딩 JS**: ~106KB
- **완전 반응형**: 모든 디바이스 지원
- **접근성**: WCAG 2.1 기본 준수

## 🔧 환경 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+

## 🤝 기여하기

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♂️ 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/your-repo/issues)
- **문의**: vibecoding.com
- **문서**: [프로젝트 문서](./docs/)

---

**⭐ 이 프로젝트가 유용하다면 Star를 눌러주세요!**

Made with ❤️ by [SJ Park](https://vibecoding.com)