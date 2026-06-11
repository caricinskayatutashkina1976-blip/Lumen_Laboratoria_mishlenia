import { useState } from 'react';
import { LUMEN_IMAGE_HINT, LUMEN_IMAGE_PATH } from '../../constants/lumen';

type LumenAvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface LumenAvatarProps {
  size?: LumenAvatarSize;
  showLabel?: boolean;
  className?: string;
}

const sizeClasses: Record<LumenAvatarSize, { box: string; label: string }> = {
  sm: { box: 'h-16 w-16', label: 'text-[10px]' },
  md: { box: 'h-24 w-24 sm:h-28 sm:w-28', label: 'text-xs' },
  lg: { box: 'h-32 w-32 sm:h-36 sm:w-36', label: 'text-xs' },
  xl: { box: 'h-40 w-40 sm:h-48 sm:w-48', label: 'text-sm' },
  hero: {
    box: 'h-56 w-56 sm:h-64 sm:w-64 lg:h-80 lg:w-80 xl:h-96 xl:w-96',
    label: 'text-sm',
  },
};

export function LumenAvatar({
  size = 'md',
  showLabel = true,
  className = '',
}: LumenAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative overflow-hidden border border-lumen-silver-light bg-gradient-to-br from-lumen-graphite to-lumen-graphite-light ${
          size === 'hero'
            ? 'rounded-3xl shadow-[0_20px_60px_rgba(30,41,59,0.18)]'
            : 'rounded-2xl shadow-[0_8px_32px_rgba(30,41,59,0.15)]'
        } ${sizes.box}`}
      >
        {!imageError ? (
          <img
            src={LUMEN_IMAGE_PATH}
            alt="Люмен — AI-наставник"
            className="h-full w-full object-cover object-top"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lumen-teal/20 ring-2 ring-lumen-teal/40">
              <div className="h-5 w-5 rounded-full bg-lumen-teal shadow-[0_0_16px_rgba(20,184,166,0.8)]" />
            </div>
            <p className="text-[9px] leading-tight text-lumen-teal-muted px-1">
              {LUMEN_IMAGE_HINT}
            </p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit]" />
      </div>
      {showLabel && (
        <p className={`mt-2 text-center font-medium uppercase tracking-wider text-lumen-teal ${sizes.label}`}>
          Люмен
        </p>
      )}
    </div>
  );
}
