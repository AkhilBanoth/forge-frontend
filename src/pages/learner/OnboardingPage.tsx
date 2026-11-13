import React from 'react';
import { OnboardingScreen } from '../../components/screens/OnboardingScreen';
import { createLearnerNavigator } from './navigationHelper';

export function OnboardingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <OnboardingScreen onNavigate={nav} />;
}
