import type { KeyboardEvent } from 'react';

interface StudentInputBoxProps {
  label?: string;
  placeholder: string;
  buttonText: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  id?: string;
  disabled?: boolean;
  submitOnEnter?: boolean;
  showSubmitButton?: boolean;
}

export function StudentInputBox({
  label,
  placeholder,
  buttonText,
  helperText,
  multiline = false,
  rows = 3,
  value,
  onChange,
  onSubmit,
  id,
  disabled = false,
  submitOnEnter = true,
  showSubmitButton = true,
}: StudentInputBoxProps) {
  const inputClassName =
    'w-full rounded-xl border border-lumen-silver-light bg-lumen-bg px-4 py-3 text-sm leading-relaxed text-lumen-graphite outline-none transition-colors focus:border-lumen-teal/50 focus:ring-2 focus:ring-lumen-teal/20 disabled:opacity-60';

  function handleKeyDown(e: KeyboardEvent) {
    if (!submitOnEnter || multiline) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-semibold text-lumen-graphite">{label}</p>
      )}
      {helperText && (
        <p className="text-sm leading-relaxed text-lumen-graphite-light">{helperText}</p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={inputClassName}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 ${inputClassName}`}
          />
        )}
        {showSubmitButton && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className="lumen-btn-primary shrink-0 px-6 py-3 text-sm sm:self-end"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
