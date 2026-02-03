'use client';

import SimpleRoadmapBoard from '../components/SimpleRoadmapBoard';
import ErrorBoundary from '../components/ErrorBoundary';
import { LanguageProvider } from '../lib/i18n';

export default function RoadmapBoardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorBoundary>
        <LanguageProvider>
          <SimpleRoadmapBoard />
        </LanguageProvider>
      </ErrorBoundary>
    </div>
  );
}