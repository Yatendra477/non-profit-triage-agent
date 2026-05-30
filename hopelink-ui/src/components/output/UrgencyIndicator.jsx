/**
 * UrgencyIndicator — prominent visual urgency level display.
 * Shows a color-coded bar + label + icon.
 */

const URGENCY_CONFIG = {
  High: {
    bar:   'bg-red-500',
    bg:    'bg-red-50 dark:bg-red-900/20',
    border:'border-red-200 dark:border-red-800',
    text:  'text-red-700 dark:text-red-400',
    icon:  '🔴',
    desc:  'Requires immediate attention',
    width: 'w-full',
  },
  Medium: {
    bar:   'bg-amber-500',
    bg:    'bg-amber-50 dark:bg-amber-900/20',
    border:'border-amber-200 dark:border-amber-800',
    text:  'text-amber-700 dark:text-amber-400',
    icon:  '🟡',
    desc:  'Should be addressed promptly',
    width: 'w-2/3',
  },
  Low: {
    bar:   'bg-emerald-500',
    bg:    'bg-emerald-50 dark:bg-emerald-900/20',
    border:'border-emerald-200 dark:border-emerald-800',
    text:  'text-emerald-700 dark:text-emerald-400',
    icon:  '🟢',
    desc:  'Routine — standard queue',
    width: 'w-1/3',
  },
};

export function UrgencyIndicator({ urgency }) {
  const config = URGENCY_CONFIG[urgency] ?? URGENCY_CONFIG.Low;

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border} animate-slide-up`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Urgency Level
        </span>
        <span className={`text-sm font-bold flex items-center gap-1.5 ${config.text}`}>
          {config.icon} {urgency}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${config.bar} transition-all duration-700 ease-out`}
          style={{ width: urgency === 'High' ? '100%' : urgency === 'Medium' ? '66%' : '33%' }}
        />
      </div>

      <p className={`text-xs mt-2 ${config.text} opacity-80`}>{config.desc}</p>
    </div>
  );
}
