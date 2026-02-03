# 개발 환경 설정

## 🛠️ 개발 도구 설치

### 1. **필수 도구들**

#### **Node.js & npm**
```bash
# Node.js 18+ 설치 확인
node --version  # v18.0.0 이상
npm --version   # v9.0.0 이상

# Windows에서 Node.js 설치
# https://nodejs.org/en/download/
```

#### **Git**
```bash
# Git 설치 확인
git --version

# Windows에서 Git 설치
# https://git-scm.com/download/win
```

### 2. **권장 IDE 설정**

#### **Visual Studio Code**
**필수 확장:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint

**설정 파일 (`.vscode/settings.json`):**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**추천 확장 팩:**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag"
  ]
}
```

## 🚀 프로젝트 셋업

### 1. **저장소 클론**
```bash
git clone [repository-url]
cd redmine-board
```

### 2. **의존성 설치**
```bash
# npm 사용
npm install

# 또는 yarn 사용 (권장)
yarn install

# 또는 pnpm 사용 (고성능)
pnpm install
```

### 3. **환경변수 설정**
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 환경변수 편집
code .env.local
```

**.env.local 내용:**
```env
# Redmine API 설정
REDMINE_URL=https://projects.rsupport.com
REDMINE_API_KEY=your-api-key-here

# Next.js 설정
NEXT_PUBLIC_REDMINE_URL=https://projects.rsupport.com
NEXT_PUBLIC_REDMINE_API_KEY=your-api-key-here

# 개발 환경
NODE_ENV=development
```

### 4. **개발 서버 실행**
```bash
# 개발 서버 시작
npm run dev

# 다른 포트에서 실행
npm run dev -- -p 3001

# 터보팩 사용 (Next.js 15 기본)
npm run dev --turbo
```

## 🔧 개발 워크플로우

### **일일 개발 루틴**
```bash
# 1. 최신 코드 동기화
git pull origin main

# 2. 의존성 업데이트 (필요시)
npm install

# 3. 개발 서버 시작
npm run dev

# 4. 작업 완료 후 빌드 테스트
npm run build

# 5. 타입 체크
npm run type-check
```

### **브랜치 전략**
```bash
# 기능 개발
git checkout -b feature/new-feature
git add .
git commit -m "feat: 새 기능 추가"
git push origin feature/new-feature

# 버그 수정
git checkout -b fix/bug-description
git add .
git commit -m "fix: 버그 수정"
git push origin fix/bug-description
```

## 🛡️ 코드 품질 도구

### 1. **ESLint 설정**
```bash
# ESLint 실행
npm run lint

# 자동 수정
npm run lint:fix
```

**.eslintrc.json:**
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 2. **Prettier 설정**
```bash
# Prettier 실행
npx prettier --write .
```

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100
}
```

### 3. **TypeScript 설정**
```bash
# 타입 체크
npx tsc --noEmit

# package.json에 스크립트 추가
"scripts": {
  "type-check": "tsc --noEmit"
}
```

## 🧪 테스트 환경 (향후 추가)

### **Jest + Testing Library**
```bash
# 테스트 패키지 설치
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# 테스트 실행
npm run test

# 테스트 커버리지
npm run test:coverage
```

## 📊 성능 모니터링

### **개발 도구 활용**
```bash
# Next.js 번들 분석
npm run build
npm run analyze

# 성능 측정
npm run dev -- --profile
```

### **Chrome DevTools**
- **Lighthouse**: 성능 점수 측정
- **Network**: API 호출 모니터링
- **Performance**: 렌더링 성능 분석
- **React Developer Tools**: 컴포넌트 디버깅

## 🔄 Hot Reload 설정

### **Next.js 기본 설정**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 중 빠른 새로고침
  reactStrictMode: true,
  
  // 실험적 기능 (성능 향상)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // 개발 환경 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### **Tailwind CSS Watch 모드**
```bash
# CSS 변경 감지 (별도 터미널)
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

## 🚨 디버깅 도구

### **브라우저 디버깅**
```typescript
// 컴포넌트 디버깅
console.log('🐛 Debug:', { versions, selectedVersion });

// API 응답 디버깅
console.log('📡 API Response:', response.status, data);

// 상태 변화 추적
useEffect(() => {
  console.log('📊 State changed:', { versions: versions.length });
}, [versions]);
```

### **VS Code 디버깅**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 📱 모바일 개발 테스트

### **로컬 네트워크 접근**
```bash
# 네트워크의 다른 디바이스에서 접근
npm run dev -- --hostname 0.0.0.0

# 접속 URL
# http://[your-ip]:3000
# 예: http://192.168.1.100:3000
```

### **반응형 테스트**
```bash
# Chrome DevTools 모바일 시뮬레이션
# F12 → Toggle Device Toolbar (Ctrl+Shift+M)

# 실제 모바일 디바이스 테스트
# Android: Chrome Remote Debugging
# iOS: Safari Web Inspector
```

## ⚡ 성능 최적화 개발 팁

### **빌드 시간 단축**
```bash
# 터보팩 사용
npm run dev --turbo

# 병렬 빌드
npm run build -- --parallel

# 캐시 활용
npm run build -- --cache
```

### **메모리 사용량 모니터링**
```bash
# Node.js 메모리 사용량 확인
node --max-old-space-size=4096 node_modules/.bin/next dev
```