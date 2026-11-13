import React from 'react';
import { AnalyticsScreen } from '../../components/screens/AnalyticsScreen';
import { createLearnerNavigator } from './navigationHelper';

export function AnalyticsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <AnalyticsScreen onNavigate={nav} />;
}
