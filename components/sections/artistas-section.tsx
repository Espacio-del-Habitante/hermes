"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { User, Lock } from "lucide-react"
import { getArtistImageUrl, ARTISTS, type ArtistRoomId } from "@/lib/supabase-urls"
import type { GalleryRoomId } from "@/lib/gallery-map"

interface ArtistasSectionProps {
  isActive: boolean
  onNavigateToArtist?: (artistId: GalleryRoomId) => void
}

const ARTIST_IDS: ArtistRoomId[] = ["grioth", "kiro", "arenas", "apolo", "manucho", "bambuco-loco"]

export function ArtistasSection({ isActive, onNavigateToArtist }: ArtistasSectionProps) {
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isActive])

  return (
    <section className="relative h-full w-screen flex-shrink-0 bg-[#0a0a0a] overflow-hidden">
      <div ref={scrollRef} className="h-full flex flex-col pt-12 sm:pt-16 md:pt-24 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto overflow-x-hidden">
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
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ARTIST_IDS.map((id, index) => {
            const artist = ARTISTS[id]
            const isComingSoon = artist.imageCount === 0
            return (
              <div
                key={id}
                className={`group relative cursor-pointer transition-all duration-700 ${
                  isActive 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
                onMouseEnter={() => setHoveredArtist(id)}
                onMouseLeave={() => setHoveredArtist(null)}
                onClick={() => onNavigateToArtist?.(id)}
              >
                {isComingSoon ? (
                  /* Estilo Def Jam / fighting game — personaje bloqueado, silueta en sombra */
                  <div className="relative aspect-square overflow-hidden bg-[#0a0a0a] border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Fondo con viñeta — más claro en centro para que la silueta se vea */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,30,30,0.8)_0%,rgba(10,10,10,0.95)_60%,#080808_100%)]" />
                    {/* Silueta grande — más oscura al hover */}
                    <div className="absolute inset-0 flex items-end justify-center pb-4 md:pb-6">
                      <User 
                        className="w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 text-white/[0.08] fill-white/[0.06] stroke-white/[0.04] group-hover:fill-white/[0.02] group-hover:stroke-white/[0.02] transition-all duration-300" 
                        strokeWidth={1.5} 
                      />
                    </div>
                    {/* Overlay oscuro al hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 pointer-events-none" />
                    {/* Candado al tamaño de la card en hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <Lock className="w-[55%] h-[55%] max-w-48 max-h-48 text-white/[0.12]" strokeWidth={1} />
                    </div>
                    {/* Línea sutil */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    {/* Nombre y Próximamente */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 md:pt-20">
                      <h3 className="font-serif text-lg md:text-xl text-white/50 group-hover:text-white/70 transition-colors truncate">
                        {artist.name}
                      </h3>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mt-2">
                        Próximamente
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
                      <Image
                        src={getArtistImageUrl(id, 1)}
                        alt={artist.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          hoveredArtist === id ? "scale-105" : "scale-100"
                        }`}
                        unoptimized
                      />
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                          hoveredArtist === id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-12 h-12">
                        <div 
                          className={`absolute top-0 right-0 w-full h-[2px] transition-all duration-300 ${
                            hoveredArtist === id ? "bg-[#F25835] w-full" : "bg-white/20 w-6"
                          }`}
                        />
                        <div 
                          className={`absolute top-0 right-0 h-full w-[2px] transition-all duration-300 ${
                            hoveredArtist === id ? "bg-[#F25835] h-full" : "bg-white/20 h-6"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-mono text-[10px] tracking-[0.2em] text-[#F25835] uppercase mb-1">
                        Artista
                      </p>
                      <h3 className="font-serif text-2xl text-white group-hover:text-[#F25835] transition-colors">
                        {artist.name}
                      </h3>
                      <p 
                        className={`font-mono text-xs text-white/50 mt-2 transition-all duration-300 ${
                          hoveredArtist === id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                      >
                        Rapero y compositor del Valle del Cauca
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
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
