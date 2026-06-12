import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Grade } from '../types';
import { gradeViewToParam, parseGradeView } from '../data/grades';

export function useGradeView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const gradeView = useMemo(
    () => parseGradeView(searchParams.get('grade')),
    [searchParams],
  );

  const setGradeView = useCallback(
    (grade: Grade) => {
      const next = new URLSearchParams(searchParams);
      next.set('grade', gradeViewToParam(grade));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return { gradeView, setGradeView };
}
