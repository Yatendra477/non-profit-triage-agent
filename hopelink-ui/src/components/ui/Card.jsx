/**
 * Card — glass-style surface container.
 * Can optionally show a title and subtitle header.
 */
export function Card({ children, title, subtitle, className = '', noPad = false }) {
  return (
    <div className={`glass-card ${noPad ? '' : 'p-5'} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-[var(--color-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
