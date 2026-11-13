import React, { useEffect, useState } from 'react';
import { PageHeader, StatCard } from '../../components/shared/PageHeader';
import { PlatformOverview } from '../../components/admin/PlatformOverview';
import { TechieInventoryWorkspace } from '../../components/shared/TechieInventoryWorkspace';
import { LoadingState } from '../../components/shared/States';
import {
  adminService,
  certificateService,
  mentorService,
  roadmapService,
} from '../../lib/api/services';
import type { ManagedUserRecord } from '../../types';
import { Users, BookOpen, FolderGit2, Award, ArrowRight } from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [users, setUsers] = useState<ManagedUserRecord[]>([]);
  const [coursesCount, setCoursesCount] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getUsers(),
      roadmapService.getRoadmap(),
      mentorService.getReviewQueue(),
      certificateService.getCertificates(),
    ])
      .then(([uRes, rRes, sRes, cRes]) => {
        setUsers(uRes.data);
        setCoursesCount(rRes.data.reduce((sum, p) => sum + p.courses.length, 0));
        setSubmissionsCount(sRes.data.length);
        setPendingReviewsCount(
          sRes.data.filter((s) => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED').length
        );
        setCertificatesCount(cRes.data.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState message="Loading platform analytics..." />;
  }

  const learners = users.filter((u) => u.roles.includes('LEARNER'));
  const avgReadiness =
    learners.length > 0
      ? Number(
          (learners.reduce((sum, l) => sum + l.readinessScore, 0) / learners.length).toFixed(1)
        )
      : 71.8;

  const handleTabNav = (tab: 'queue' | 'curriculum' | 'assessments' | 'users' | 'taxonomy') => {
    const map: Record<typeof tab, string> = {
      queue: '/admin/projects',
      curriculum: '/admin/courses',
      assessments: '/admin/assessments',
      users: '/admin/users',
      taxonomy: '/admin/careers',
    };
    onNavigate(map[tab]);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Platform Overview & Analytics"
        description="Monitor users, courses, project review pipelines, certificates, and overall learner readiness."
        actions={
          <button
            type="button"
            onClick={() => onNavigate('/admin/users')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <span>Manage Users</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users.length}
          sublabel={`${learners.length} learners active`}
          icon={Users}
        />
        <StatCard
          title="Courses Published"
          value={coursesCount}
          sublabel="Across roadmap phases"
          icon={BookOpen}
        />
        <StatCard
          title="Project Submissions"
          value={submissionsCount}
          sublabel={`${pendingReviewsCount} pending review`}
          icon={FolderGit2}
        />
        <StatCard
          title="Certificates Issued"
          value={certificatesCount}
          sublabel={`Avg readiness: ${avgReadiness}%`}
          icon={Award}
        />
      </div>

      <PlatformOverview
        totalLearners={learners.length}
        averageReadinessScore={avgReadiness}
        pendingReviewsCount={pendingReviewsCount}
        userList={users}
        onNavigateTab={handleTabNav}
      />

      <TechieInventoryWorkspace mode="admin" onNavigate={onNavigate} />
    </div>
  );
}
