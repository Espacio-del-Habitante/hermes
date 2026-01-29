"use client"

import Image from "next/image"
import { useState } from "react"

interface AlumesSectionProps {
  isActive: boolean
}

const albums = [
  {
    id: 1,
    title: "Guateke",
    artist: "El Colectivo",
    year: "2022",
    image: "/images/guateke-cover.png",
    color: "#F25835",
  },
  {
    id: 2,
    title: "Probando la Sopa",
    artist: "Guateke",
    year: "2023",
    image: "/images/probando-la-sopa.png",
    color: "#F29422",
  },
  {
    id: 3,
    title: "Cubanitos Son",
    artist: "Probando la Sopa",
    year: "2024",
    image: "/images/cubanitos-cover.png",
    color: "#9AD9B0",
  },
]

const tracks = [
  { id: 1, title: "Probando la Sopa", duration: "4:12" },
  { id: 2, title: "Cubanitos", duration: "3:28" },
  { id: 3, title: "Noches en La Habana", duration: "5:01" },
  { id: 4, title: "Suenos Tropicales", duration: "4:33" },
]

export function AlbumesSection({ isActive }: AlumesSectionProps) {
  const [selectedAlbum, setSelectedAlbum] = useState(albums[1])
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  return (
    <section className="relative h-full w-screen flex-shrink-0 flex flex-col md:flex-row overflow-hidden">
      {/* Left - Album artwork display */}
      <div className="flex-shrink-0 md:flex-1 bg-[#0a0a0a] relative flex items-center justify-center pt-8 pb-4 md:pt-12 md:pb-12 px-4 md:p-4 md:p-8 lg:p-12 overflow-hidden">
        {/* Background accent */}
        <div 
          className="absolute inset-0 opacity-5 transition-colors duration-700"
          style={{ backgroundColor: selectedAlbum.color }}
        />

        {/* Album display */}
        <div 
          className={`relative transition-all duration-700 delay-200 ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Vinyl record behind - hidden on mobile */}
          <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] opacity-80">
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-12 rounded-full border border-white/5" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute inset-[45%] rounded-full bg-[#1a1a1a]" />
          </div>

          {/* Album cover - smaller on mobile */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 z-10">
            <Image
              src={selectedAlbum.image || "/placeholder.svg"}
              alt={selectedAlbum.title}
              fill
              className="object-cover transition-all duration-500"
            />
            {/* Frame accent */}
            <div 
              className="absolute -inset-2 md:-inset-3 border-2 transition-colors duration-500"
              style={{ borderColor: selectedAlbum.color }}
            />
          </div>
        </div>

        {/* Album info - repositioned for mobile */}
        <div 
          className={`absolute bottom-4 left-4 md:bottom-12 md:left-12 transition-all duration-700 delay-300 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-1 md:mb-2">
            {selectedAlbum.year} - {selectedAlbum.artist}
          </p>
          <h3 
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic transition-colors duration-500"
            style={{ color: selectedAlbum.color }}
          >
            {selectedAlbum.title}
          </h3>
        </div>
      </div>

      {/* Right - Album selector and tracklist */}
      <div className="flex-1 md:w-[480px] bg-[#1a1a1a] flex flex-col pt-6 pb-4 md:pt-12 md:pb-12 px-4 sm:px-6 md:p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <div 
          className={`mb-4 md:mb-8 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#9AD9B0] uppercase mb-1 md:mb-2">
            Discografia
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic text-white">
            Albumes
          </h2>
        </div>

        {/* Album selector */}
        <div 
          className={`flex gap-3 sm:gap-4 mb-4 md:mb-8 overflow-x-auto scrollbar-hide transition-all duration-700 delay-200 ${
            isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 touch-manipulation ${
                selectedAlbum.id === album.id 
                  ? "ring-2 ring-offset-1 md:ring-offset-2 ring-offset-[#1a1a1a]"
                  : "opacity-50 active:opacity-80 md:hover:opacity-80"
              }`}
              style={{ 
                ringColor: selectedAlbum.id === album.id ? album.color : "transparent" 
              }}
            >
              <Image
                src={album.image || "/placeholder.svg"}
                alt={album.title}
                fill
                className="object-cover transition-all"
              />
            </button>
          ))}
        </div>

        {/* Tracklist */}
        <div 
          className={`flex-1 min-h-0 transition-all duration-700 delay-300 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-3 md:mb-4">
            Tracklist
          </p>
          <div className="space-y-1 md:space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-2.5 sm:p-3 md:p-4 cursor-pointer transition-all touch-manipulation ${
                  hoveredTrack === track.id 
                    ? "bg-[#252525]" 
                    : "bg-transparent active:bg-[#252525]"
                }`}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                onTouchStart={() => setHoveredTrack(track.id)}
                onTouchEnd={() => setHoveredTrack(null)}
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
                  <span 
                    className={`font-mono text-xs sm:text-sm transition-colors flex-shrink-0 ${
                      hoveredTrack === track.id 
                        ? "text-[#F25835]" 
                        : "text-white/30"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span 
                    className={`font-serif text-sm sm:text-base md:text-lg transition-colors truncate ${
                      hoveredTrack === track.id 
                        ? "text-white" 
                        : "text-white/70"
                    }`}
                  >
                    {track.title}
                  </span>
                </div>
                <span className="font-mono text-xs sm:text-sm text-white/30 flex-shrink-0 ml-2">
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar decoration */}
        <div className="mt-4 md:mt-auto pt-4 md:pt-8">
          <div className="flex items-center justify-between mb-1.5 md:mb-2">
            <span className="font-mono text-[10px] sm:text-xs text-white/30">1:23</span>
            <span className="font-mono text-[10px] sm:text-xs text-white/30">3:28</span>
          </div>
          <div className="h-[2px] bg-[#252525] rounded-full overflow-hidden">
            <div 
              className="h-full w-[40%] rounded-full transition-all duration-300"
              style={{ backgroundColor: selectedAlbum.color }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
