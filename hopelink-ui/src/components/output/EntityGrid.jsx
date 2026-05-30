/**
 * EntityGrid — displays extracted named entities in a card grid.
 */

const ENTITY_META = [
  { key: 'name',     label: 'Full Name',  icon: '👤' },
  { key: 'email',    label: 'Email',      icon: '📧' },
  { key: 'phone',    label: 'Phone',      icon: '📞' },
  { key: 'location', label: 'Location',   icon: '📍' },
  { key: 'case_id',  label: 'Case ID',    icon: '🔖' },
  { key: 'date',     label: 'Date',       icon: '📅' },
];

function EntityCell({ icon, label, value }) {
  const isEmpty = !value;
  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-150 ${
        isEmpty
          ? 'border-dashed border-[var(--color-border)] opacity-50'
          : 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-brand-300 dark:hover:border-brand-700'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-[var(--color-muted)] font-medium">{label}</span>
      </div>
      <p
        className={`text-sm font-semibold truncate ${
          isEmpty ? 'text-[var(--color-muted)] italic' : 'text-[var(--color-text)]'
        }`}
      >
        {value || 'Not detected'}
      </p>
    </div>
  );
}

export function EntityGrid({ entities }) {
  // Count how many entities were actually detected
  const detectedCount = ENTITY_META.filter(({ key }) => !!entities[key]).length;

  return (
    <div className="space-y-3 animate-slide-up [animation-delay:0.15s]">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Extracted Entities
        </h4>
        <span className="text-xs text-[var(--color-muted)]">
          {detectedCount} / {ENTITY_META.length} detected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ENTITY_META.map(({ key, label, icon }) => (
          <EntityCell key={key} icon={icon} label={label} value={entities[key]} />
        ))}
      </div>
    </div>
  );
}
