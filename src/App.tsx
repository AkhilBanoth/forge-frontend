import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicOnlyRoute } from './routes/PublicOnlyRoute';
import { matchRoute, normalizePath } from './routes/navigation';
import { LearnerLayout } from './layouts/LearnerLayout';
import { MentorLayout } from './layouts/MentorLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { CareersPage } from './pages/public/CareersPage';
import { PricingPage } from './pages/public/PricingPage';
import { ContactPage } from './pages/public/ContactPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForbiddenPage } from './pages/public/ForbiddenPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { TermsPage, PrivacyPage } from './pages/public/LegalPages';
import { PresentationPage } from './pages/public/PresentationPage';

// Learner Pages (/app/*)
import { LearnerDashboardPage } from './pages/learner/LearnerDashboardPage';
import { ProfilePage } from './pages/learner/ProfilePage';
import { CareerPage } from './pages/learner/CareerPage';
import { RoadmapPage, LessonPage } from './pages/learner/RoadmapPage';
import { CoursesPage } from './pages/learner/CoursesPage';
import { QuizzesListPage, QuizTakePage, QuizResultsPage } from './pages/learner/QuizzesPage';
import { ProjectsPage } from './pages/learner/ProjectsPage';
import { CertificatesPage } from './pages/learner/CertificatesPage';
import { ReadinessPage } from './pages/learner/ReadinessPage';
import { AIMentorPage } from './pages/learner/AIMentorPage';
import { AIPracticePage } from './pages/learner/AIPracticePage';
import { AnalyticsPage } from './pages/learner/AnalyticsPage';
import { OnboardingPage } from './pages/learner/OnboardingPage';

// Mentor Pages (/mentor/*)
import { MentorDashboardPage } from './pages/mentor/MentorDashboardPage';
import { MentorLearnersPage } from './pages/mentor/MentorLearnersPage';
import { MentorLearnerDetailPage } from './pages/mentor/MentorLearnerDetailPage';
import { MentorReviewsPage } from './pages/mentor/MentorReviewsPage';
import { MentorReviewDetailPage } from './pages/mentor/MentorReviewDetailPage';
import { MentorFeedbackPage } from './pages/mentor/MentorFeedbackPage';

// Admin Pages (/admin/*)
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLearnersPage } from './pages/admin/AdminLearnersPage';
import { AdminMentorsPage } from './pages/admin/AdminMentorsPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminAssessmentsPage } from './pages/admin/AdminAssessmentsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

function AppRoutes() {
  const { profile } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(
    () => `${window.location.pathname || '/'}${window.location.search || ''}`
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(`${window.location.pathname || '/'}${window.location.search || ''}`);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const normPath = normalizePath(currentPath);

  // Redirect bare portal roots to their dashboard routes
  useEffect(() => {
    if (normPath === '/app') navigate('/app/dashboard');
    else if (normPath === '/mentor') navigate('/mentor/dashboard');
    else if (normPath === '/admin') navigate('/admin/dashboard');
  }, [normPath, navigate]);

  const renderForbidden = () => (
    <ForbiddenPage currentPath={normPath} onNavigate={navigate} />
  );

  // ---------------------------------------------------------------------------
  // 1. PUBLIC WEBSITE ROUTES (No login needed)
  // ---------------------------------------------------------------------------
  if (normPath === '/' || normPath === '/home') {
    return <LandingPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/about') {
    return <AboutPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/how-it-works') {
    return <HowItWorksPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/careers') {
    return <CareersPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/pricing') {
    return <PricingPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/contact') {
    return <ContactPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/terms') {
    return <TermsPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/privacy') {
    return <PrivacyPage currentPath={normPath} onNavigate={navigate} />;
  }
  if (normPath === '/presentation') {
    return <PresentationPage onNavigate={navigate} />;
  }
  if (normPath === '/verify') {
    return <VerifyCertificatePage currentPath={normPath} onNavigate={navigate} />;
  }
  const verifyMatch = matchRoute('/verify/:certificateId', normPath);
  if (verifyMatch) {
    return (
      <VerifyCertificatePage
        currentPath={normPath}
        certificateId={verifyMatch.certificateId}
        onNavigate={navigate}
      />
    );
  }
  if (normPath === '/403') {
    return <ForbiddenPage currentPath={normPath} onNavigate={navigate} />;
  }

  // ---------------------------------------------------------------------------
  // 2. AUTH ROUTES (Redirect away if already signed in)
  // ---------------------------------------------------------------------------
  if (normPath === '/login') {
    return (
      <PublicOnlyRoute onNavigate={navigate}>
        <LoginPage currentPath={normPath} onNavigate={navigate} portalHint="LEARNER" />
      </PublicOnlyRoute>
    );
  }
  if (normPath === '/mentor/login') {
    return (
      <PublicOnlyRoute onNavigate={navigate}>
        <LoginPage currentPath={normPath} onNavigate={navigate} portalHint="MENTOR" />
      </PublicOnlyRoute>
    );
  }
  if (normPath === '/admin/login') {
    return (
      <PublicOnlyRoute onNavigate={navigate}>
        <LoginPage currentPath={normPath} onNavigate={navigate} portalHint="ADMIN" />
      </PublicOnlyRoute>
    );
  }
  if (normPath === '/register') {
    return (
      <PublicOnlyRoute onNavigate={navigate}>
        <RegisterPage currentPath={normPath} onNavigate={navigate} />
      </PublicOnlyRoute>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. LEARNER PORTAL (/app/*) - Strictly LEARNER only
  // ---------------------------------------------------------------------------
  if (normPath === '/app' || normPath.startsWith('/app/')) {
    let pageTitle = 'Learner Dashboard';
    let content: React.ReactNode = null;

    if (profile && !profile.isProfileComplete && normPath !== '/app/onboarding') {
      pageTitle = 'Complete Your Profile';
      content = <OnboardingPage onNavigate={navigate} />;
    } else if (normPath === '/app/onboarding') {
      pageTitle = 'Learner Onboarding';
      content = <OnboardingPage onNavigate={navigate} />;
    } else if (normPath === '/app' || normPath === '/app/dashboard') {
      pageTitle = 'Learner Dashboard';
      content = <LearnerDashboardPage onNavigate={navigate} />;
    } else if (normPath === '/app/profile') {
      pageTitle = 'Profile & Skills';
      content = <ProfilePage onNavigate={navigate} />;
    } else if (normPath === '/app/career') {
      pageTitle = 'Career Mapping & Skill Gaps';
      content = <CareerPage onNavigate={navigate} />;
    } else if (normPath === '/app/roadmap') {
      pageTitle = 'Learning Roadmap';
      content = <RoadmapPage onNavigate={navigate} />;
    } else if (normPath === '/app/courses') {
      pageTitle = 'Courses & Lessons';
      content = <CoursesPage onNavigate={navigate} />;
    } else if (normPath === '/app/quizzes') {
      pageTitle = 'Quizzes & Assessments';
      content = <QuizzesListPage onNavigate={navigate} />;
    } else if (normPath === '/app/projects') {
      pageTitle = 'Capstone Projects';
      content = <ProjectsPage onNavigate={navigate} />;
    } else if (normPath === '/app/certificates') {
      pageTitle = 'My Certificates';
      content = <CertificatesPage onNavigate={navigate} />;
    } else if (normPath === '/app/readiness') {
      pageTitle = 'Readiness Score & History';
      content = <ReadinessPage onNavigate={navigate} />;
    } else if (normPath === '/app/ai-mentor') {
      pageTitle = 'AI Mentor';
      content = <AIMentorPage onNavigate={navigate} />;
    } else if (normPath === '/app/ai-practice') {
      pageTitle = 'AI Practice Questions';
      content = <AIPracticePage onNavigate={navigate} />;
    } else if (normPath === '/app/analytics') {
      pageTitle = 'Progress Analytics';
      content = <AnalyticsPage onNavigate={navigate} />;
    } else {
      const roadmapLesson =
        matchRoute('/app/roadmap/:courseId/lessons/:lessonId', normPath) ||
        matchRoute('/app/courses/:courseId/lessons/:lessonId', normPath);
      const quizResults = matchRoute('/app/quizzes/:id/results', normPath);
      const quizTake = matchRoute('/app/quizzes/:id', normPath);

      if (roadmapLesson) {
        pageTitle = 'Interactive Lesson';
        content = (
          <LessonPage
            courseId={roadmapLesson.courseId}
            lessonId={roadmapLesson.lessonId}
            onNavigate={navigate}
          />
        );
      } else if (quizResults) {
        pageTitle = 'Quiz Results';
        content = <QuizResultsPage onNavigate={navigate} />;
      } else if (quizTake) {
        pageTitle = 'Timed Assessment';
        content = <QuizTakePage assessmentId={quizTake.id} onNavigate={navigate} />;
      } else {
        return <NotFoundPage currentPath={normPath} onNavigate={navigate} />;
      }
    }

    return (
      <ProtectedRoute
        allowedRoles={['LEARNER']}
        currentPath={normPath}
        onNavigate={navigate}
        renderForbidden={renderForbidden}
      >
        <LearnerLayout currentPath={normPath} onNavigate={navigate} pageTitle={pageTitle}>
          {content}
        </LearnerLayout>
      </ProtectedRoute>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. MENTOR PORTAL (/mentor/*) - MENTOR only (ADMIN can also open)
  // ---------------------------------------------------------------------------
  if (normPath === '/mentor' || normPath.startsWith('/mentor/')) {
    let pageTitle = 'Mentor Dashboard';
    let content: React.ReactNode = null;

    const learnerDetail = matchRoute('/mentor/learners/:id', normPath);
    const reviewDetail = matchRoute('/mentor/reviews/:id', normPath);

    if (normPath === '/mentor' || normPath === '/mentor/dashboard') {
      pageTitle = 'Mentor Dashboard';
      content = <MentorDashboardPage onNavigate={navigate} />;
    } else if (normPath === '/mentor/learners') {
      pageTitle = 'Assigned Learners';
      content = <MentorLearnersPage onNavigate={navigate} />;
    } else if (learnerDetail) {
      pageTitle = 'Learner Dossier (Read Only)';
      content = <MentorLearnerDetailPage learnerId={learnerDetail.id} onNavigate={navigate} />;
    } else if (normPath === '/mentor/reviews') {
      pageTitle = 'Project Reviews';
      content = <MentorReviewsPage onNavigate={navigate} />;
    } else if (reviewDetail) {
      pageTitle = 'Project Rubric Evaluation';
      content = <MentorReviewDetailPage submissionId={reviewDetail.id} onNavigate={navigate} />;
    } else if (normPath === '/mentor/feedback') {
      pageTitle = 'Feedback History';
      content = <MentorFeedbackPage onNavigate={navigate} />;
    } else {
      return <NotFoundPage currentPath={normPath} onNavigate={navigate} />;
    }

    return (
      <ProtectedRoute
        allowedRoles={['MENTOR', 'ADMIN']}
        currentPath={normPath}
        onNavigate={navigate}
        renderForbidden={renderForbidden}
      >
        <MentorLayout currentPath={normPath} onNavigate={navigate} pageTitle={pageTitle}>
          {content}
        </MentorLayout>
      </ProtectedRoute>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. ADMIN PORTAL (/admin/*) - Strictly ADMIN only
  // ---------------------------------------------------------------------------
  if (normPath === '/admin' || normPath.startsWith('/admin/')) {
    let pageTitle = 'Admin Dashboard';
    let content: React.ReactNode = null;

    if (normPath === '/admin' || normPath === '/admin/dashboard') {
      pageTitle = 'Admin Platform Dashboard';
      content = <AdminDashboardPage onNavigate={navigate} />;
    } else if (normPath === '/admin/users') {
      pageTitle = 'Users & Roles';
      content = <AdminUsersPage />;
    } else if (normPath === '/admin/learners') {
      pageTitle = 'Learners Directory';
      content = <AdminLearnersPage onNavigate={navigate} />;
    } else if (normPath === '/admin/mentors') {
      pageTitle = 'Mentors & Assignments';
      content = <AdminMentorsPage onNavigate={navigate} />;
    } else if (normPath === '/admin/skills') {
      pageTitle = 'Skills Catalog';
      content = <AdminSkillsPage />;
    } else if (normPath === '/admin/careers') {
      pageTitle = 'Career Roles & Weights';
      content = <AdminCareersPage />;
    } else if (normPath === '/admin/courses') {
      pageTitle = 'Courses, Modules & Lessons';
      content = <AdminCoursesPage />;
    } else if (normPath === '/admin/assessments') {
      pageTitle = 'Assessments & Question Bank';
      content = <AdminAssessmentsPage />;
    } else if (normPath === '/admin/projects') {
      pageTitle = 'Projects & Review Queue';
      content = <AdminProjectsPage onNavigate={navigate} />;
    } else if (normPath === '/admin/certificates') {
      pageTitle = 'Certificates & Rules';
      content = <AdminCertificatesPage onNavigate={navigate} />;
    } else if (normPath === '/admin/analytics') {
      pageTitle = 'Career Analytics';
      content = <AdminAnalyticsPage />;
    } else if (normPath === '/admin/audit-logs') {
      pageTitle = 'Audit Logs';
      content = <AdminAuditLogsPage />;
    } else {
      return <NotFoundPage currentPath={normPath} onNavigate={navigate} />;
    }

    return (
      <ProtectedRoute
        allowedRoles={['ADMIN']}
        currentPath={normPath}
        onNavigate={navigate}
        renderForbidden={renderForbidden}
      >
        <AdminLayout currentPath={normPath} onNavigate={navigate} pageTitle={pageTitle}>
          {content}
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // Fallback 404
  return <NotFoundPage currentPath={normPath} onNavigate={navigate} />;
}

export default function App() {
  return <AppRoutes />;
}
