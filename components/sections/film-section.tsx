"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"
import { Play } from "lucide-react"

interface FilmSectionProps {
  isActive: boolean
}

export function FilmSection({ isActive }: FilmSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isActive && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isActive])

  return (
    <section className="relative h-full w-full flex-shrink-0 flex overflow-hidden">
      {/* Background image - Mobile only */}
      <div className="md:hidden absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/probando-la-sopa.png"
          alt="Film background"
          fill
          className="object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      {/* Left - Title and info */}
      <div ref={scrollRef} className="relative z-10 flex-1 bg-[#0a0a0a] md:bg-[#0a0a0a] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 overflow-y-auto overflow-x-hidden pb-24 sm:pb-12 md:pb-8">
        <div 
          className={`transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[#F29422] uppercase mb-2">
            Detras de Camara
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white">
            Film
          </h2>
        </div>

        <div 
          className={`flex-1 flex flex-col justify-center max-w-lg transition-all duration-700 delay-200 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-4">
            Documental: Raices del Pacifico
          </h3>
          <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
            Un viaje visual por las calles de Cali, explorando las raices 
            musicales y artisticas que dieron origen al movimiento Guateke.
          </p>
          <div className="flex items-center gap-6 text-white/40 font-mono text-xs">
            <span>45 min</span>
            <span className="w-1 h-1 rounded-full bg-[#9AD9B0]" />
            <span>2024</span>
            <span className="w-1 h-1 rounded-full bg-[#F29422]" />
            <span>Espanol</span>
          </div>
          <button className="mt-8 self-start px-8 py-4 border border-white/20 font-mono text-xs tracking-[0.15em] text-white uppercase hover:bg-white hover:text-black transition-all flex items-center gap-3">
            <Play className="w-4 h-4" />
            Ver Documental
          </button>

          {/* Space for more documentaries - Mobile */}
          <div className="md:hidden mt-12 space-y-8 pb-8">
            <div className="opacity-50">
              <h4 className="font-serif text-2xl text-white italic mb-3">
                Próximamente
              </h4>
              <p className="font-mono text-sm text-white/40 leading-relaxed mb-4">
                Más documentales y contenido exclusivo próximamente.
              </p>
            </div>
            <div className="opacity-30">
              <h4 className="font-serif text-2xl text-white italic mb-3">
                Próximamente
              </h4>
              <p className="font-mono text-sm text-white/40 leading-relaxed">
                Más documentales y contenido exclusivo próximamente.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="shrink-0 flex items-center justify-between mt-6 md:mt-0">
          <p className="font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase">
            Scroll to continue exploring
          </p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#F29422]" />
            <span className="font-mono text-[10px] text-[#F29422]">02</span>
          </div>
        </div>
      </div>

      {/* Right - Featured still */}
      <div className="hidden lg:block w-[55%] bg-[#1a1a1a] relative overflow-hidden">
        <div 
          className={`absolute inset-0 transition-all duration-1000 delay-300 ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src="/images/probando-la-sopa.png"
            alt="Film still"
            fill
            className="object-cover grayscale"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
          
          {/* Film frame overlay */}
          <div className="absolute inset-8 border border-white/10 pointer-events-none" />
          
          {/* Play button center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-24 h-24 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-all group">
              <Play className="w-10 h-10 text-white fill-white ml-2 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
