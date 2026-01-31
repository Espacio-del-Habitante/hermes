"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"
import { Play, ChevronRight } from "lucide-react"
import { getReleasesByDate, getReleaseTypeLabel, ALBUMS } from "@/lib/albums"

interface LanzamientosSectionProps {
  isActive: boolean
  /** Ir a la sección Álbumes con este álbum seleccionado. */
  onNavigateToAlbum?: (albumId: number) => void
  /** Ir a la sección Álbumes (sin álbum específico). */
  onNavigateToAlbumes?: () => void
}

const releases = getReleasesByDate()
const featured = releases[0]
const previousReleases = releases.slice(1)

export function LanzamientosSection({ isActive, onNavigateToAlbum, onNavigateToAlbumes }: LanzamientosSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isActive) return
    scrollRef.current?.scrollTo(0, 0)
  }, [isActive])

  return (
    <section className="relative h-full w-screen flex-shrink-0 flex overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1a1a] via-[#40231b] to-[#000000] opacity-100" />
      {/* Dotted pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-24 sm:pb-12 md:pb-12"
      >
        {/* Mobile-first layout */}
        <div className="flex flex-col min-h-full">
          {/* Header section */}
          <div
            className={`flex-shrink-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-8 pb-6 transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-white/60 uppercase mb-2 sm:mb-3">
              Ultimo Lanzamiento
            </p>
         
          </div>

          {/* Featured release - Mobile first design */}
          <div
            className={`flex-shrink-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-12 md:pb-16 transition-all duration-700 delay-200 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:gap-16 lg:gap-20 xl:gap-24 max-w-7xl mx-auto">
              {/* Left: Album cover with vinyl effect */}
              <div className="flex-shrink-0 flex justify-center md:justify-start mb-8 md:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:w-80 md:max-w-none lg:w-96 xl:w-[28rem] aspect-square group cursor-pointer">
                  {/* Vinyl record behind - Desktop only, more visible */}
                  <div className="hidden md:block absolute -right-8 lg:-right-12 xl:-right-16 top-1/2 -translate-y-1/2 w-80 h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000] opacity-95 z-0 shadow-2xl">
                    {/* Vinyl grooves - more visible */}
                    <div className="absolute inset-4 rounded-full border border-white/20" />
                    <div className="absolute inset-8 rounded-full border border-white/15" />
                    <div className="absolute inset-12 rounded-full border border-white/12" />
                    <div className="absolute inset-16 rounded-full border border-white/15" />
                    <div className="absolute inset-20 rounded-full border border-white/12" />
                    <div className="absolute inset-24 rounded-full border border-white/15" />
                    <div className="absolute inset-28 rounded-full border border-white/12" />
                    <div className="absolute inset-32 rounded-full border border-white/15" />
                    {/* Center hole - more prominent */}
                    <div className="absolute inset-[42%] rounded-full bg-[#000000] border-2 border-white/30 shadow-inner" />
                    {/* Inner ring */}
                    <div className="absolute inset-[46%] rounded-full bg-[#1a1a1a] border border-white/10" />
                  </div>

                  {/* Album cover - on top of vinyl, partially overlapping */}
                  <div className="relative w-full aspect-square z-10 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-xl">
                    <Image
                      src={featured.image || "/images/probando-la-sopa.png"}
                      alt={featured.title}
                      fill
                      className="object-cover"
                    />
                    {/* Frame accent */}
                    <div 
                      className="absolute -inset-2 border-2 transition-colors duration-500"
                      style={{ 
                        borderColor: ALBUMS.find(a => a.id === featured.id)?.color || "#F25835" 
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Album info */}
              <div className="w-full md:flex-1 text-center md:text-left">
                <p className="font-mono text-xs sm:text-sm md:text-base tracking-[0.2em] text-white/60 uppercase mb-3 sm:mb-4 md:mb-5">
                  {getReleaseTypeLabel(featured.releaseType).toUpperCase()} {featured.year}
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white italic mb-6 sm:mb-8 md:mb-10 font-bold leading-tight">
                  {featured.title}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 text-white/70 font-mono text-xs sm:text-sm md:text-base mb-8 sm:mb-10 md:mb-12">
                  <span>{featured.tracks ?? "–"} {(featured.tracks ?? 0) === 1 ? "TRACK" : "TRACKS"}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{featured.duration ?? "–"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToAlbum?.(featured.id)}
                  className="group w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-[#F25835] hover:bg-[#F29422] font-mono text-xs sm:text-sm md:text-base tracking-[0.15em] text-white uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                  Escuchar Ahora
                </button>
              </div>
            </div>
          </div>

          {/* Previous releases section - Horizontal scroll on mobile */}
          {previousReleases.length > 0 && (
            <div
              className={`flex-shrink-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-12 md:pb-16 transition-all duration-700 delay-300 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="max-w-7xl mx-auto">
                <button
                  type="button"
                  onClick={() => onNavigateToAlbumes?.()}
                  className="group flex items-center justify-between mb-4 sm:mb-6 md:mb-8 hover:opacity-80 transition-opacity"
                >
                  <h3 className="font-mono text-sm sm:text-base md:text-lg tracking-[0.2em] text-white uppercase">
                    Anteriores
                  </h3>
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>

                {/* Horizontal scroll container for mobile, grid for desktop */}
                <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 sm:mx-0 sm:overflow-x-visible">
                  <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0 min-w-max sm:min-w-0">
                    {previousReleases.map((release, index) => (
                      <button
                        key={release.id}
                        type="button"
                        onClick={() => onNavigateToAlbum?.(release.id)}
                        className="group relative flex-shrink-0 w-64 sm:w-auto sm:flex-col bg-transparent rounded-lg overflow-visible transition-all duration-300 active:scale-[0.98]"
                      >
                        {/* Mobile: Simple card layout */}
                        <div className="sm:hidden flex gap-3  border border-white/5 hover:border-white/20 rounded-lg p-3 transition-all duration-300">
                          {/* Album thumbnail */}
                          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded bg-[#1a1a1a]">
                            <Image
                              src={release.image || "/placeholder.svg"}
                              alt={release.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          {/* Album info */}
                          <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                            <p className="font-mono text-[10px] tracking-[0.15em] text-[#F25835] uppercase mb-1 font-semibold">
                              {getReleaseTypeLabel(release.releaseType).toUpperCase()} {release.year}
                            </p>
                            <h4 className="font-serif text-sm text-white font-bold line-clamp-1 mb-0.5">
                              {release.title}
                            </h4>
                            <p className="font-mono text-[10px] text-white/60">
                              {release.tracks ?? "–"} {(release.tracks ?? 0) === 1 ? "TRACK" : "TRACKS"} · {release.duration ?? "–"}
                            </p>
                          </div>
                        </div>

                        {/* Desktop: Simple card layout */}
                        <div className="hidden sm:flex flex-col items-start relative w-full  rounded-lg p-5 md:p-6 ">
                          {/* Album cover */}
                          <div className="relative w-full aspect-square max-w-[200px] md:max-w-[220px] lg:max-w-[240px] z-10 group-hover:scale-[1.02] transition-transform duration-500 mb-5 md:mb-6">
                            {/* Shadow behind cover - subtle */}
                            <div className="absolute -inset-3  rounded-lg blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                            <div className="relative w-full aspect-square rounded-sm overflow-hidden  shadow-accent-coral shadow-2xl/20 border-12  border-black/20  group-hover:border-white/15 group-hover:bg-[#252525] transition-all duration-300 ">
                              <Image
                                src={release.image || "/placeholder.svg"}
                                alt={release.title}
                                fill
                                className="object-cover"
                              />
                              {/* Play overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                  <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Album info below */}
                          <div className="text-left w-full">
                            <p className="font-mono text-[10px] md:text-xs tracking-[0.15em] text-[#F25835] uppercase mb-2.5 md:mb-3 font-semibold">
                              {getReleaseTypeLabel(release.releaseType).toUpperCase()} {release.year}
                            </p>
                            <h4 className="font-serif text-sm md:text-base lg:text-lg text-white font-bold line-clamp-2 mb-2.5 md:mb-3 group-hover:text-[#F29422] transition-colors leading-tight">
                              {release.title}
                            </h4>
                            <p className="font-mono text-[10px] md:text-xs text-white/60 group-hover:text-white/80 transition-colors">
                              {release.tracks ?? "–"} {(release.tracks ?? 0) === 1 ? "TRACK" : "TRACKS"} · {release.duration ?? "–"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
