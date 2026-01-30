"use client"

import { useState, useEffect, useCallback } from "react"
import { GalleryHeader } from "@/components/gallery-header"
import { HeroSection } from "@/components/sections/hero-section"
import { VideosSection } from "@/components/sections/videos-section"
import { FilmSection } from "@/components/sections/film-section"
import { PhotosSection } from "@/components/sections/photos-section"
import { ArtistasSection } from "@/components/sections/artistas-section"
import { ArtistRoomSection } from "@/components/sections/artist-room-section"
import { LanzamientosSection } from "@/components/sections/lanzamientos-section"
import { AlbumesSection } from "@/components/sections/albumes-section"
import { MusicPlayer } from "@/components/music-player"
import { NavigationJoystick } from "@/components/navigation-joystick"
import {
  type GalleryRoomId,
  type Direction,
  getRoomAt,
  getNextPosition,
  canNavigate,
  GRID_AT_ROOM,
  GRID_COLUMNS,
  GRID_ROW_COUNT,
} from "@/lib/gallery-map"

const CONTENT_HEIGHT = "calc(100vh - 64px - 56px)" // header + music player

export default function Home() {
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  /** Al navegar a Álbumes desde una sala de artista, preseleccionar este álbum. */
  const [albumIdToSelectInAlbumes, setAlbumIdToSelectInAlbumes] = useState<number | null>(null)

  const currentRoom = getRoomAt(row, col) ?? "inicio"

  const goTo = useCallback(
    (nextRow: number, nextCol: number) => {
      const room = getRoomAt(nextRow, nextCol)
      if (!room) return
      setIsTransitioning(true)
      setRow(nextRow)
      setCol(nextCol)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    []
  )

  const navigate = useCallback(
    (direction: Direction) => {
      if (isTransitioning) return
      const next = getNextPosition(row, col, direction)
      if (next) goTo(next.row, next.col)
    },
    [row, col, isTransitioning, goTo]
  )

  const navigateToRoom = useCallback(
    (room: GalleryRoomId, options?: { albumId?: number }) => {
      if (isTransitioning) return
      if (options?.albumId != null && room === "albumes") {
        setAlbumIdToSelectInAlbumes(options.albumId)
      }
      if (room === currentRoom && !options?.albumId) return
      const pos = GRID_AT_ROOM[room]
      goTo(pos.row, pos.col)
    },
    [currentRoom, isTransitioning, goTo]
  )

  const navigateUp = useCallback(() => navigate("up"), [navigate])
  const navigateDown = useCallback(() => navigate("down"), [navigate])
  const navigateLeft = useCallback(() => navigate("left"), [navigate])
  const navigateRight = useCallback(() => navigate("right"), [navigate])

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateRight()
      if (e.key === "ArrowLeft") navigateLeft()
      if (e.key === "ArrowUp") navigateUp()
      if (e.key === "ArrowDown") navigateDown()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigateUp, navigateDown, navigateLeft, navigateRight])

  // Rueda: vertical = arriba/abajo, horizontal = izq/der
  useEffect(() => {
    let lastWheel = 0
    const cooldown = 300

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel < cooldown) return
      lastWheel = now

      const dx = Math.abs(e.deltaX)
      const dy = Math.abs(e.deltaY)
      if (dx > dy) {
        if (e.deltaX > 0) navigateRight()
        else navigateLeft()
      } else {
        if (e.deltaY > 0) navigateDown()
        else navigateUp()
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [navigateUp, navigateDown, navigateLeft, navigateRight])

  // Swipe táctil
  useEffect(() => {
    let startX = 0,
      startY = 0
    const min = 50

    const handleStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX
      startY = e.changedTouches[0].screenY
    }

    const handleEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].screenX
      const endY = e.changedTouches[0].screenY
      const dx = endX - startX
      const dy = endY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > min) {
        if (dx > 0) navigateLeft()
        else navigateRight()
      } else if (Math.abs(dy) > min) {
        if (dy > 0) navigateDown()
        else navigateUp()
      }
    }

    window.addEventListener("touchstart", handleStart, { passive: true })
    window.addEventListener("touchend", handleEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", handleStart)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [navigateUp, navigateDown, navigateLeft, navigateRight])

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white">
      <GalleryHeader currentSection={currentRoom} onNavigate={navigateToRoom} />

      {/* Viewport: solo la celda visible. Contenido en grid 4x2 que se desplaza. */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: CONTENT_HEIGHT,
          marginTop: "64px",
        }}
      >
        <div
          className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            width: `${GRID_COLUMNS * 100}vw`,
            height: `${GRID_ROW_COUNT * 100}%`,
            transform: `translate(-${col * 100}vw, -${row * (100 / GRID_ROW_COUNT)}%)`,
          }}
        >
          {/* Fila 0: Inicio, Artistas, Lanzamientos, Albumes */}
          <div className="flex flex-shrink-0 w-full" style={{ height: `${100 / GRID_ROW_COUNT}%` }}>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <HeroSection
                isActive={currentRoom === "inicio"}
                onNavigateToRoom={navigateToRoom}
              />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <ArtistasSection 
                isActive={currentRoom === "artistas"} 
                onNavigateToArtist={navigateToRoom}
              />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <LanzamientosSection isActive={currentRoom === "lanzamientos"} />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <AlbumesSection
                isActive={currentRoom === "albumes"}
                initialAlbumId={albumIdToSelectInAlbumes}
                onViewedInitialAlbum={() => setAlbumIdToSelectInAlbumes(null)}
                onNavigateToArtist={(artistId) => navigateToRoom(artistId)}
              />
            </div>
          </div>
          {/* Fila 1: Videos, Film, Photos */}
          <div className="flex flex-shrink-0 w-full" style={{ height: `${100 / GRID_ROW_COUNT}%` }}>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <VideosSection isActive={currentRoom === "videos"} />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <FilmSection isActive={currentRoom === "film"} />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <PhotosSection isActive={currentRoom === "photos"} />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden bg-[#0a0a0a]" />
          </div>
          {/* Fila 2: Salas individuales de artistas */}
          <div className="flex flex-shrink-0 w-full" style={{ height: `${100 / GRID_ROW_COUNT}%` }}>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <ArtistRoomSection 
                isActive={currentRoom === "grioth"} 
                artistId="grioth"
                onNavigateBack={() => navigateToRoom("artistas")}
                onNavigateToAlbum={(albumId) => navigateToRoom("albumes", { albumId })}
              />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden">
              <ArtistRoomSection 
                isActive={currentRoom === "kiro"} 
                artistId="kiro"
                onNavigateBack={() => navigateToRoom("artistas")}
                onNavigateToAlbum={(albumId) => navigateToRoom("albumes", { albumId })}
              />
            </div>
            <div className="w-screen flex-shrink-0 h-full overflow-hidden bg-[#0a0a0a]" />
            <div className="w-screen flex-shrink-0 h-full overflow-hidden bg-[#0a0a0a]" />
          </div>
        </div>
      </div>

      <NavigationJoystick
        onNavigateUp={navigateUp}
        onNavigateDown={navigateDown}
        onNavigateLeft={navigateLeft}
        onNavigateRight={navigateRight}
        canNavigateUp={canNavigate(row, col, "up")}
        canNavigateDown={canNavigate(row, col, "down")}
        canNavigateLeft={canNavigate(row, col, "left")}
        canNavigateRight={canNavigate(row, col, "right")}
        isTransitioning={isTransitioning}
        showVertical={true}
      />

      <MusicPlayer />

      {/* Indicador de sala (opcional: "fila, col" o nombre) */}
      <div className="fixed bottom-20 sm:bottom-16 md:bottom-8 left-4 md:left-8 z-50 flex items-center gap-2 md:gap-4">
        <p className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase">
          {currentRoom}
        </p>
      </div>
    </main>
  )
}
