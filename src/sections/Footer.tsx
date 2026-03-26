export default function Footer() {
  return (
    <footer className="relative mt-12 py-8 border-t border-white/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo */}
        <span className="font-display text-xl font-semibold italic text-[#1a1a2e]">
          MK
        </span>

        {/* Center: Copyright */}
        <p className="text-sm font-medium text-[#6b6b8a]">
          © 2025 Mahek Kasdekar · Made with <span className="text-[#f4a7b4]">♡</span>
        </p>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <a href="#home" className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a] hover:text-[#1a1a2e] transition-colors">
            Home
          </a>
          <a href="#about" className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a] hover:text-[#1a1a2e] transition-colors">
            About
          </a>
          <a href="#portfolio" className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a] hover:text-[#1a1a2e] transition-colors">
            Work
          </a>
        </div>
      </div>
    </footer>
  )
}
