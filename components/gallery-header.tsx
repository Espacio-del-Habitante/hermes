"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface GalleryHeaderProps {
  currentSection: string
  onNavigate: (section: "inicio" | "artistas" | "lanzamientos" | "albumes") => void
}

const navItems = [
  { id: "artistas", label: "ARTISTAS" },
  { id: "lanzamientos", label: "LANZAMIENTOS" },
  { id: "albumes", label: "ALBUMES" },
] as const

export function GalleryHeader({ currentSection, onNavigate }: GalleryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex h-20 items-center justify-between px-6 md:px-12 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
      {/* Logo / Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-[#F25835]"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <button 
          onClick={() => onNavigate("inicio")}
          className="font-mono text-sm tracking-[0.15em] text-white transition-colors hover:text-[#F25835]"
        >
          LA GALERIA / CALI
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-12">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`font-mono text-sm tracking-[0.15em] transition-colors ${
              currentSection === item.id
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Social links */}
      <div className="hidden md:flex items-center gap-6">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-[0.15em] text-white/50 transition-colors hover:text-white"
        >
          IG
        </a>
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-[0.15em] text-white/50 transition-colors hover:text-white"
        >
          FB
        </a>
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-[0.15em] text-white/50 transition-colors hover:text-white"
        >
          YT
        </a>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 bg-[#0a0a0a] z-40 md:hidden">
          <nav className="flex flex-col items-start gap-8 p-8">
            <button
              onClick={() => {
                onNavigate("inicio")
                setIsMenuOpen(false)
              }}
              className={`font-serif text-4xl italic transition-colors ${
                currentSection === "inicio" ? "text-white" : "text-white/50"
              }`}
            >
              Inicio
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setIsMenuOpen(false)
                }}
                className={`font-serif text-4xl italic transition-colors ${
                  currentSection === item.id ? "text-white" : "text-white/50"
                }`}
              >
                {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
              </button>
            ))}
            <div className="mt-auto flex gap-8 pt-12">
              <a href="#" className="font-mono text-sm text-white/50">IG</a>
              <a href="#" className="font-mono text-sm text-white/50">FB</a>
              <a href="#" className="font-mono text-sm text-white/50">YT</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
