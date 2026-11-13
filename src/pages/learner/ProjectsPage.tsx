import React from 'react';
import { ProjectsScreen } from '../../components/screens/ProjectsScreen';
import { createLearnerNavigator } from './navigationHelper';

export function ProjectsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <ProjectsScreen onNavigate={nav} />;
}
