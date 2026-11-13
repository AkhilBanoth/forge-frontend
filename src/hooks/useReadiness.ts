import { useState, useEffect } from 'react';
import type { ReadinessScore, CareerMatch, DomainRadarSnapshot } from '../types';
import { readinessService } from '../lib/api/services';
import { READINESS_THRESHOLDS } from '../constants';
import { mockDomainRadarSnapshots } from '../lib/mocks/data';

export function useReadiness() {
  const [scoreData, setScoreData] = useState<ReadinessScore | null>(null);
  const [history, setHistory] = useState<Array<{ date: string; score: number; level: string }>>([]);
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [domainSnapshots, setDomainSnapshots] = useState<DomainRadarSnapshot[]>(
    mockDomainRadarSnapshots
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const [scoreRes, histRes, matchRes, domainRes] = await Promise.all([
          readinessService.getReadiness(),
          readinessService.getReadinessHistory(),
          readinessService.getCareerMatches(),
          readinessService.getDomainDistribution(),
        ]);
        if (mounted) {
          setScoreData(scoreRes.data);
          setHistory(histRes.data);
          setMatches(matchRes.data);
          setDomainSnapshots(domainRes.data);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError('Unable to load readiness calculations.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currentTier = scoreData
    ? READINESS_THRESHOLDS.find(
        (t) => scoreData.overall >= t.min && scoreData.overall <= t.max
      )
    : null;

  return {
    scoreData,
    currentTier,
    history,
    matches,
    domainSnapshots,
    isLoading,
    error,
  };
}
