/**
 * Navbar — top navigation bar.
 * Includes logo, nav links, dark-mode toggle, and user avatar.
 */
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Dashboard', href: '#', active: true },
];

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function HopeLinkLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-md shadow-brand-500/30">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <span className="font-bold text-base tracking-tight text-[var(--color-text)]">
        HopeLink
      </span>
    </div>
  );
}

export function Navbar() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass blur background */}
      <div
        className="border-b border-[var(--color-border)]"
        style={{
          background: 'var(--color-surface)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left — Logo */}
          <HopeLinkLogo />

          {/* Center — Nav links (hidden on small screens) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, active }) => (
              <a
                key={label}
                href={href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  active
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right — theme toggle + avatar */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              style={{ background: isDark ? '#4f46e5' : '#e2e8f0' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-transform duration-300"
                style={{ transform: isDark ? 'translateX(24px)' : 'translateX(0)' }}
              >
                {isDark ? (
                  <MoonIcon />
                ) : (
                  <SunIcon />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
