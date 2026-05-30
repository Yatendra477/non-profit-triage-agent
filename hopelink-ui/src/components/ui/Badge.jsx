/**
 * Badge — colored pill badge for category / urgency / team labels.
 * Color variants match intent and urgency semantics.
 */

const COLOR_MAP = {
  // Categories
  Donation:          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Volunteer:         'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  Emergency:         'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Emergency Help':  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Complaint:         'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'General Inquiry': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  // Urgency
  High:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Low:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  // Teams
  human_agent:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  finance_team:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  volunteer_team: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  general_support:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

/**
 * Human-readable labels for route/team names.
 */
export const TEAM_LABELS = {
  human_agent:    'Human Agent',
  finance_team:   'Finance Team',
  volunteer_team: 'Volunteer Team',
  general_support:'General Support',
};

export function Badge({ label, value, dot = false, size = 'md', className = '' }) {
  const color = COLOR_MAP[value] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${padding} ${color} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {label || TEAM_LABELS[value] || value}
    </span>
  );
}
