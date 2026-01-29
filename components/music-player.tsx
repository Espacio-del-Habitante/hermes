"use client"

import { useState, useRef, useEffect } from "react"
import { Headphones, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ExternalLink, Music } from "lucide-react"

// Multiple YouTube playlists from the channel
const playlists = [
  {
    id: "PLUBCMmrhkcuNEAsn-nkW4Pm5-EgDpil65",
    name: "Guateke - Alma de Calle",
    artist: "Guateke",
    tracks: [
      { id: 1, title: "Alma de Calle", videoId: "_Voo_NMWqEo" },
      { id: 2, title: "Probando la Sopa", videoId: "HjCLLrVN5B0" },
      { id: 3, title: "Cubanitos", videoId: "yPFMlf4cN4I" },
      { id: 4, title: "Noches Tropicales", videoId: "kB8kYYm7kI8" },
    ]
  },
  {
    id: "PLUBCMmrhkcuNPQvIr1gHhgZdllm8L2qUw",
    name: "Playlist 2",
    artist: "El Rancho de Kiro",
    tracks: [
      { id: 1, title: "Track 1", videoId: "N5b0wHb6YJo" },
      // Add more tracks from this playlist here
      // You can find video IDs from the YouTube playlist page
    ]
  },
  {
    id: "PLUBCMmrhkcuMsHYaByUXeGqKIneanZcrN",
    name: "Playlist 3",
    artist: "El Rancho de Kiro",
    tracks: [
      { id: 1, title: "Track 1", videoId: "sSsuw8EoLms" },
      // Add more tracks from this playlist here
    ]
  },
  {
    id: "PLUBCMmrhkcuMBD00iDM0qScC3VV2PKCKe",
    name: "Playlist 4",
    artist: "El Rancho de Kiro",
    tracks: [
      { id: 1, title: "Track 1", videoId: "wDKX9A3Ekj8" },
      // Add more tracks from this playlist here
    ]
  },
]

// Function to get a random playlist
const getRandomPlaylist = () => {
  const randomIndex = Math.floor(Math.random() * playlists.length)
  return playlists[randomIndex]
}

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true) // Start playing automatically
  const [currentPlaylist, setCurrentPlaylist] = useState(() => getRandomPlaylist())
  const [currentTrack, setCurrentTrack] = useState(() => {
    const playlist = getRandomPlaylist()
    return playlist.tracks[0]
  })
  const [isMuted, setIsMuted] = useState(false)
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null)

  const youtubeChannelUrl = "https://www.youtube.com/@elranchodekiro"
  const youtubePlaylistUrl = `https://www.youtube.com/watch?v=${currentTrack.videoId}&list=${currentPlaylist.id}`

  // Auto-play on mount
  useEffect(() => {
    setIsPlaying(true)
  }, [])

  // Update hidden iframe when track or playlist changes
  useEffect(() => {
    if (hiddenIframeRef.current) {
      const playlistIds = currentPlaylist.tracks.map(t => t.videoId).join(',')
      hiddenIframeRef.current.src = `https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&list=${currentPlaylist.id}&loop=1&playlist=${playlistIds}&enablejsapi=1&controls=0&modestbranding=1&rel=0`
    }
  }, [currentTrack, currentPlaylist, isPlaying, isMuted])

  const handlePlaylistChange = (playlist: typeof playlists[0]) => {
    setCurrentPlaylist(playlist)
    setCurrentTrack(playlist.tracks[0])
    setIsPlaying(true)
    setShowPlaylistSelector(false)
  }

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying
    setIsPlaying(newPlayingState)
    
    // Control hidden iframe playback
    if (hiddenIframeRef.current && hiddenIframeRef.current.contentWindow) {
      hiddenIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: newPlayingState ? 'playVideo' : 'pauseVideo',
          args: []
        }),
        '*'
      )
    }
  }

  const handleNextTrack = () => {
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length
    setCurrentTrack(currentPlaylist.tracks[nextIndex])
    setIsPlaying(true)
  }

  const handlePrevTrack = () => {
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1
    setCurrentTrack(currentPlaylist.tracks[prevIndex])
    setIsPlaying(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <>
      {/* Hidden iframe for background playback - starts automatically */}
      <iframe
        ref={hiddenIframeRef}
        src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&list=${currentPlaylist.id}&loop=1&playlist=${currentPlaylist.tracks.map(t => t.videoId).join(',')}&enablejsapi=1&controls=0&modestbranding=1&rel=0`}
        title="YouTube background player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="fixed opacity-0 pointer-events-none"
        style={{ 
          width: '1px', 
          height: '1px', 
          left: '-9999px', 
          top: '-9999px',
          border: 'none'
        }}
      />

      {/* Minimized player bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isExpanded ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left: Track info */}
              <button 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 sm:gap-3 group flex-1 min-w-0 touch-manipulation"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-active:bg-[#F25835] md:group-hover:bg-[#F25835] transition-colors">
                  <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/50 group-active:text-white md:group-hover:text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.1em] text-white/40 uppercase">
                    Playing
                  </p>
                  <p className="font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] text-[#9AD9B0] uppercase truncate">
                    {`"${currentTrack.title}"`}
                  </p>
                </div>
              </button>

              {/* Center: Controls (hidden on very small mobile) */}
              <div className="hidden min-[360px]:flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <button 
                  onClick={handlePrevTrack}
                  className="p-1.5 sm:p-2 text-white/40 active:text-white md:hover:text-white transition-colors touch-manipulation"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center active:bg-[#F25835] md:hover:bg-[#F25835] transition-colors group touch-manipulation"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-[#0a0a0a] group-active:text-white md:group-hover:text-white" />
                  ) : (
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-[#0a0a0a] group-active:text-white md:group-hover:text-white ml-0.5" />
                  )}
                </button>
                <button 
                  onClick={handleNextTrack}
                  className="p-1.5 sm:p-2 text-white/40 active:text-white md:hover:text-white transition-colors touch-manipulation"
                  aria-label="Next track"
                >
                  <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Right: Volume and expand */}
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
                <button 
                  onClick={toggleMute}
                  className="hidden sm:flex p-1.5 sm:p-2 text-white/40 active:text-white md:hover:text-white transition-colors touch-manipulation"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex p-1.5 sm:p-2 text-white/40 active:text-[#F25835] md:hover:text-[#F25835] transition-colors touch-manipulation"
                  aria-label="Open YouTube channel"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 active:text-white md:hover:text-white uppercase transition-colors touch-manipulation"
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

          {/* Playlist Selector */}
          {showPlaylistSelector && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase mb-4 text-center">
                Seleccionar Playlist
              </p>
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistChange(playlist)}
                    className={`w-full flex items-center gap-3 p-3 transition-all ${
                      currentPlaylist.id === playlist.id 
                        ? "bg-[#F25835]/20 border border-[#F25835]/50" 
                        : "bg-transparent hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Music className={`w-4 h-4 ${currentPlaylist.id === playlist.id ? 'text-[#F25835]' : 'text-white/40'}`} />
                    <div className="flex-1 text-left">
                      <p className={`font-serif text-sm ${currentPlaylist.id === playlist.id ? 'text-white' : 'text-white/70'}`}>
                        {playlist.name}
                      </p>
                      <p className="font-mono text-[10px] text-white/40 uppercase">
                        {playlist.tracks.length} tracks
                      </p>
                    </div>
                    {currentPlaylist.id === playlist.id && (
                      <span className="w-2 h-2 rounded-full bg-[#F25835]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* YouTube embed - show when expanded */}
          <div className="w-full max-w-3xl aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden mb-6 sm:mb-8">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&list=${currentPlaylist.id}&loop=1&playlist=${currentPlaylist.tracks.map(t => t.videoId).join(',')}&enablejsapi=1`}
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
            <div className="flex items-center justify-center gap-3 mt-2">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase">
                {currentPlaylist.artist}
              </p>
              <button
                onClick={() => setShowPlaylistSelector(!showPlaylistSelector)}
                className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#F25835] hover:text-white uppercase transition-colors"
              >
                • Cambiar playlist
              </button>
            </div>
          </div>

          {/* Playlist */}
          <div className="w-full max-w-md">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/40 uppercase mb-4 text-center">
              Playlist
            </p>
            <div className="space-y-2">
              {currentPlaylist.tracks.map((track, index) => (
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
