/**
 * EmptyState — shown before any analysis has been run.
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 animate-fade-in">
      {/* Illustrated icon */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/20 flex items-center justify-center shadow-inner">
        <svg className="w-9 h-9 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>

      <div className="text-center space-y-2 max-w-xs">
        <h3 className="text-base font-bold text-[var(--color-text)]">No Analysis Yet</h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Enter a support message above and click{' '}
          <span className="font-medium text-brand-500">"Analyze Message"</span> to see
          AI-powered insights, classification, and recommendations.
        </p>
      </div>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-2">
        {['bg-brand-300', 'bg-purple-300', 'bg-emerald-300'].map((c, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${c} opacity-60 animate-pulse`}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
