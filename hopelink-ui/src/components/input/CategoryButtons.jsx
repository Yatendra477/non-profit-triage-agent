/**
 * CategoryButtons — quick-select category pill buttons.
 * Clicking a category pre-fills the message area with a hint
 * and highlights the selected button.
 */

const CATEGORIES = [
  {
    label: 'Donation',
    icon: '💚',
    color: 'hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400',
    activeColor: 'border-emerald-400 text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
  },
  {
    label: 'Volunteer',
    icon: '🤝',
    color: 'hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400',
    activeColor: 'border-sky-400 text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20',
  },
  {
    label: 'Emergency',
    icon: '🚨',
    color: 'hover:border-red-400 hover:text-red-600 dark:hover:text-red-400',
    activeColor: 'border-red-400 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
  },
  {
    label: 'Complaint',
    icon: '📋',
    color: 'hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400',
    activeColor: 'border-amber-400 text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
  },
  {
    label: 'General Inquiry',
    icon: '💬',
    color: 'hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400',
    activeColor: 'border-brand-400 text-brand-700 bg-brand-50 dark:text-brand-400 dark:bg-brand-900/20',
  },
];

export function CategoryButtons({ selected, onSelect }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-text)] mb-2 uppercase tracking-wider">
        Category Quick-Select
      </label>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ label, icon, color, activeColor }) => {
          const isActive = selected === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(isActive ? '' : label)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                ${isActive
                  ? activeColor
                  : 'border-[var(--color-border)] text-[var(--color-muted)] bg-transparent ' + color
                }
                active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
              `}
            >
              {icon} {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
