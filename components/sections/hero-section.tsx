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
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-10 min-h-0">
          {/* Curator label */}
          <div 
            className={`flex-shrink-0 transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#F25835] uppercase mb-3 sm:mb-4 md:mb-6">
              Curaduria Actual
            </p>
          </div>

          {/* Main title */}
          <div className="flex-1 flex flex-col justify-center min-h-0 py-4 sm:py-6 md:py-8">
            <h1 
              className={`font-serif text-[18vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] xl:text-[8vw] leading-[0.85] text-white italic transition-all duration-700 delay-200 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block">Pacifico</span>
              <span className="block">Urbano</span>
            </h1>
          </div>

          {/* Bottom content categories - CLICKABLE */}
          <div 
            className={`flex-shrink-0 flex flex-wrap gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 transition-all duration-700 delay-300 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button 
              onClick={() => onNavigateToRoom?.("videos")}
              className="group text-left touch-manipulation"
            >
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-0.5 sm:mb-1 transition-colors group-active:text-[#F25835] md:group-hover:text-[#F25835]">
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
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 mb-0.5 sm:mb-1 italic transition-colors group-active:text-white md:group-hover:text-white">
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
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/40 mb-0.5 sm:mb-1 italic transition-colors group-active:text-white md:group-hover:text-white">
                Photos
              </h3>
              <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                Archivo Fotografico
              </p>
            </button>
          </div>

          {/* Description */}
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

        {/* Right image area - Desktop only */}
        <div className="hidden lg:flex w-[45%] relative items-center justify-center z-0">
          <div 
            className={`relative w-[80%] max-w-lg transition-all duration-1000 delay-300 ${
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

      {/* Mobile image - subtle in corner */}
      <div className="lg:hidden absolute top-16 sm:top-20 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 opacity-10 sm:opacity-20 pointer-events-none">
        <Image
          src="/images/cuadro-removebg-preview.png"
          alt="Arte"
          fill
          className="object-contain object-right grayscale"
        />
      </div>
    </section>
  )
}
