import React from 'react';
import { AIMentorScreen } from '../../components/screens/AIMentorScreen';
import { createLearnerNavigator } from './navigationHelper';

export function AIMentorPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <AIMentorScreen onNavigate={nav} />;
}
