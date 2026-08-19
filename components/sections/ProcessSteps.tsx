import type { ReactNode } from 'react';
import StaggerGroup from '../motion/StaggerGroup';

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  /** Optional icon dropped into the step marker instead of the number. */
  icon?: ReactNode;
}

export interface ProcessStepsProps {
  steps: ProcessStep[];
  onDark?: boolean;
  className?: string;
}

/**
 * The template's numbered process row: an oversized display number per step,
 * joined by a hairline rule that stops before the last marker.
 */
export default function ProcessSteps({ steps, onDark = false, className = '' }: ProcessStepsProps) {
  if (steps.length === 0) return null;

  return (
    <StaggerGroup className={`grid gap-10 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Connector, hidden on the last marker and on stacked layouts */}
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={`absolute left-16 top-7 hidden h-px w-[calc(100%-3rem)] lg:block ${
                onDark ? 'bg-white/14' : 'bg-navy/14'
              }`}
            />
          )}

          <div
            className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-pill border text-lg font-semibold ${
              onDark ? 'border-white/14 bg-navy text-white' : 'border-navy/14 bg-surface text-navy'
            }`}
          >
            {step.icon ?? <span className="font-display tracking-display">{String(index + 1).padStart(2, '0')}</span>}
          </div>

          <h3
            className={`font-display mt-6 text-d5 uppercase leading-display tracking-display ${
              onDark ? 'text-white' : 'text-navy'
            }`}
          >
            {step.title}
          </h3>

          <p className={`mt-3 text-base leading-[1.6] ${onDark ? 'text-white/80' : 'text-ink'}`}>
            {step.description}
          </p>
        </div>
      ))}
    </StaggerGroup>
  );
}
