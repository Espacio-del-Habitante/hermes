"use client"

import { useState, useEffect } from "react"
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 md:px-12 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsMenuOpen(!isMenuOpen)
          }}
          className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center text-white transition-colors active:text-[#F25835] md:hover:text-[#F25835] touch-manipulation z-[101] relative"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
        </button>
        <button 
          onClick={() => onNavigate("inicio")}
          className="font-mono text-xs sm:text-sm tracking-[0.15em] text-white transition-colors active:text-[#F25835] md:hover:text-[#F25835] touch-manipulation"
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
        <>
          {/* Backdrop */}
          <div 
            className="fixed left-0 right-0 bottom-0 top-16 md:top-20 bg-[#0a0a0a]/98 backdrop-blur-sm z-[99] md:hidden transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed left-0 right-0 bottom-0 top-16 md:top-20 z-[99] md:hidden overflow-y-auto pointer-events-auto bg-[#0a0a0a]">
            <nav className="flex flex-col items-start gap-6 sm:gap-8 p-6 sm:p-8 min-h-full">
              <button
                onClick={() => {
                  onNavigate("inicio")
                  setIsMenuOpen(false)
                }}
                className={`font-serif text-3xl sm:text-4xl italic transition-all duration-200 touch-manipulation active:scale-95 ${
                  currentSection === "inicio" 
                    ? "text-white" 
                    : "text-white/50 active:text-white"
                }`}
              >
                Inicio
              </button>
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`font-serif text-3xl sm:text-4xl italic transition-all duration-200 touch-manipulation active:scale-95 ${
                    currentSection === item.id 
                      ? "text-white" 
                      : "text-white/50 active:text-white"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                </button>
              ))}
              
              {/* Social links */}
              <div className="mt-auto pt-8 sm:pt-12 pb-8">
                <div className="flex gap-6 sm:gap-8">
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 active:text-white transition-colors touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    IG
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 active:text-white transition-colors touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FB
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 active:text-white transition-colors touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    YT
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
