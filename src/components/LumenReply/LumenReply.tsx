interface LumenReplyProps {
  label?: string;
  text: string;
  variant?: 'default' | 'success' | 'hint';
}

export function LumenReply({ label = 'Люмен', text, variant = 'default' }: LumenReplyProps) {
  const styles = {
    default: 'border-lumen-teal/25 bg-lumen-teal-soft/30',
    success: 'border-lumen-teal/30 bg-lumen-teal-soft/40',
    hint: 'border-lumen-blue/20 bg-lumen-blue-soft/25',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles[variant]}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-lumen-teal">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-lumen-graphite-light">{text}</p>
    </div>
  );
}
