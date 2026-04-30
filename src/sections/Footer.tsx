export default function Footer() {
  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#education', label: 'Education' },
    { href: '#skills', label: 'Skills' },
    { href: '#portfolio', label: 'Work' },
    { href: '#books', label: 'Books' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <footer
      className="relative mt-12 py-8 border-t border-white/40"
      itemScope
      itemType="https://schema.org/WPFooter"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo */}
        <a
          href="#home"
          aria-label="Mahek Kasdekar — Back to top"
          className="font-display text-xl font-semibold italic text-[#1a1a2e] hover:text-[#9b4f6a] transition-colors"
          itemProp="name"
        >
          MK
        </a>

        {/* Center: Copyright */}
        <p className="text-sm font-medium text-[#6b6b8a]">
          © 2026 Mahek Kasdekar · Made with <span className="text-[#f4a7b4]" aria-hidden="true">♡</span>
        </p>

        {/* Right: Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a] hover:text-[#1a1a2e] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
