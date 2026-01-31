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
  const listScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isActive) return
    scrollRef.current?.scrollTo(0, 0)
    listScrollRef.current?.scrollTo(0, 0)
  }, [isActive])

  return (
    <section className="relative h-full w-screen flex-shrink-0 flex">
      {/* Panel principal: en móvil = hero arriba + lista con scroll abajo; en desktop = todo con scroll */}
      <div className="flex-1 bg-[#1a1a1a] flex flex-col min-h-0">
        {/* Móvil: sección principal fija arriba (enfoque), sin scroll */}
        <div className="lg:hidden flex-shrink-0 flex flex-col px-4 sm:px-6 pt-6 sm:pt-8 pb-4 border-b border-white/10">
          <div
            className={`transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-[#F29422] uppercase mb-1">
              Ultimo Lanzamiento
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl italic text-white mb-4 sm:mb-6">
              Lanzamientos
            </h2>
          </div>
          <div
            className={`flex flex-col sm:flex-row gap-5 sm:gap-6 items-center transition-all duration-700 delay-200 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0 group cursor-pointer overflow-hidden rounded-lg">
              <Image
                src={featured.image || "/images/probando-la-sopa.png"}
                alt={featured.title}
                fill
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-active:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <div className="text-center sm:text-left flex-shrink-0 min-w-0">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-1">
                {getReleaseTypeLabel(featured.releaseType)} {featured.year}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white italic mb-2 sm:mb-3">
                {featured.title}
              </h3>
              <div className="flex items-center gap-3 justify-center sm:justify-start text-white/50 font-mono text-xs mb-3 sm:mb-4">
                <span>{featured.tracks ?? "–"} {featured.tracks === 1 ? "track" : "tracks"}</span>
                <span className="w-1 h-1 rounded-full bg-[#9AD9B0]" />
                <span>{featured.duration ?? "–"}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToAlbum?.(featured.id)}
                className="px-5 py-2.5 border border-white/20 font-mono text-xs tracking-[0.15em] text-white uppercase active:bg-white active:text-black transition-all"
              >
                Escuchar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Móvil: solo esta lista hace scroll */}
        <div className="lg:hidden flex-1 min-h-0 flex flex-col pr-16 sm:pr-20">
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-[#1a1a1a]">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase">
              Todos los Lanzamientos
            </p>
          </div>
          <div
            ref={listScrollRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 pb-24 sm:pb-12"
          >
            <div className="flex flex-col gap-2.5 pb-4 sm:pb-0">
              {releases.map((release, index) => (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => onNavigateToAlbum?.(release.id)}
                  className={`group flex gap-3 p-3 bg-[#0a0a0a] rounded-lg text-left w-full active:bg-[#252525] transition-colors ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${100 + index * 40}ms`, transitionProperty: "opacity" }}
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={release.image || "/placeholder.svg"}
                      alt={release.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.15em] text-[#F25835] uppercase">
                      {getReleaseTypeLabel(release.releaseType)} {release.year}
                    </p>
                    <h4 className="font-serif text-sm text-white line-clamp-2">
                      {release.title}
                    </h4>
                    <p className="font-mono text-[10px] text-white/40">
                      {release.tracks ?? "–"} {(release.tracks ?? 0) === 1 ? "track" : "tracks"} · {release.duration ?? "–"}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-white/30 group-active:text-[#F25835] self-center flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: layout original (todo en un scroll) */}
        <div ref={scrollRef} className="hidden lg:flex flex-1 min-h-0 flex-col pt-24 px-4 sm:px-6 md:px-12 overflow-y-auto overflow-x-hidden pb-12">
          <div
            className={`flex-shrink-0 transition-all duration-700 delay-100 ${
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
          <div
            className={`flex-1 min-h-0 flex flex-col md:flex-row gap-8 items-center justify-center pb-4 transition-all duration-700 delay-200 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative w-64 md:w-80 h-64 md:h-80 flex-shrink-0 group cursor-pointer overflow-hidden rounded">
              <Image
                src="/images/probando-la-sopa.png"
                alt="Probando la Sopa"
                fill
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute -inset-2 border border-[#F25835] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded" />
            </div>
            <div className="text-center md:text-left flex-shrink-0">
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
        </div>
      </div>

      {/* Right panel - Release list (desktop) */}
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
