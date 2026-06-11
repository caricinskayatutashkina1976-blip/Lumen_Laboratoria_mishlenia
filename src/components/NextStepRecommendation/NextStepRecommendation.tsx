import { Link } from 'react-router-dom';
import type { NextStepRecommendationData } from '../../types';

interface NextStepRecommendationProps {
  recommendation: NextStepRecommendationData;
  compact?: boolean;
}

export function NextStepRecommendation({
  recommendation,
  compact = false,
}: NextStepRecommendationProps) {
  return (
    <section className="lumen-card overflow-hidden border-l-4 border-lumen-teal">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lumen-teal/60 to-lumen-blue/60" />
      <div className={`relative ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">
          Что сделать дальше
        </p>
        <p className="mt-1 text-sm text-lumen-silver">{recommendation.summary}</p>

        <h3
          className={`mt-3 font-semibold text-lumen-graphite ${
            compact ? 'text-base' : 'text-lg sm:text-xl'
          }`}
        >
          {recommendation.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-lumen-graphite-light sm:text-base">
          {recommendation.text}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link to={recommendation.primaryLink} className="lumen-btn-primary text-center text-sm">
            {recommendation.primaryLabel}
          </Link>
          <Link
            to={recommendation.secondaryLink}
            className="lumen-btn-secondary text-center text-sm"
          >
            {recommendation.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
