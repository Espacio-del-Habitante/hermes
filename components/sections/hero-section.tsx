"use client"

import Image from "next/image"

type HeroSubSection = "main" | "videos" | "film" | "photos"

interface HeroSectionProps {
  isActive: boolean
  onNavigateToSub: (sub: HeroSubSection) => void
}

export function HeroSection({ isActive, onNavigateToSub }: HeroSectionProps) {
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
      <div className="relative h-full flex">
        {/* Left content area */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 z-10">
          {/* Curator label */}
          <div 
            className={`transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#F25835] uppercase mb-4 sm:mb-6">
              Curaduria Actual
            </p>
          </div>

          {/* Main title */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 
              className={`font-serif text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] text-white italic transition-all duration-700 delay-200 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block">Pacifico</span>
              <span className="block">Urbano</span>
            </h1>
          </div>

          {/* Bottom content categories - CLICKABLE */}
          <div 
            className={`flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 transition-all duration-700 delay-300 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button 
              onClick={() => onNavigateToSub("videos")}
              className="group text-left"
            >
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white mb-1 transition-colors group-hover:text-[#F25835]">
                Videos
              </h3>
              <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                El Sonido del Futuro
              </p>
            </button>
            <button 
              onClick={() => onNavigateToSub("film")}
              className="group text-left"
            >
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white/40 mb-1 italic transition-colors group-hover:text-white">
                Film
              </h3>
              <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                Detras de Camara
              </p>
            </button>
            <button 
              onClick={() => onNavigateToSub("photos")}
              className="group text-left"
            >
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white/40 mb-1 italic transition-colors group-hover:text-white">
                Photos
              </h3>
              <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.15em] text-white/40 uppercase">
                Archivo Fotografico
              </p>
            </button>
          </div>

          {/* Description */}
          <div 
            className={`mt-6 sm:mt-8 max-w-md transition-all duration-700 delay-400 ${
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
      <div className="lg:hidden absolute top-20 right-0 w-32 sm:w-40 h-32 sm:h-40 opacity-20 pointer-events-none">
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
