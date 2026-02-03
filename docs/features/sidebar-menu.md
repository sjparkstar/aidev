# 사이드바 메뉴 시스템

## 🎨 사이드바 디자인

### **RemoteCall UI 완전 재현**
- **색상**: `bg-slate-800` (남색)
- **너비**: 접힌 상태 `w-16` / 펼쳐진 상태 `w-80`
- **애니메이션**: `transition-all duration-300`
- **아이콘**: Heroicons 사용

## 🔄 토글 기능

### **상태 관리**
```typescript
const [sidebarOpen, setSidebarOpen] = useState(true);
```

### **토글 버튼**
```tsx
{/* 펼쳐진 상태 - 닫기 버튼 */}
<button 
  onClick={() => setSidebarOpen(false)}
  className="text-gray-400 hover:text-white transition-colors"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
</button>

{/* 접힌 상태 - 열기 버튼 */}
<button 
  onClick={() => setSidebarOpen(true)}
  className="text-gray-400 hover:text-white transition-colors mx-auto"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

## 🧭 네비게이션 메뉴

### **메뉴 구조**
```typescript
const menuItems = [
  {
    id: 'user-management',
    title: '사용자 관리',
    icon: UserGroupIcon,
    children: [
      { title: '관리자', href: '/admin' },
      { title: '전체 사용자', href: '/users' },
      { title: '회사 등록관리 신청', href: '/company-requests' },
      { title: '미승인 요청관리', href: '/pending-requests' }
    ]
  },
  {
    id: 'login-management',
    title: '일반 로그인 관리',
    icon: KeyIcon,
    active: true,  // 현재 활성화된 메뉴
    children: [
      { title: '일반 등록관리 내역', href: '/login-history' },
      { title: '일반 등록요청 내역', href: '/login-requests' },
      { title: '미승인 요청관리', href: '/pending-logins' },
      { title: '삭제된 사용자 목록', href: '/deleted-users' }
    ]
  },
  {
    id: 'network-management',
    title: '네트워크 관리',
    icon: NetworkIcon,
    children: []
  }
];
```

### **메뉴 렌더링**
```tsx
<nav className="flex-1 p-4 space-y-2">
  <div className="text-gray-300 text-sm mb-4">전체 서비스</div>
  
  {menuItems.map((item) => (
    <div key={item.id}>
      <div className={`text-white font-medium mb-2 flex items-center justify-between ${
        item.active ? 'bg-blue-600 rounded px-3 py-2' : ''
      }`}>
        <span>{item.title}</span>
        {item.children.length > 0 && (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </div>
      
      {/* 하위 메뉴 */}
      {item.children.length > 0 && (
        <div className="ml-4 space-y-1">
          {item.children.map((child) => (
            <div key={child.title} className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">
              {child.title}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</nav>
```

## 🌐 언어 선택기

### **언어 옵션**
```typescript
const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];
```

### **언어 선택기 UI**
```tsx
<div className="p-4 border-t border-slate-700">
  <select 
    className="bg-slate-700 text-white text-sm rounded px-2 py-1 w-full"
    value={currentLanguage}
    onChange={(e) => changeLanguage(e.target.value)}
  >
    {languages.map((lang) => (
      <option key={lang.code} value={lang.code}>
        {lang.name}
      </option>
    ))}
  </select>
</div>
```

## 📱 반응형 동작

### **데스크탑**
- 기본적으로 펼쳐진 상태
- 사용자가 토글 가능
- 상태 유지 (localStorage)

### **태블릿**
- 자동으로 접힌 상태
- 터치로 토글 가능
- 오버레이 모드

### **모바일**
- 완전히 숨겨진 상태
- 햄버거 메뉴로 표시
- 전체 화면 오버레이

```css
/* 반응형 CSS */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
}
```

## 🎯 사용성 개선

### **접근성 (A11y)**
```tsx
{/* 키보드 네비게이션 */}
<button
  aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
  aria-expanded={sidebarOpen}
  onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
>

{/* 스크린 리더 지원 */}
<nav aria-label="주 네비게이션">
  <ul role="menu">
    <li role="menuitem">
      <button aria-haspopup="true">사용자 관리</button>
    </li>
  </ul>
</nav>
```

### **사용자 경험 향상**
- **호버 효과**: `hover:bg-gray-800`
- **포커스 상태**: `focus:outline-none focus:ring-2`
- **시각적 피드백**: `transition-colors duration-200`

### **상태 지속성**
```typescript
// localStorage에 사이드바 상태 저장
useEffect(() => {
  const saved = localStorage.getItem('sidebarOpen');
  if (saved !== null) {
    setSidebarOpen(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
}, [sidebarOpen]);
```

## 🔧 커스터마이징

### **테마 색상 변경**
```css
:root {
  --sidebar-bg: #1e293b;      /* slate-800 */
  --sidebar-text: #ffffff;
  --sidebar-hover: #374151;   /* gray-700 */
  --sidebar-active: #2563eb;  /* blue-600 */
}

.sidebar {
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text);
}
```

### **애니메이션 커스터마이징**
```css
.sidebar {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 부드러운 페이드 인/아웃 */
.sidebar-content {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.sidebar.closing .sidebar-content {
  opacity: 0;
}
```

## 📊 성능 최적화

### **렌더링 최적화**
```typescript
// 메뉴 항목 메모이제이션
const MenuItems = React.memo(({ items, onItemClick }) => {
  return (
    <>
      {items.map(item => (
        <MenuItem key={item.id} {...item} onClick={onItemClick} />
      ))}
    </>
  );
});

// 불필요한 리렌더링 방지
const MenuItem = React.memo(({ title, active, onClick }) => {
  return (
    <button 
      className={`menu-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
});
```

### **지연 로딩**
```typescript
// 아이콘 동적 import
const icons = {
  user: () => import('@heroicons/react/24/outline').then(mod => mod.UserIcon),
  key: () => import('@heroicons/react/24/outline').then(mod => mod.KeyIcon)
};
```

## 🧪 테스트

### **단위 테스트**
```typescript
// sidebar.test.tsx
describe('Sidebar', () => {
  test('토글 버튼 클릭시 사이드바가 접힌다', () => {
    render(<Sidebar />);
    const toggleButton = screen.getByLabelText('사이드바 닫기');
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText('사이드바 열기')).toBeInTheDocument();
  });
  
  test('메뉴 항목 클릭시 올바른 함수가 호출된다', () => {
    const mockOnClick = jest.fn();
    render(<Sidebar onMenuClick={mockOnClick} />);
    fireEvent.click(screen.getByText('사용자 관리'));
    expect(mockOnClick).toHaveBeenCalledWith('user-management');
  });
});
```