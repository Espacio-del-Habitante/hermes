"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import type { GalleryRoomId } from "@/lib/gallery-map"

interface GalleryHeaderProps {
  currentSection: GalleryRoomId
  onNavigate: (section: GalleryRoomId) => void
}

/** Pasillo principal: derecha desde Inicio */
const mainCorridor = [
  { id: "artistas" as const, label: "ARTISTAS" },
  { id: "lanzamientos" as const, label: "LANZAMIENTOS" },
  { id: "albumes" as const, label: "ALBUMES" },
]

/** Salas abajo (bajar desde Inicio / Artistas / Lanzamientos) */
const roomsBelow = [
  { id: "videos" as const, label: "VIDEOS" },
  { id: "film" as const, label: "FILM" },
  { id: "photos" as const, label: "FOTOS" },
]

export function GalleryHeader({ currentSection, onNavigate }: GalleryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Debug: log menu state changes
  useEffect(() => {
    console.log('Menu state changed to:', isMenuOpen)
  }, [isMenuOpen])

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
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 md:px-12 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menú hamburguesa solo en tablet y móvil; en web la navegación está en la barra */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsMenuOpen(prev => !prev)
            }}
            className="lg:hidden flex h-9 w-9 md:h-10 md:w-10 items-center justify-center text-white transition-all duration-200 active:text-[#F25835] active:scale-95 md:hover:text-[#F25835] touch-manipulation z-[102] relative"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 md:h-6 md:w-6 stroke-[2]" />
            ) : (
              <Menu className="h-5 w-5 md:h-6 md:w-6 stroke-[2]" />
            )}
          </button>
          <button 
            onClick={() => onNavigate("inicio")}
            className="font-mono text-xs sm:text-sm tracking-[0.15em] text-white transition-colors active:text-[#F25835] md:hover:text-[#F25835] touch-manipulation"
          >
            LA GALERIA / CALI
          </button>
        </div>

      {/* Desktop: pasillo + salas abajo (concepto galería) */}
      <nav className="hidden lg:flex items-center gap-8">
          {mainCorridor.map((item) => (
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
          <span className="text-white/20 font-mono text-xs">|</span>
          {roomsBelow.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-mono text-xs tracking-[0.15em] transition-colors ${
                currentSection === item.id
                  ? "text-[#F25835]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

      {/* Social links */}
      <div className="hidden lg:flex items-center gap-6">
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
      </header>

      {/* Sidebar Menu - Desktop: slides from left */}
      {isMenuOpen && (
        <>
          {/* Backdrop - Desktop only */}
          <div 
            className="hidden md:block fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-[119] transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar - Desktop: slides from left */}
          <div 
            className={`hidden md:flex fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] z-[120] overflow-y-auto pointer-events-auto bg-[#0a0a0a] border-r border-white/10 transition-transform duration-300 ease-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col items-start gap-8 p-8 w-full min-h-full">
              <div className="flex items-center justify-between w-full mb-4">
                <h2 className="font-mono text-sm tracking-[0.2em] text-white/40 uppercase">
                  Navegación
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center text-white/60 transition-colors hover:text-white active:text-[#F25835]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  onNavigate("inicio")
                  setIsMenuOpen(false)
                }}
                className={`font-serif text-2xl italic transition-all duration-200 touch-manipulation active:scale-95 w-full text-left ${
                  currentSection === "inicio" 
                    ? "text-white" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                Inicio
              </button>

              <div className="w-full pt-4 border-t border-white/10">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase mb-4">
                  Pasillo
                </p>
                <div className="flex flex-col gap-4">
                  {mainCorridor.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setIsMenuOpen(false)
                      }}
                      className={`font-serif text-xl italic transition-all duration-200 touch-manipulation active:scale-95 text-left ${
                        currentSection === item.id 
                          ? "text-white" 
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full pt-4 border-t border-white/10">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase mb-4">
                  Salas abajo
                </p>
                <div className="flex flex-col gap-4">
                  {roomsBelow.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setIsMenuOpen(false)
                      }}
                      className={`font-serif text-lg italic transition-all duration-200 touch-manipulation active:scale-95 text-left ${
                        currentSection === item.id 
                          ? "text-[#F25835]" 
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Social links */}
              <div className="mt-auto pt-8 pb-8 w-full border-t border-white/10">
                <div className="flex gap-6">
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    IG
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FB
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-white/50 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    YT
                  </a>
                </div>
              </div>
            </nav>
          </div>

          {/* Mobile Menu Overlay - Full screen */}
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-sm z-[119] transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Content: mapa de la galería (pasillo + salas abajo) */}
            <div 
              className="fixed left-0 right-0 bottom-0 top-16 z-[120] overflow-y-auto pointer-events-auto bg-[#0a0a0a] animate-in slide-in-from-top-2 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón X para cerrar — esquina superior derecha */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors active:bg-white/10 active:text-white hover:bg-white/10 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
              </button>
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
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase pt-2">
                  Pasillo
                </p>
                {mainCorridor.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`font-serif text-2xl sm:text-3xl italic transition-all duration-200 touch-manipulation active:scale-95 ${
                      currentSection === item.id 
                        ? "text-white" 
                        : "text-white/50 active:text-white"
                    }`}
                  >
                    {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                  </button>
                ))}
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase pt-4">
                  Salas abajo
                </p>
                {roomsBelow.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`font-serif text-xl sm:text-2xl italic transition-all duration-200 touch-manipulation active:scale-95 ${
                      currentSection === item.id 
                        ? "text-[#F25835]" 
                        : "text-white/50 active:text-white"
                    }`}
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
          </div>
        </>
      )}
    </>
  )
}
