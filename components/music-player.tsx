"use client"

import { useState, useRef } from "react"
import { Headphones, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ExternalLink } from "lucide-react"

// YouTube playlist tracks
const playlist = [
  { id: 1, title: "Alma de Calle", videoId: "_Voo_NMWqEo" },
  { id: 2, title: "Probando la Sopa", videoId: "HjCLLrVN5B0" },
  { id: 3, title: "Cubanitos", videoId: "yPFMlf4cN4I" },
  { id: 4, title: "Noches Tropicales", videoId: "kB8kYYm7kI8" },
]

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(playlist[0])
  const [isMuted, setIsMuted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const youtubePlaylistUrl = "https://www.youtube.com/watch?v=_Voo_NMWqEo&list=PLUBCMmrhkcuNEAsn-nkW4Pm5-EgDpil65"
  const youtubeChannelUrl = "https://www.youtube.com/@elranchodekiro"

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextTrack = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentTrack(playlist[nextIndex])
    setIsPlaying(true)
  }

  const handlePrevTrack = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentTrack(playlist[prevIndex])
    setIsPlaying(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <>
      {/* Minimized player bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isExpanded ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Track info */}
              <button 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-3 group flex-1 min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F25835] transition-colors">
                  <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 group-hover:text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.1em] text-white/40 uppercase">
                    Playing
                  </p>
                  <p className="font-mono text-[10px] sm:text-xs tracking-[0.1em] text-[#9AD9B0] uppercase truncate">
                    {`"${currentTrack.title}"`}
                  </p>
                </div>
              </button>

              {/* Center: Controls (hidden on small mobile) */}
              <div className="hidden xs:flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={handlePrevTrack}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#F25835] transition-colors group"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 sm:w-4 sm:h-4 text-[#0a0a0a] group-hover:text-white" />
                  ) : (
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-[#0a0a0a] group-hover:text-white ml-0.5" />
                  )}
                </button>
                <button 
                  onClick={handleNextTrack}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Volume and expand */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  onClick={toggleMute}
                  className="hidden sm:flex p-2 text-white/40 hover:text-white transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex p-2 text-white/40 hover:text-[#F25835] transition-colors"
                  aria-label="Open YouTube channel"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-white/40 hover:text-white uppercase transition-colors"
                >
                  Expandir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded player modal */}
      <div 
        className={`fixed inset-0 z-[110] transition-all duration-500 ${
          isExpanded 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#0a0a0a]/98 backdrop-blur-lg"
          onClick={() => setIsExpanded(false)}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-8">
          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 sm:top-8 right-4 sm:right-8 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 hover:text-white uppercase transition-colors"
          >
            Cerrar
          </button>

          {/* YouTube embed - show when expanded and playing */}
          <div className="w-full max-w-3xl aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden mb-6 sm:mb-8">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&list=PLUBCMmrhkcuNEAsn-nkW4Pm5-EgDpil65`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Current track info */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#F25835] uppercase mb-2">
              Reproduciendo
            </p>
            <h3 className="font-serif text-2xl sm:text-4xl text-white italic">
              {currentTrack.title}
            </h3>
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mt-2">
              Guateke
            </p>
          </div>

          {/* Playlist */}
          <div className="w-full max-w-md">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-4 text-center">
              Playlist
            </p>
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(track)
                    setIsPlaying(true)
                  }}
                  className={`w-full flex items-center gap-4 p-3 sm:p-4 transition-all ${
                    currentTrack.id === track.id 
                      ? "bg-[#1a1a1a]" 
                      : "bg-transparent hover:bg-[#1a1a1a]/50"
                  }`}
                >
                  <span 
                    className={`font-mono text-xs sm:text-sm ${
                      currentTrack.id === track.id 
                        ? "text-[#F25835]" 
                        : "text-white/30"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span 
                    className={`font-serif text-base sm:text-lg ${
                      currentTrack.id === track.id 
                        ? "text-white" 
                        : "text-white/50"
                    }`}
                  >
                    {track.title}
                  </span>
                  {currentTrack.id === track.id && isPlaying && (
                    <span className="ml-auto flex items-center gap-1">
                      <span className="w-1 h-3 bg-[#9AD9B0] animate-pulse" />
                      <span className="w-1 h-4 bg-[#9AD9B0] animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-[#9AD9B0] animate-pulse delay-150" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Link to full playlist */}
          <a
            href={youtubePlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 sm:mt-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.15em] text-white/40 hover:text-[#F25835] uppercase transition-colors"
          >
            <span>Ver playlist completa en YouTube</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </>
  )
}
