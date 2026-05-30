/**
 * Button — reusable button primitive.
 * Variants: primary | secondary | ghost
 * Sizes: sm | md | lg
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] ' +
      'shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30',
    secondary:
      'bg-[var(--color-surface-2)] text-[var(--color-text)] ' +
      'border border-[var(--color-border)] hover:border-brand-400 hover:bg-brand-50 ' +
      'dark:hover:bg-brand-900/20 active:scale-[0.98]',
    ghost:
      'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] ' +
      'active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
