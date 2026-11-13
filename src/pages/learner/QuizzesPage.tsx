import React from 'react';
import {
  AssessmentsListScreen,
  AssessmentTakingScreen,
  AssessmentResultsScreen,
} from '../../components/screens/AssessmentScreens';
import { createLearnerNavigator } from './navigationHelper';

export function QuizzesListPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <AssessmentsListScreen onNavigate={nav} />;
}

export function QuizTakePage({
  assessmentId,
  onNavigate,
}: {
  assessmentId: string;
  onNavigate: (path: string) => void;
}) {
  const nav = createLearnerNavigator(onNavigate);
  return <AssessmentTakingScreen assessmentId={assessmentId} onNavigate={nav} />;
}

export function QuizResultsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <AssessmentResultsScreen onNavigate={nav} />;
}
