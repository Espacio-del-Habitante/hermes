"use client"

import Image from "next/image"

interface HeroSectionProps {
  isActive: boolean
  /** Navegar a una sala de la galería (Videos, Film, Fotos = salas abajo) */
  onNavigateToRoom?: (room: "videos" | "film" | "photos") => void
}

export function HeroSection({ isActive, onNavigateToRoom }: HeroSectionProps) {
  return (
    <section className="relative h-full w-full flex-shrink-0">
      {/* Background with gradient blend */}
      <div className="absolute inset-0 flex">
        {/* Dark side */}
        <div className="w-full lg:w-[55%] bg-[#0a0a0a]" />
        {/* Gradient blend zone */}
        <div className="hidden lg:block absolute left-[40%] w-[30%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#2a2a2a] to-[#e8e8e8]" />
        {/* Light side */}
        <div className="hidden lg:block w-[45%] bg-[#e8e8e8]" />
      </div>

      {/* Content container */}
      <div className="relative h-full flex overflow-hidden">
        {/* Left content area */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-20 relative min-h-0">
          {/* Archive label - Industrial style */}
          <div 
            className={`flex-shrink-0 flex items-center gap-2 transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="h-[1px] w-8 bg-[#F25835]" />
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#F25835] uppercase">
              Archivo Industrial 003
            </p>
          </div>

          {/* Mobile Layout: Content positioned towards bottom like wireframe */}
          <div className="lg:hidden flex flex-col flex-1 min-h-0 justify-end pb-4 sm:pb-6">
            {/* Main title - Mobile: large, prominent */}
            <div className="flex-shrink-0 mb-6 sm:mb-8">
              <div className="relative">
                <h1 
                  className={`font-serif italic text-[22vw] sm:text-[20vw] leading-[0.9] text-white uppercase font-normal transition-all duration-700 delay-200 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <span className="block">La Galeria</span>
                </h1>
              
              </div>
            </div>

            {/* Categories - Mobile: in row below title */}
            <div 
              className={`flex-shrink-0 flex flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 transition-all duration-700 delay-300 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button 
                onClick={() => onNavigateToRoom?.("videos")}
                className="group text-left touch-manipulation flex-1"
              >
                <h3 className="font-bebas text-base sm:text-lg text-white mb-1 transition-colors group-active:text-[#F25835] uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Videos
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.15em] text-white/40 uppercase">
                  El Sonido del Futuro
                </p>
              </button>
              <button 
                onClick={() => onNavigateToRoom?.("film")}
                className="group text-left touch-manipulation flex-1"
              >
                <h3 className="font-bebas text-base sm:text-lg text-white/40 mb-1 transition-colors group-active:text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Film
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.15em] text-white/40 uppercase">
                  Detras de Camara
                </p>
              </button>
              <button 
                onClick={() => onNavigateToRoom?.("photos")}
                className="group text-left touch-manipulation flex-1"
              >
                <h3 className="font-bebas text-base sm:text-lg text-white/40 mb-1 transition-colors group-active:text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Photos
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.15em] text-white/40 uppercase">
                  Archivo Fotografico
                </p>
              </button>
            </div>

            {/* Description - Mobile: below categories (info lema) */}
            <div 
              className={`flex-shrink-0 mb-4 sm:mb-6 transition-all duration-700 delay-400 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.1em] text-white/40 uppercase leading-relaxed">
                La galeria es un espacio dedicado a la elevacion de la
                cultura hip-hop de Cali como arte de museo.
              </p>
            </div>
          </div>

          {/* Desktop Layout: Title centered, categories at bottom */}
          <div className="hidden lg:flex flex-col flex-1 min-h-0">
            {/* Main title - Desktop: centered */}
            <div className="flex-1 flex flex-col justify-center min-h-0 py-4">
              <div className="relative">
                <h1 
                  className={`font-serif italic text-[18vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] xl:text-[8vw] leading-[0.9] text-white uppercase font-normal transition-all duration-700 delay-200 relative ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
        
                  <span className="block">La Galeria</span>

                </h1>
              
              </div>
            </div>

            {/* Bottom content categories - Desktop: at bottom */}
            <div 
              className={`flex-shrink-0 flex flex-wrap gap-6 lg:gap-8 xl:gap-12 transition-all duration-700 delay-300 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button 
                onClick={() => onNavigateToRoom?.("videos")}
                className="group text-left touch-manipulation relative"
              >
                <h3 className="font-bebas text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-0.5 sm:mb-1 transition-colors group-active:text-[#F25835] md:group-hover:text-[#F25835] uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Videos
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                  El Sonido del Futuro
                </p>
              </button>
              <button 
                onClick={() => onNavigateToRoom?.("film")}
                className="group text-left touch-manipulation"
              >
                <h3 className="font-bebas text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 mb-0.5 sm:mb-1 transition-colors group-active:text-white md:group-hover:text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Film
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                  Detras de Camara
                </p>
              </button>
              <button 
                onClick={() => onNavigateToRoom?.("photos")}
                className="group text-left touch-manipulation"
              >
                <h3 className="font-bebas text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 mb-0.5 sm:mb-1 transition-colors group-active:text-white md:group-hover:text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}>
                  Photos
                </h3>
                <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                  Archivo Fotografico
                </p>
              </button>
            </div>

            {/* Description - Desktop: at bottom */}
            <div 
              className={`flex-shrink-0 mt-4 sm:mt-6 md:mt-8 max-w-md transition-all duration-700 delay-400 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.1em] text-white/40 uppercase leading-relaxed">
                La galeria es un espacio dedicado a la elevacion de la
                cultura hip-hop de Cali como arte de museo.
              </p>
            </div>
          </div>
        </div>

        {/* Right image area - Desktop only - exactly 50% */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center z-0 p-8 xl:p-12">
          <div 
            className={`relative w-full max-w-md transition-all duration-1000 delay-300 ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src="/images/cuadro-removebg-preview.png"
              alt="Probando la Sopa - Arte colombiano"
              width={500}
              height={400}
              className="w-full h-auto grayscale drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Mobile image - visible but darkened background */}
      <div className="lg:hidden absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/cuadro-removebg-preview.png"
          alt="Arte"
          fill
          className="object-cover object-center grayscale"
          style={{ opacity: 0.25 }}
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      </div>
    </section>
  )
}
