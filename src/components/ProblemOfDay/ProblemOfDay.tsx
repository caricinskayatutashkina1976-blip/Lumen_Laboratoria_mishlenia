import { Link } from 'react-router-dom';
import type { Problem } from '../../types';

interface ProblemOfDayProps {
  problem: Problem;
}

export function ProblemOfDay({ problem }: ProblemOfDayProps) {
  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-blue">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-blue to-lumen-teal" />
      <div className="relative p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-blue">
          Задача дня
        </p>
        <h2 className="mt-2 text-lg font-semibold text-lumen-graphite sm:text-xl">
          {problem.title}
        </h2>
        <p className="mt-1 text-xs text-lumen-teal">{problem.lifeContext}</p>
        <p className="mt-3 text-sm leading-relaxed text-lumen-graphite-light line-clamp-2">
          {problem.problemText}
        </p>
        <p className="mt-2 text-xs text-lumen-silver">
          Сложность: {problem.difficulty}
        </p>
        <Link to={`/problem/${problem.id}`} className="lumen-btn-primary mt-4 inline-flex text-sm">
          Разобрать задачу
        </Link>
      </div>
    </section>
  );
}
