'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'ko' | 'en' | 'ja';

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
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (path: string): string => {
    return (translations[language] as any)[path] || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}