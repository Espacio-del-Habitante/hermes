"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"
import { Play } from "lucide-react"
import { getReleasesByDate, getReleaseTypeLabel } from "@/lib/albums"

interface LanzamientosSectionProps {
  isActive: boolean
  /** Ir a la sección Álbumes con este álbum seleccionado. */
  onNavigateToAlbum?: (albumId: number) => void
}

const releases = getReleasesByDate()
const featured = releases[0]

export function LanzamientosSection({ isActive, onNavigateToAlbum }: LanzamientosSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isActive && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isActive])

  return (
    <section className="relative h-full w-screen flex-shrink-0 flex">
      {/* Left panel - Featured release */}
      <div ref={scrollRef} className="flex-1 bg-[#1a1a1a] flex flex-col pt-12 sm:pt-16 md:pt-24 p-6 sm:p-8 md:p-12 overflow-y-auto overflow-x-hidden pb-24 sm:pb-12 md:pb-12">
        <div 
          className={`transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[#F29422] uppercase mb-2">
            Ultimo Lanzamiento
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white mb-8">
            Lanzamientos
          </h2>
        </div>

        {/* Featured album */}
        <div 
          className={`flex-1 flex flex-col md:flex-row gap-8 items-center justify-center pb-4 sm:pb-0 transition-all duration-700 delay-200 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 group cursor-pointer">
            <Image
              src="/images/probando-la-sopa.png"
              alt="Probando la Sopa"
              fill
              className="object-cover transition-all duration-500"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
            {/* Accent frame */}
            <div className="absolute -inset-2 border border-[#F25835] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

            <div className="text-center md:text-left">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase mb-2">
                {getReleaseTypeLabel(featured.releaseType)} {featured.year}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-4">
                {featured.title}
              </h3>
              <div className="flex items-center gap-4 justify-center md:justify-start text-white/50 font-mono text-xs">
                <span>{featured.tracks ?? "–"} {featured.tracks === 1 ? "track" : "tracks"}</span>
                <span className="w-1 h-1 rounded-full bg-[#9AD9B0]" />
                <span>{featured.duration ?? "–"}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToAlbum?.(featured.id)}
                className="mt-6 px-6 py-3 border border-white/20 font-mono text-xs tracking-[0.15em] text-white uppercase hover:bg-white hover:text-black transition-all"
              >
                Escuchar Ahora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right panel - Release list */}
      <div className="hidden lg:flex w-96 bg-[#0a0a0a] flex-col pt-24 p-8">
        <div 
          className={`transition-all duration-700 delay-300 ${
            isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase mb-8">
            Todos los Lanzamientos
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {releases.map((release, index) => (
            <button
              key={release.id}
              type="button"
              onClick={() => onNavigateToAlbum?.(release.id)}
              className={`group flex gap-4 p-4 bg-[#1a1a1a] cursor-pointer transition-all duration-500 hover:bg-[#252525] text-left w-full ${
                isActive 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={release.image || "/placeholder.svg"}
                  alt={release.title}
                  fill
                  className="object-cover transition-all"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#F25835] uppercase">
                  {getReleaseTypeLabel(release.releaseType)} {release.year}
                </p>
                <h4 className="font-serif text-lg text-white truncate">
                  {release.title}
                </h4>
                <p className="font-mono text-[10px] text-white/40">
                  {release.tracks ?? "–"} {(release.tracks ?? 0) === 1 ? "track" : "tracks"} – {release.duration ?? "–"}
                </p>
              </div>
              <Play className="w-4 h-4 text-white/30 group-hover:text-[#F25835] self-center transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Decorative line */}
        <div className="mt-auto">
          <div className="h-[1px] w-full bg-gradient-to-r from-[#F25835] via-[#F29422] to-transparent" />
        </div>
      </div>
    </section>
  )
}
