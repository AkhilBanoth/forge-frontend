import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWorkspaceForUser,
  clearMemoryWorkspaces,
  computeDomainSnapshotsForWorkspace,
  computeReadinessScoreForWorkspace,
  getOrCreateWorkspace,
  saveWorkspace,
} from './userWorkspace';
import { mockCareers, mockSkillsCatalog } from '../mocks/data';

test('new learner accounts start clean and isolated from Rahul demo data', () => {
  clearMemoryWorkspaces();
  const rahul = getOrCreateWorkspace({
    userId: 'usr_rahul_01',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@skillforge.io',
  });
  const priya = getOrCreateWorkspace({
    userId: 'usr_priya_01',
    userName: 'Priya Nair',
    userEmail: 'priya.nair@example.com',
    targetCareerId: 'career_data_eng',
  });

  // Rahul retains rich demo state
  assert.equal(rahul.skills.length > 5, true);
  assert.equal(rahul.certificates.length, 3);
  const rahulReadiness = computeReadinessScoreForWorkspace(rahul, mockCareers[0]);
  assert.equal(rahulReadiness.overall, 72);
  assert.equal(rahulReadiness.verifiedSkillsCount, 7);

  // Priya starts completely fresh with her own target career
  assert.equal(priya.profile.targetCareerId, 'career_data_eng');
  assert.equal(priya.profile.isProfileComplete, false);
  assert.equal(priya.skills.length, 0);
  assert.equal(priya.submissions.length, 0);
  assert.equal(priya.certificates.length, 0);
  assert.equal(
    priya.phases.every((p) => p.courses.every((c) => c.completedLessons === 0)),
    true
  );
  assert.equal(
    priya.assessments.every((a) => a.previousScore === undefined),
    true
  );

  const dataEngCareer = mockCareers.find((c) => c.id === 'career_data_eng') || mockCareers[0];
  const priyaReadiness = computeReadinessScoreForWorkspace(priya, dataEngCareer);
  assert.equal(priyaReadiness.overall, 0);
  assert.equal(priyaReadiness.verifiedSkillsCount, 0);
  assert.equal(priyaReadiness.level, 'FOUNDATION_REQUIRED');
});

test('mutating one learner workspace never leaks into another learner account', () => {
  clearMemoryWorkspaces();
  const userA = buildWorkspaceForUser({
    userId: 'usr_a',
    userName: 'User A',
    userEmail: 'a@example.com',
    targetCareerId: 'career_py_backend',
  });
  const userB = buildWorkspaceForUser({
    userId: 'usr_b',
    userName: 'User B',
    userEmail: 'b@example.com',
    targetCareerId: 'career_qa_auto',
  });

  userA.skills.push({
    id: 'usk_a_1',
    userId: 'usr_a',
    skillId: mockSkillsCatalog[0].id,
    skill: mockSkillsCatalog[0],
    level: 'Advanced',
    verificationStatus: 'ASSESSED',
    assessedScore: 90,
  });
  userA.assessments[0].previousScore = 90;
  userA.assessments[0].previousPassed = true;
  saveWorkspace(userA);
  saveWorkspace(userB);

  const fetchedA = getOrCreateWorkspace({ userId: 'usr_a' });
  const fetchedB = getOrCreateWorkspace({ userId: 'usr_b' });

  const scoreA = computeReadinessScoreForWorkspace(fetchedA, mockCareers[0]);
  const qaCareer = mockCareers.find((c) => c.id === 'career_qa_auto') || mockCareers[1];
  const scoreB = computeReadinessScoreForWorkspace(fetchedB, qaCareer);

  assert.equal(fetchedA.skills.length, 1);
  assert.equal(fetchedB.skills.length, 0);
  assert.ok(scoreA.overall > 20);
  assert.equal(scoreB.overall, 0);
});

test('domain radar snapshots reflect each learner skills dynamically', () => {
  const newUser = buildWorkspaceForUser({
    userId: 'usr_new_radar',
    userName: 'Test Learner',
    userEmail: 'test@example.com',
    targetCareerId: 'career_py_backend',
  });

  const emptySnapshots = computeDomainSnapshotsForWorkspace(newUser, mockCareers[0]);
  assert.equal(emptySnapshots[0].metrics.every((m) => m.learnerScore === 0), true);

  newUser.skills.push({
    id: 'usk_py',
    userId: 'usr_new_radar',
    skillId: 'sk_py',
    skill: mockSkillsCatalog[0],
    level: 'Intermediate',
    verificationStatus: 'SELF_DECLARED',
  });

  const updatedSnapshots = computeDomainSnapshotsForWorkspace(newUser, mockCareers[0]);
  const programming = updatedSnapshots[0].metrics.find((m) => m.domain === 'Programming');
  assert.ok(programming && programming.learnerScore > 0);
  assert.equal(programming.verifiedCount, 0);
});
