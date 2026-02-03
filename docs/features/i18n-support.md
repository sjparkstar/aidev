# 다국어 지원 시스템

## 🌍 지원 언어

| 언어 | 코드 | 상태 | 완성도 |
|------|------|------|--------|
| 한국어 | `ko` | ✅ 완료 | 100% |
| 영어 | `en` | ✅ 완료 | 100% |
| 일본어 | `ja` | ✅ 완료 | 100% |

## 🏗️ React Context 기반 구조

### **i18n Context 구현**
```typescript
// app/lib/i18n.tsx
export type Language = 'ko' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
```

### **번역 데이터 구조**
```typescript
export const translations = {
  ko: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    roadmap: '로드맵',
    version: '버전',
    issues: '일감',
    subject: '제목',
    status: '상태',
    assignee: '담당자',
    link: '링크',
    viewInRedmine: 'Redmine에서 보기'
  },
  en: {
    loading: 'Loading...',
    error: 'An error occurred',
    roadmap: 'Roadmap',
    version: 'Version',
    issues: 'Issues',
    subject: 'Subject',
    status: 'Status',
    assignee: 'Assignee',
    link: 'Link',
    viewInRedmine: 'View in Redmine'
  },
  ja: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    roadmap: 'ロードマップ',
    version: 'バージョン',
    issues: '課題',
    subject: '件名',
    status: 'ステータス',
    assignee: '担当者',
    link: 'リンク',
    viewInRedmine: 'Redmineで表示'
  }
};
```

## 🔧 Provider 설정

### **언어 감지 및 초기화**
```typescript
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 브라우저 언어 자동 감지
  const detectBrowserLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ko';
    
    const browserLang = navigator.language || navigator.languages[0];
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    switch (langCode) {
      case 'en': return 'en';
      case 'ja': return 'ja';
      case 'ko':
      default: return 'ko';
    }
  };

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ko';
    
    // localStorage에서 저장된 언어 우선
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || detectBrowserLanguage();
  });

  // 언어 변경 함수 (localStorage 연동)
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // 번역 함수
  const t = (path: string): string => {
    return (translations[language] as any)[path] || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

## 🎯 사용법

### **Custom Hook**
```typescript
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

### **컴포넌트에서 사용**
```typescript
function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('roadmap')}</h1>
      <p>{t('loading')}</p>
      <button onClick={() => setLanguage('en')}>
        English
      </button>
      <p>Current: {language}</p>
    </div>
  );
}
```

## 🎨 언어 선택기 컴포넌트

### **사이드바 언어 선택기**
```typescript
const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-slate-700 text-white text-sm rounded px-2 py-1 w-full"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## 📋 번역 키 관리

### **카테고리별 구조**
```typescript
export const translations = {
  ko: {
    // UI 공통
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      search: '검색',
      save: '저장',
      cancel: '취소',
      confirm: '확인'
    },
    
    // 네비게이션
    nav: {
      dashboard: '대시보드',
      projects: '프로젝트',
      issues: '일감',
      reports: '리포트'
    },
    
    // 테이블
    table: {
      id: 'ID',
      title: '제목',
      status: '상태',
      assignee: '담당자',
      dueDate: '마감일',
      priority: '우선순위'
    },
    
    // 상태값
    status: {
      new: '신규',
      inProgress: '진행중',
      resolved: '해결됨',
      closed: '종료'
    },
    
    // 메시지
    messages: {
      loadSuccess: '데이터를 성공적으로 불러왔습니다',
      loadError: '데이터를 불러오는데 실패했습니다',
      saveSuccess: '성공적으로 저장되었습니다'
    }
  }
  // ... en, ja 동일 구조
};
```

### **중첩된 키 접근**
```typescript
// 기본 버전: 단순 키
const t = (path: string): string => {
  return (translations[language] as any)[path] || path;
};

// 확장 버전: 중첩 키 지원
const t = (path: string): string => {
  const keys = path.split('.');
  let value: any = translations[language];

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return path;
  }

  return typeof value === 'string' ? value : path;
};

// 사용 예시
{t('common.loading')}        // "로딩 중..."
{t('table.status')}          // "상태"
{t('status.inProgress')}     // "진행중"
```

## 🌐 브라우저 언어 감지

### **언어 감지 로직**
```typescript
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ko';
  
  // 브라우저 언어 설정 확인
  const browserLang = navigator.language || navigator.languages[0];
  
  // 언어 코드 추출 (예: "ko-KR" → "ko")
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // 지원하는 언어인지 확인
  const supportedLanguages: Language[] = ['ko', 'en', 'ja'];
  
  if (supportedLanguages.includes(langCode as Language)) {
    return langCode as Language;
  }
  
  // 기본 언어 반환
  return 'ko';
};
```

### **지역별 기본 언어**
```typescript
const getDefaultLanguageByRegion = (): Language => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 시간대 기반 언어 추정
  if (timezone.includes('Asia/Seoul')) return 'ko';
  if (timezone.includes('Asia/Tokyo')) return 'ja';
  if (timezone.includes('America/') || timezone.includes('Europe/')) return 'en';
  
  return 'ko'; // 기본값
};
```

## 📱 반응형 언어 표시

### **언어 코드 표시 (좁은 화면)**
```typescript
function CompactLanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded">
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="ko">KO</option>
        <option value="en">EN</option>
        <option value="ja">JA</option>
      </select>
    </div>
  );
}
```

### **전체 이름 표시 (넓은 화면)**
```typescript
function FullLanguageSelector() {
  return (
    <div className="hidden md:block">
      <select className="bg-slate-700 text-white rounded px-3 py-1">
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
```

## 🔧 고급 기능

### **복수형 처리**
```typescript
// 복수형 번역 데이터
const translations = {
  ko: {
    itemCount: {
      zero: '항목이 없습니다',
      one: '1개 항목',
      other: '{count}개 항목'
    }
  },
  en: {
    itemCount: {
      zero: 'No items',
      one: '1 item',
      other: '{count} items'
    }
  }
};

// 복수형 처리 함수
const tp = (path: string, count: number): string => {
  const pluralKey = count === 0 ? 'zero' : count === 1 ? 'one' : 'other';
  const template = t(`${path}.${pluralKey}`);
  return template.replace('{count}', count.toString());
};

// 사용 예시
{tp('itemCount', versions.length)} // "5개 항목" 또는 "5 items"
```

### **변수 삽입**
```typescript
// 변수가 있는 번역 데이터
const translations = {
  ko: {
    welcome: '{name}님, 환영합니다!',
    lastLogin: '마지막 로그인: {date}'
  }
};

// 변수 삽입 함수
const tv = (path: string, variables: Record<string, string>): string => {
  let text = t(path);
  Object.keys(variables).forEach(key => {
    text = text.replace(`{${key}}`, variables[key]);
  });
  return text;
};

// 사용 예시
{tv('welcome', { name: 'SJ Park' })}  // "SJ Park님, 환영합니다!"
```

## 🧪 테스트

### **다국어 테스트**
```typescript
describe('i18n', () => {
  test('언어 변경이 정상 작동한다', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider
    });
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.language).toBe('en');
    expect(result.current.t('loading')).toBe('Loading...');
  });
  
  test('브라우저 언어가 자동 감지된다', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'ja-JP',
      configurable: true
    });
    
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider
    });
    
    expect(result.current.language).toBe('ja');
  });
});
```

## 🚀 성능 최적화

### **번역 데이터 코드 스플리팅**
```typescript
// 언어별 동적 import (대용량 번역 데이터용)
const loadTranslations = async (lang: Language) => {
  const module = await import(`../translations/${lang}.json`);
  return module.default;
};

// 지연 로딩
const [translations, setTranslations] = useState(null);

useEffect(() => {
  loadTranslations(language).then(setTranslations);
}, [language]);
```

### **메모이제이션**
```typescript
// 번역 결과 캐싱
const translationCache = new Map<string, string>();

const t = useMemo(() => {
  return (path: string): string => {
    const cacheKey = `${language}:${path}`;
    
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }
    
    const result = getTranslation(language, path);
    translationCache.set(cacheKey, result);
    
    return result;
  };
}, [language]);
```