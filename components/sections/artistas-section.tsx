"use client"

import Image from "next/image"
import { useState } from "react"

interface ArtistasSectionProps {
  isActive: boolean
}

const artistas = [
  { 
    id: 1, 
    name: "El Colectivo", 
    role: "Guateke",
    image: "/images/guateke-cover.png",
    description: "Grupo fundador del movimiento hip-hop en Cali"
  },
  { 
    id: 2, 
    name: "Probando la Sopa", 
    role: "Album 2023",
    image: "/images/probando-la-sopa.png",
    description: "Arte visual que representa la esencia del Pacifico"
  },
  { 
    id: 3, 
    name: "Cubanitos", 
    role: "Single",
    image: "/images/cubanitos-cover.png",
    description: "Fusion tropical con sonidos urbanos contemporaneos"
  },
]

export function ArtistasSection({ isActive }: ArtistasSectionProps) {
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)

  return (
    <section className="relative h-full w-screen flex-shrink-0 bg-[#0a0a0a] overflow-hidden">
      <div className="h-full flex flex-col pt-12 sm:pt-16 md:pt-24 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
        {/* Section header */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[#F25835] uppercase mb-2">
            El Colectivo
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white">
            Artistas
          </h2>
        </div>

        {/* Artists grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {artistas.map((artista, index) => (
            <div
              key={artista.id}
              className={`group relative cursor-pointer transition-all duration-700 ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onMouseEnter={() => setHoveredArtist(artista.id)}
              onMouseLeave={() => setHoveredArtist(null)}
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={artista.image || "/placeholder.svg"}
                  alt={artista.name}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    hoveredArtist === artista.id 
                      ? "scale-105" 
                      : "scale-100"
                  }`}
                />
                {/* Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                    hoveredArtist === artista.id ? "opacity-100" : "opacity-0"
                  }`}
                />
                
                {/* Accent corner */}
                <div className="absolute top-0 right-0 w-12 h-12">
                  <div 
                    className={`absolute top-0 right-0 w-full h-[2px] transition-all duration-300 ${
                      hoveredArtist === artista.id 
                        ? "bg-[#F25835] w-full" 
                        : "bg-white/20 w-6"
                    }`}
                  />
                  <div 
                    className={`absolute top-0 right-0 h-full w-[2px] transition-all duration-300 ${
                      hoveredArtist === artista.id 
                        ? "bg-[#F25835] h-full" 
                        : "bg-white/20 h-6"
                    }`}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mt-4">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">
                  {artista.role}
                </p>
                <h3 className="font-serif text-2xl text-white group-hover:text-[#F25835] transition-colors">
                  {artista.name}
                </h3>
                <p 
                  className={`font-mono text-xs text-white/50 mt-2 transition-all duration-300 ${
                    hoveredArtist === artista.id 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 -translate-y-2"
                  }`}
                >
                  {artista.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-20 left-12 hidden md:block">
          <div className="flex items-center gap-4">
            <div className="w-16 h-[1px] bg-[#9AD9B0]" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#9AD9B0] uppercase">
              Cali, Colombia
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
