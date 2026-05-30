/**
 * MessageInput — support message textarea with character counter.
 */

const MAX_CHARS = 4000;

export function MessageInput({ value, onChange }) {
  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining < 200;

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5 uppercase tracking-wider">
        Support Message
      </label>
      <div className="relative">
        <textarea
          id="support-message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter the user's support message here…"
          maxLength={MAX_CHARS}
          rows={5}
          className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] 
                     text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] 
                     px-4 py-3 transition-all duration-200
                     focus:border-brand-500 focus:bg-[var(--color-surface)]"
        />
        {/* Character counter */}
        <span
          className={`absolute bottom-2.5 right-3 text-xs font-mono transition-colors ${
            isNearLimit ? 'text-amber-500' : 'text-[var(--color-muted)]'
          }`}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
