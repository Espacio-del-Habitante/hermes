"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Headphones,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ExternalLink,
  Music,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          playerVars?: {
            autoplay?: number;
            mute?: number;
            list?: string;
            loop?: number;
            playlist?: string;
            enablejsapi?: number;
            controls?: number;
            modestbranding?: number;
            rel?: number;
            origin?: string;
          };
          events?: {
            onReady?: (event: { target: YT.Player }) => void;
            onStateChange?: (event: { data: number; target: YT.Player }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YT.Player;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
  
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
      getVolume(): number;
      setVolume(volume: number): void;
      isMuted(): boolean;
      mute(): void;
      unMute(): void;
      loadVideoById(videoId: string | { videoId: string; startSeconds?: number }, startSeconds?: number): void;
      cueVideoById(videoId: string | { videoId: string; startSeconds?: number }, startSeconds?: number): void;
      destroy(): void;
    }
  }
}

// Multiple YouTube playlists from the channel
const playlists = [
  {
    id: "PLUBCMmrhkcuNEAsn-nkW4Pm5-EgDpil65",
    name: "Guateke",
    artist: "Grioth & Kiro",
    tracks: [
      { id: 1, title: "Loco", videoId: "_Voo_NMWqEo" },
      { id: 2, title: "Los lebron", videoId: "ymBDuzGKYJc" },
      { id: 3, title: "Funkali", videoId: "fRUh2MW74H" },
      { id: 4, title: "Locha", videoId: "2M_ArufoGYs" },
      { id: 5, title: "Funkali", videoId: "fRUh2MW74H" },
      { id: 6, title: "JUGGERFLOWS", videoId: "CZqCfrgdrds" },
      { id: 7, title: "La Sucur", videoId: "eZxtg4ZBsG0" },
      { id: 8, title: "E-Y-O", videoId: "Nip7axa9Uf8" },
      { id: 9, title: "Vapor", videoId: "HN99vz9Sr3s" },
    ],
  },
  {
    id: "PLUBCMmrhkcuNPQvIr1gHhgZdllm8L2qUw",
    name: "Probando la Sopa",
    artist: "Grioth",
    tracks: [
      { id: 1, title: "INTRO", videoId: "N5b0wHb6YJo" },
      { id: 2, title: "CAFÉ TINTO", videoId: "u7QEZb0PuRw" },
      { id: 3, title: "CORRIENTAZO", videoId: "-rr-R7yG2Rg" },
      { id: 4, title: "CRUCE CON SUMERCÉ", videoId: "WqnFLPG9ysI" },
      { id: 5, title: "LLAVE´S", videoId: "o9GdrmXGcH0" },
      { id: 6, title: "S.U.R.F.E.A.R", videoId: "AhPA_i7mh6E" },
      { id: 7, title: "AGUAPANELA", videoId: "d9RSIwFa-Pw" },
      { id: 8, title: "SANTO ALABAO", videoId: "Po7UI8hEgEo" },
      { id: 9, title: "PROBANDO LA SOPA", videoId: "KrqbZpVLNAs" },
      { id: 10, title: "CAZA FANTASMAS ", videoId: "8ncLO3KQIx4" },
      { id: 11, title: "LA CUENTA ", videoId: "LGeTRwSU7e8" },
      { id: 12, title: "OUTRO", videoId: "a_-AKGWlLPI" },
    ],
  },
  {
    id: "PLUBCMmrhkcuMsHYaByUXeGqKIneanZcrN",
    name: "KITDROGA-EP",
    artist: "Kiro",
    tracks: [
      { id: 1, title: "Intro", videoId: "sSsuw8EoLms" },
      { id: 2, title: "Freestyle del Alquimista", videoId: "aeDhayAs4nY" },
      { id: 3, title: "Un Chirriroce", videoId: "dCNKoPP8kHw" },
      { id: 4, title: "El Rapero Solitario", videoId: "mqKZd3kvkVw" },
      { id: 5, title: "Filme Gris", videoId: "lVnyBBF5EVM" },
      { id: 6, title: "Sobredosis", videoId: "BC7ZrdvmIlo" },
      { id: 7, title: "Outro", videoId: "O4I0brx0Tfk" },

      // Add more tracks from this playlist here
    ],
  },
  {
    id: "PLUBCMmrhkcuMBD00iDM0qScC3VV2PKCKe",
    name: "Con mas ganas de hacer rap que de trabajar",
    artist: "Grioth & Kiro",
    tracks: [
      { id: 1, title: "Intro", videoId: "wDKX9A3Ekj8" },
      { id: 2, title: "Bachille-Rato", videoId: "reuE2huvFfg" },
      { id: 3, title: "Coja Oficio", videoId: "R7ANp9Tcnkc" },
      { id: 4, title: "Analgésicos Nostálgicos", videoId: "To-bt0OTMQAA" },
      { id: 5, title: "Ouyis de la Galemba", videoId: "1pZBAKchKbE" },
      { id: 6, title: "La Vida es un Visaje", videoId: "Hg-xSrKPxhY" },
      { id: 7, title: "Tengo", videoId: "ZL6-bItEnj4" },
      { id: 8, title: "Interludio Interestelar", videoId: "6EpDlna2o0Y" },
      { id: 9, title: "Outro AKA La Re Buena", videoId: "jZHnNoV4lVQ" },

      // Add more tracks from this playlist here
    ],
  },
];

// Function to get a random playlist
const getRandomPlaylist = () => {
  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex];
};

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused, will play on first interaction
  // Initialize with first playlist to avoid hydration mismatch
  const [currentPlaylist, setCurrentPlaylist] = useState(() => playlists[0]);
  const [currentTrack, setCurrentTrack] = useState(
    () => playlists[0].tracks[0],
  );
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50); // Volume from 0 to 100
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [hiddenPlayerReady, setHiddenPlayerReady] = useState(false);
  const [visiblePlayerReady, setVisiblePlayerReady] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const visiblePlayerRef = useRef<YT.Player | null>(null);
  const hiddenPlayerRef = useRef<YT.Player | null>(null);
  const visiblePlayerContainerRef = useRef<HTMLDivElement>(null);
  const hiddenPlayerContainerRef = useRef<HTMLDivElement>(null);
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const lastHiddenVideoId = useRef<string>("");
  const lastVisibleVideoId = useRef<string>("");

  const youtubeChannelUrl = "https://www.youtube.com/@elranchodekiro";
  const youtubePlaylistUrl = `https://www.youtube.com/watch?v=${currentTrack.videoId}&list=${currentPlaylist.id}`;

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined' || window.YT) {
      setIsApiReady(true);
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // Script is loading, wait for it
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
      return;
    }

    // Load YouTube IFrame API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };
  }, []);

  // Initialize random playlist and track only on client to avoid hydration mismatch
  useEffect(() => {
    const randomPlaylist = getRandomPlaylist();
    setCurrentPlaylist(randomPlaylist);
    setCurrentTrack(randomPlaylist.tracks[0]);
  }, []);

  // Create hidden YouTube player (for minimized view)
  useEffect(() => {
    if (!isApiReady || !hasUserInteracted || !hiddenPlayerContainerRef.current) return;

    const playlistIds = currentPlaylist.tracks.map((t) => t.videoId).join(',');

    if (!hiddenPlayerRef.current) {
      lastHiddenVideoId.current = currentTrack.videoId;
      hiddenPlayerRef.current = new window.YT.Player(hiddenPlayerContainerRef.current, {
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: 1,
          mute: 0,
          list: currentPlaylist.id,
          loop: 1,
          playlist: playlistIds,
          enablejsapi: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event) => {
            const player = event.target;
            setHiddenPlayerReady(true);
            try {
              const dur = player.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
              }
              if (isPlaying && typeof player.playVideo === 'function') {
                player.playVideo();
              }
            } catch (e) {
              console.error("Error in hidden player onReady:", e);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    } else {
      // Update video only when track actually changed
      if (
        hiddenPlayerRef.current &&
        typeof hiddenPlayerRef.current.loadVideoById === 'function' &&
        lastHiddenVideoId.current !== currentTrack.videoId
      ) {
        try {
          lastHiddenVideoId.current = currentTrack.videoId;
          hiddenPlayerRef.current.loadVideoById(currentTrack.videoId, 0);
          setCurrentTime(0);
          if (isPlaying) {
            hiddenPlayerRef.current.playVideo();
          }
        } catch (e) {
          console.error("Error loading video in hidden player:", e);
        }
      }
    }

    return () => {
      // Don't destroy on cleanup, just update
    };
  }, [isApiReady, hasUserInteracted, currentTrack, currentPlaylist, isPlaying]);

  // Create visible YouTube player (for expanded view)
  useEffect(() => {
    if (!isApiReady || !hasUserInteracted || !isExpanded || !visiblePlayerContainerRef.current) return;

    const playlistIds = currentPlaylist.tracks.map((t) => t.videoId).join(',');

    if (!visiblePlayerRef.current) {
      lastVisibleVideoId.current = currentTrack.videoId;
      visiblePlayerRef.current = new window.YT.Player(visiblePlayerContainerRef.current, {
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          mute: isMuted ? 1 : 0,
          list: currentPlaylist.id,
          loop: 1,
          playlist: playlistIds,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event) => {
            const player = event.target;
            setVisiblePlayerReady(true);
            try {
              const dur = player.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
              }
              if (isPlaying && typeof player.playVideo === 'function') {
                player.playVideo();
              } else if (!isPlaying && typeof player.pauseVideo === 'function') {
                player.pauseVideo();
              }
            } catch (e) {
              console.error("Error in visible player onReady:", e);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    } else {
      // Update video only when track actually changed
      if (
        visiblePlayerRef.current &&
        typeof visiblePlayerRef.current.loadVideoById === 'function' &&
        lastVisibleVideoId.current !== currentTrack.videoId
      ) {
        try {
          lastVisibleVideoId.current = currentTrack.videoId;
          visiblePlayerRef.current.loadVideoById(currentTrack.videoId, 0);
          setCurrentTime(0);
          if (isPlaying) {
            visiblePlayerRef.current.playVideo();
          } else {
            visiblePlayerRef.current.pauseVideo();
          }
        } catch (e) {
          console.error("Error loading video in visible player:", e);
        }
      }
    }
  }, [isApiReady, hasUserInteracted, isExpanded, currentTrack, currentPlaylist, isPlaying, isMuted]);

  // Function to start playing music (called from outside on first interaction)
  const startPlaying = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      setIsPlaying(true);
    }
  }, [hasUserInteracted]);

  // Expose startPlaying function to window for external access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).startMusicPlayer = startPlaying;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).startMusicPlayer;
      }
    };
  }, [startPlaying]);

  // Control volume and mute via YouTube API
  useEffect(() => {
    if (!hasUserInteracted || !isApiReady) return;

    const playerReady = isExpanded ? visiblePlayerReady : hiddenPlayerReady;
    if (!playerReady) return;

    const activePlayer = isExpanded ? visiblePlayerRef.current : hiddenPlayerRef.current;
    if (activePlayer && typeof activePlayer.setVolume === 'function') {
      try {
        const volumeValue = isMuted ? 0 : volume;
        activePlayer.setVolume(volumeValue);
        if (isMuted) {
          if (typeof activePlayer.mute === 'function') {
            activePlayer.mute();
          }
        } else {
          if (typeof activePlayer.unMute === 'function') {
            activePlayer.unMute();
          }
        }
      } catch (e) {
        console.error("Error setting volume:", e);
      }
    }
  }, [volume, isMuted, hasUserInteracted, isApiReady, isExpanded, hiddenPlayerReady, visiblePlayerReady]);

  // Update progress bar with real time from YouTube API
  useEffect(() => {
    if (!hasUserInteracted || !isApiReady || isSeeking) return;

    const updateProgress = () => {
      const activePlayer = isExpanded ? visiblePlayerRef.current : hiddenPlayerRef.current;
      if (activePlayer && typeof activePlayer.getCurrentTime === 'function' && typeof activePlayer.getDuration === 'function') {
        try {
          const current = activePlayer.getCurrentTime();
          const dur = activePlayer.getDuration();
          
          if (current !== undefined && !isNaN(current) && current >= 0) {
            setCurrentTime(current);
          }
          if (dur !== undefined && dur > 0 && !isNaN(dur)) {
            setDuration(dur);
          }
        } catch (e) {
          // Player might not be ready yet
        }
      }
    };

    if (isPlaying) {
      progressUpdateInterval.current = setInterval(updateProgress, 100);
    } else {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
        progressUpdateInterval.current = null;
      }
    }

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [isPlaying, hasUserInteracted, isApiReady, isSeeking, isExpanded]);

  // Reset time when track changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentTrack]);

  // Format time helper
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle progress bar click (seek)
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || duration <= 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    setIsSeeking(true);
    setCurrentTime(newTime);
    
    // Seek to new position using YouTube API
    const activePlayer = isExpanded ? visiblePlayerRef.current : hiddenPlayerRef.current;
    if (activePlayer && typeof activePlayer.seekTo === 'function') {
      try {
        activePlayer.seekTo(newTime, true);
      } catch (e) {
        console.error("Failed to seek:", e);
      }
    }
    
    // Also update the other player if it exists
    const otherPlayer = isExpanded ? hiddenPlayerRef.current : visiblePlayerRef.current;
    if (otherPlayer && typeof otherPlayer.seekTo === 'function') {
      try {
        otherPlayer.seekTo(newTime, true);
      } catch (e) {
        // Ignore errors for the inactive player
      }
    }
    
    setTimeout(() => setIsSeeking(false), 500);
  };

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeRef.current &&
        !volumeRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
    };
    if (showVolumeSlider) {
      // Use a small delay to avoid closing immediately when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showVolumeSlider]);

  // Mute hidden player when expanded to avoid double playback
  useEffect(() => {
    if (!isApiReady || !hasUserInteracted) return;

    if (isExpanded && hiddenPlayerRef.current && typeof hiddenPlayerRef.current.mute === 'function') {
      // Mute the hidden player when expanded
      try {
        hiddenPlayerRef.current.mute();
      } catch (e) {
        console.error("Failed to mute hidden player:", e);
      }
    } else if (!isExpanded && hiddenPlayerRef.current) {
      // Restore volume when collapsed
      try {
        const volumeValue = isMuted ? 0 : volume;
        if (typeof hiddenPlayerRef.current.setVolume === 'function') {
          hiddenPlayerRef.current.setVolume(volumeValue);
        }
        if (isMuted) {
          if (typeof hiddenPlayerRef.current.mute === 'function') {
            hiddenPlayerRef.current.mute();
          }
        } else {
          if (typeof hiddenPlayerRef.current.unMute === 'function') {
            hiddenPlayerRef.current.unMute();
          }
        }
      } catch (e) {
        console.error("Failed to restore volume:", e);
      }
    }
  }, [isExpanded, hasUserInteracted, isMuted, volume, isApiReady]);

  const handlePlaylistChange = (playlist: (typeof playlists)[0]) => {
    setCurrentPlaylist(playlist);
    setCurrentTrack(playlist.tracks[0]);
    setIsPlaying(true);
    setShowPlaylistSelector(false);
  };

  const handlePlayPause = () => {
    // Start playing if user hasn't interacted yet
    if (!hasUserInteracted) {
      startPlaying();
      return;
    }

    if (!isApiReady) return;

    const activePlayer = isExpanded ? visiblePlayerRef.current : hiddenPlayerRef.current;
    if (activePlayer) {
      try {
        if (isPlaying) {
          if (typeof activePlayer.pauseVideo === 'function') {
            activePlayer.pauseVideo();
          }
        } else {
          if (typeof activePlayer.playVideo === 'function') {
            activePlayer.playVideo();
          }
        }
      } catch (e) {
        console.error("Failed to play/pause:", e);
      }
    }
  };

  const handleNextTrack = () => {
    // Start playing if user hasn't interacted yet
    if (!hasUserInteracted) {
      startPlaying();
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(
      (t) => t.id === currentTrack.id,
    );
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    // Start playing if user hasn't interacted yet
    if (!hasUserInteracted) {
      startPlaying();
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(
      (t) => t.id === currentTrack.id,
    );
    const prevIndex =
      currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(currentPlaylist.tracks[prevIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    // Start playing if user hasn't interacted yet
    if (!hasUserInteracted) {
      startPlaying();
    }

    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    } else if (vol === 0) {
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube player container for background playback */}
      {hasUserInteracted && (
        <div
          ref={hiddenPlayerContainerRef}
          className="fixed opacity-0 pointer-events-none"
          style={{
            width: "200px",
            height: "200px",
            left: "-9999px",
            top: "-9999px",
          }}
        />
      )}

      {/* Minimized player bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isExpanded ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10">
          {/* Progress bar with time display */}
          <div className="relative">
            <div 
              className="h-1 bg-white/10 cursor-pointer group relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-[#F25835] transition-all duration-300 group-hover:bg-[#ff6b4a]"
                style={{ width: duration > 0 ? `${Math.min(100, (currentTime / duration) * 100)}%` : '0%' }}
              />
            </div>
            {/* Time display */}
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 pt-1">
              <span className="font-mono text-[8px] sm:text-[9px] text-white/60">
                {formatTime(currentTime)}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] text-white/60">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
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
                {/* Volume control with slider */}
                <div
                  ref={volumeRef}
                  className="hidden sm:flex items-center gap-2 relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVolumeSlider(!showVolumeSlider);
                    }}
                    className="p-1.5 sm:p-2 text-white/40 active:text-white md:hover:text-white transition-colors touch-manipulation"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>
                  {/* Volume slider - appears when clicked and stays open */}
                  {showVolumeSlider && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg z-50 min-w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                          Volumen
                        </span>
                        <span className="font-mono text-[10px] text-white/40">
                          {isMuted ? 0 : volume}%
                        </span>
                      </div>
                      <div className="px-1">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          onValueChange={handleVolumeChange}
                          min={0}
                          max={100}
                          step={1}
                          className="w-28 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
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
                    <Music
                      className={`w-4 h-4 ${currentPlaylist.id === playlist.id ? "text-[#F25835]" : "text-white/40"}`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-serif text-sm ${currentPlaylist.id === playlist.id ? "text-white" : "text-white/70"}`}
                      >
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

          {/* YouTube player - show when expanded */}
          {isExpanded && hasUserInteracted && (
            <div className="w-full max-w-5xl aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden mb-6 sm:mb-8">
              <div ref={visiblePlayerContainerRef} className="w-full h-full" />
            </div>
          )}

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
                    setCurrentTrack(track);
                    setIsPlaying(true);
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
  );
}
