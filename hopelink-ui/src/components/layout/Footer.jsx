/** Footer — simple footer with links and copyright */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
        <p>© 2026 HopeLink. All rights reserved.</p>
        <div className="flex gap-4">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
            <a key={link} href="#" className="hover:text-[var(--color-text)] transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
