"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { playlists } from "@/components/music-player"
import { ALBUMS, getArtistIdsFromAlbum, type ArtistId } from "@/lib/albums"
import { ARTISTS } from "@/lib/supabase-urls"
import { ArrowRight } from "lucide-react"

interface AlumesSectionProps {
  isActive: boolean
  /** Si viene de la sala de un artista, preseleccionar este álbum. */
  initialAlbumId?: number | null
  /** Llamar cuando ya se aplicó el initialAlbumId (para limpiar el estado en el padre). */
  onViewedInitialAlbum?: () => void
  /** Ir a la sala del artista (conectar con la sección Artistas). */
  onNavigateToArtist?: (artistId: ArtistId) => void
}

const albums = ALBUMS

export function AlbumesSection({ isActive, initialAlbumId, onViewedInitialAlbum, onNavigateToArtist }: AlumesSectionProps) {
  const [selectedAlbum, setSelectedAlbum] = useState(albums[1])

  // Aplicar álbum preseleccionado al llegar desde la sala de un artista
  useEffect(() => {
    if (initialAlbumId == null || !isActive) return
    const album = albums.find((a) => a.id === initialAlbumId)
    if (album) {
      setSelectedAlbum(album)
      onViewedInitialAlbum?.()
    }
  }, [isActive, initialAlbumId, onViewedInitialAlbum])
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)
  const [currentPlaylist, setCurrentPlaylist] = useState<typeof playlists[0] | null>(null)
  const [currentTrack, setCurrentTrack] = useState<typeof playlists[0]['tracks'][0] | null>(null)

  // Get current playlist and track from music player
  useEffect(() => {
    const updateCurrentTrack = () => {
      if (typeof window !== 'undefined' && (window as any).getCurrentPlaylist && (window as any).getCurrentTrack) {
        const playlist = (window as any).getCurrentPlaylist()
        const track = (window as any).getCurrentTrack()
        if (playlist) setCurrentPlaylist(playlist)
        if (track) setCurrentTrack(track)
      }
    }
    
    updateCurrentTrack()
    const interval = setInterval(updateCurrentTrack, 500)
    return () => clearInterval(interval)
  }, [])

  // Get tracks for selected album
  const getTracksForAlbum = () => {
    const playlist = playlists.find(p => p.name === selectedAlbum.playlistName)
    return playlist?.tracks || []
  }

  const handleTrackClick = (track: typeof playlists[0]['tracks'][0]) => {
    if (typeof window !== 'undefined' && (window as any).playTrack) {
      (window as any).playTrack(selectedAlbum.playlistName, track.title)
    }
  }

  const handleAlbumClick = (album: typeof albums[0]) => {
    setSelectedAlbum(album)
    // Start playing the playlist when album is selected
    if (typeof window !== 'undefined' && (window as any).playPlaylist) {
      (window as any).playPlaylist(album.playlistName)
    }
  }

  const artistIdsInAlbum = getArtistIdsFromAlbum(selectedAlbum)

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
      <div className="flex-1 md:w-[480px] min-h-0 bg-[#1a1a1a] flex flex-col pt-6 pb-4 md:pt-12 md:pb-12 px-4 sm:px-6 md:p-8 lg:p-12">
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

        {/* Artistas en este álbum */}
        {artistIdsInAlbum.length > 0 && onNavigateToArtist && (
          <div 
            className={`mb-4 md:mb-6 transition-all duration-700 delay-150 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-2 md:mb-3">
              Artistas en este álbum
            </p>
            <div className="flex flex-wrap gap-2">
              {artistIdsInAlbum.map((id) => {
                const artist = ARTISTS[id]
                if (!artist) return null
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onNavigateToArtist(id)}
                    className="group flex items-center gap-1.5 px-3 py-2 rounded border border-white/20 hover:border-[#F25835] hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="font-serif text-sm md:text-base text-white/80 group-hover:text-[#F25835] transition-colors">
                      {artist.name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-[#F25835] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Album selector */}
        <div 
          className={`flex gap-3 sm:gap-4 mb-4 md:mb-8 overflow-x-auto scrollbar-hide transition-all duration-700 delay-200 ${
            isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 touch-manipulation ${
                selectedAlbum.id === album.id 
                  ? "ring-2 ring-offset-1 md:ring-offset-2 ring-offset-[#1a1a1a]"
                  : "opacity-50 active:opacity-80 md:hover:opacity-80"
              }`}
              style={
                selectedAlbum.id === album.id
                  ? ({ ["--tw-ring-color" as string]: album.color } as React.CSSProperties)
                  : undefined
              }
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

        {/* Tracklist - área con scroll para ver todas las pistas */}
        <div 
          className={`flex-1 min-h-0 flex flex-col transition-all duration-700 delay-300 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-3 md:mb-4 shrink-0">
            Tracklist
          </p>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-1 md:space-y-2 pr-1">
            {getTracksForAlbum().map((track, index) => {
              const isCurrentTrack = currentPlaylist?.name === selectedAlbum.playlistName && 
                                     currentTrack?.id === track.id
              const isHovered = hoveredTrack === track.id
              
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 md:p-4 cursor-pointer transition-all touch-manipulation ${
                    isHovered || isCurrentTrack
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
                        isHovered || isCurrentTrack
                          ? "text-[#F25835]" 
                          : "text-white/30"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span 
                      className={`font-serif text-sm sm:text-base md:text-lg transition-colors truncate text-left ${
                        isHovered || isCurrentTrack
                          ? "text-white" 
                          : "text-white/70"
                      }`}
                    >
                      {track.title}
                    </span>
                  </div>
                  {isCurrentTrack && (
                    <span className="ml-auto flex items-center gap-1 flex-shrink-0">
                      <span className="w-1 h-3 bg-[#9AD9B0] animate-pulse" />
                      <span className="w-1 h-4 bg-[#9AD9B0] animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-[#9AD9B0] animate-pulse delay-150" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
