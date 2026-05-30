/**
 * Spinner — full-panel loading animation shown while the LLM processes.
 */
export function Spinner({ message = 'Analyzing…' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-5 animate-fade-in">
      {/* Orbital rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-brand-900" />
        <div className="absolute inset-0 rounded-full border-4 border-t-brand-500 animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-t-brand-400 animate-spin [animation-duration:0.6s] [animation-direction:reverse]" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-[var(--color-text)]">{message}</p>
        <p className="text-xs text-[var(--color-muted)]">
          Running classification, NER, and response generation…
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
