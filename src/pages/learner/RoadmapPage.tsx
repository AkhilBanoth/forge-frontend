import React from 'react';
import { RoadmapScreen, LessonViewerScreen } from '../../components/screens/RoadmapScreens';
import { createLearnerNavigator } from './navigationHelper';

export function RoadmapPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const nav = createLearnerNavigator(onNavigate);
  return <RoadmapScreen onNavigate={nav} />;
}

export function LessonPage({
  courseId,
  lessonId,
  onNavigate,
}: {
  courseId: string;
  lessonId: string;
  onNavigate: (path: string) => void;
}) {
  const nav = createLearnerNavigator(onNavigate);
  return <LessonViewerScreen courseId={courseId} lessonId={lessonId} onNavigate={nav} />;
}
