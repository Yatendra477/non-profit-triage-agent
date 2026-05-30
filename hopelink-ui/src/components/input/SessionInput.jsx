/**
 * SessionInput — optional session ID text input.
 */
export function SessionInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5 uppercase tracking-wider">
        Session ID{' '}
        <span className="text-[var(--color-muted)] normal-case font-normal">(Optional)</span>
      </label>
      <input
        id="session-id"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`e.g., SESSION-2026-0415-001`}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]
                   text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]
                   px-4 py-2.5 transition-all duration-200
                   focus:border-brand-500 focus:bg-[var(--color-surface)]"
      />
    </div>
  );
}
