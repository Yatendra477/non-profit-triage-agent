/**
 * ResultPanel — the full output panel shown after analysis.
 * Composes UrgencyIndicator, EntityGrid, and ResponseBox
 * alongside classification badges and team routing info.
 */
import { Badge, TEAM_LABELS } from '../ui/Badge';
import { UrgencyIndicator } from './UrgencyIndicator';
import { EntityGrid } from './EntityGrid';
import { ResponseBox } from './ResponseBox';

/**
 * Team icons for the routing display.
 */
const TEAM_ICONS = {
  human_agent:    '🚨',
  finance_team:   '💚',
  volunteer_team: '🤝',
  general_support:'💬',
};

export function ResultPanel({ result }) {
  const { category, urgency, team, response, escalated, entities } = result;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top classification row ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-[var(--color-muted)] font-medium">Classification:</span>
        <Badge value={category} label={category} dot />
        <span className="text-xs text-[var(--color-muted)]">·</span>
        <span className="text-xs text-[var(--color-muted)] font-medium">Urgency:</span>
        <Badge value={urgency} label={urgency} dot />
      </div>

      {/* ── Urgency indicator bar ──────────────────────────────────── */}
      <UrgencyIndicator urgency={urgency} />

      {/* ── Routing / Team assignment ──────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] animate-slide-up [animation-delay:0.1s]">
        <div className="text-2xl">{TEAM_ICONS[team] ?? '📌'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Assigned Team
            </span>
            <Badge value={team} size="sm" />
            {escalated && (
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                ⚡ Escalated
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {TEAM_LABELS[team] ?? team}
          </p>
        </div>
      </div>

      {/* ── AI Response ────────────────────────────────────────────── */}
      <ResponseBox response={response} />

      {/* ── Entity Grid ────────────────────────────────────────────── */}
      <EntityGrid entities={entities} />
    </div>
  );
}
