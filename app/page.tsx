"use client"

import { useState, useEffect, useCallback } from "react"
import { GalleryHeader } from "@/components/gallery-header"
import { HeroSection } from "@/components/sections/hero-section"
import { VideosSection } from "@/components/sections/videos-section"
import { FilmSection } from "@/components/sections/film-section"
import { PhotosSection } from "@/components/sections/photos-section"
import { ArtistasSection } from "@/components/sections/artistas-section"
import { LanzamientosSection } from "@/components/sections/lanzamientos-section"
import { AlbumesSection } from "@/components/sections/albumes-section"
import { MusicPlayer } from "@/components/music-player"
import { NavigationJoystick } from "@/components/navigation-joystick"

// Navigation map: main horizontal sections with vertical sub-sections
// Hero (inicio) has 3 vertical sub-sections: main, videos, film, photos
type MainSection = "inicio" | "artistas" | "lanzamientos" | "albumes"
type HeroSubSection = "main" | "videos" | "film" | "photos"

const mainSections: MainSection[] = ["inicio", "artistas", "lanzamientos", "albumes"]
const heroSubSections: HeroSubSection[] = ["main", "videos", "film", "photos"]

export default function Home() {
  const [currentMain, setCurrentMain] = useState<MainSection>("inicio")
  const [heroSub, setHeroSub] = useState<HeroSubSection>("main")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentMainIndex = mainSections.indexOf(currentMain)
  const currentHeroSubIndex = heroSubSections.indexOf(heroSub)

  const navigateMain = useCallback((section: MainSection) => {
    if (isTransitioning || section === currentMain) return
    setIsTransitioning(true)
    setCurrentMain(section)
    // Reset hero sub-section when navigating away
    if (section !== "inicio") {
      setHeroSub("main")
    }
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, currentMain])

  const navigateHeroSub = useCallback((sub: HeroSubSection) => {
    if (isTransitioning || sub === heroSub || currentMain !== "inicio") return
    setIsTransitioning(true)
    setHeroSub(sub)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning, heroSub, currentMain])

  const navigatePrev = useCallback(() => {
    if (currentMainIndex > 0) {
      navigateMain(mainSections[currentMainIndex - 1])
    }
  }, [currentMainIndex, navigateMain])

  const navigateNext = useCallback(() => {
    if (currentMainIndex < mainSections.length - 1) {
      navigateMain(mainSections[currentMainIndex + 1])
    }
  }, [currentMainIndex, navigateMain])

  const navigateUp = useCallback(() => {
    if (currentMain === "inicio" && currentHeroSubIndex > 0) {
      navigateHeroSub(heroSubSections[currentHeroSubIndex - 1])
    }
  }, [currentMain, currentHeroSubIndex, navigateHeroSub])

  const navigateDown = useCallback(() => {
    if (currentMain === "inicio" && currentHeroSubIndex < heroSubSections.length - 1) {
      navigateHeroSub(heroSubSections[currentHeroSubIndex + 1])
    }
  }, [currentMain, currentHeroSubIndex, navigateHeroSub])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateNext()
      if (e.key === "ArrowLeft") navigatePrev()
      if (e.key === "ArrowUp") navigateUp()
      if (e.key === "ArrowDown") navigateDown()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigateNext, navigatePrev, navigateUp, navigateDown])

  // Mouse wheel navigation
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null
    let lastWheelTime = 0
    const wheelCooldown = 300 // ms between wheel navigations

    const handleWheel = (e: WheelEvent) => {
      // Prevent default scrolling
      e.preventDefault()

      // Throttle wheel events
      const now = Date.now()
      if (now - lastWheelTime < wheelCooldown) return
      lastWheelTime = now

      // Clear any pending timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }

      // Determine scroll direction
      const deltaX = Math.abs(e.deltaX)
      const deltaY = Math.abs(e.deltaY)
      const isHorizontalScroll = deltaX > deltaY

      wheelTimeout = setTimeout(() => {
        if (isHorizontalScroll) {
          // Horizontal scroll -> navigate left/right
          if (e.deltaX > 0) {
            navigateNext()
          } else if (e.deltaX < 0) {
            navigatePrev()
          }
        } else {
          // Vertical scroll -> navigate up/down (only in inicio section)
          if (currentMain === "inicio") {
            if (e.deltaY > 0) {
              navigateDown()
            } else if (e.deltaY < 0) {
              navigateUp()
            }
          } else {
            // When not in inicio, vertical scroll navigates horizontally
            if (e.deltaY > 0) {
              navigateNext()
            } else if (e.deltaY < 0) {
              navigatePrev()
            }
          }
        }
      }, 50) // Small delay to debounce rapid wheel events
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (wheelTimeout) clearTimeout(wheelTimeout)
    }
  }, [navigateNext, navigatePrev, navigateUp, navigateDown, currentMain])

  // Touch swipe navigation
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0
    const minSwipeDistance = 50 // Minimum distance for a swipe

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      touchEndY = e.changedTouches[0].screenY
      handleSwipe()
    }

    const handleSwipe = () => {
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Determine if it's a horizontal or vertical swipe
      const isHorizontalSwipe = absDeltaX > absDeltaY

      if (isHorizontalSwipe && absDeltaX > minSwipeDistance) {
        // Horizontal swipe -> navigate left/right
        if (deltaX > 0) {
          navigatePrev()
        } else {
          navigateNext()
        }
      } else if (!isHorizontalSwipe && absDeltaY > minSwipeDistance) {
        // Vertical swipe -> navigate up/down (only in inicio section)
        if (currentMain === "inicio") {
          if (deltaY > 0) {
            navigateDown()
          } else {
            navigateUp()
          }
        } else {
          // When not in inicio, vertical swipe navigates horizontally
          if (deltaY > 0) {
            navigateNext()
          } else {
            navigatePrev()
          }
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [navigateNext, navigatePrev, navigateUp, navigateDown, currentMain])

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white">
      <GalleryHeader 
        currentSection={currentMain} 
        onNavigate={navigateMain} 
      />
      
      {/* Main content with horizontal transitions */}
      <div 
        className="relative w-full overflow-hidden" 
        style={{ 
          height: 'calc(100vh - 64px - 56px)', // 64px header + ~56px music player (py-2.5 + content)
          marginTop: '64px' 
        }}
      >
        {/* Horizontal sections container */}
        <div 
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ transform: `translateX(-${currentMainIndex * 100}%)` }}
        >
          {/* Hero section with vertical sub-sections */}
          <div className="relative h-full w-screen flex-shrink-0 overflow-hidden">
            <div 
              className="flex flex-col h-full transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{ transform: `translateY(-${currentHeroSubIndex * 100}%)` }}
            >
              <HeroSection 
                isActive={currentMain === "inicio" && heroSub === "main"} 
                onNavigateToSub={navigateHeroSub}
              />
              <VideosSection isActive={currentMain === "inicio" && heroSub === "videos"} />
              <FilmSection isActive={currentMain === "inicio" && heroSub === "film"} />
              <PhotosSection isActive={currentMain === "inicio" && heroSub === "photos"} />
            </div>
          </div>
          
          <ArtistasSection isActive={currentMain === "artistas"} />
          <LanzamientosSection isActive={currentMain === "lanzamientos"} />
          <AlbumesSection isActive={currentMain === "albumes"} />
        </div>
      </div>

      {/* Navigation joystick */}
      <NavigationJoystick
        onNavigateUp={navigateUp}
        onNavigateDown={navigateDown}
        onNavigateLeft={navigatePrev}
        onNavigateRight={navigateNext}
        canNavigateUp={currentMain === "inicio" && currentHeroSubIndex > 0}
        canNavigateDown={currentMain === "inicio" && currentHeroSubIndex < heroSubSections.length - 1}
        canNavigateLeft={currentMainIndex > 0}
        canNavigateRight={currentMainIndex < mainSections.length - 1}
        isTransitioning={isTransitioning}
        showVertical={currentMain === "inicio"}
      />

      {/* Music player */}
      <MusicPlayer />

      {/* Section indicator */}
      <div className="fixed bottom-20 sm:bottom-16 md:bottom-8 left-4 md:left-8 z-50 flex items-center gap-2 md:gap-4">
        <p className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase">
          {String(currentMainIndex + 1).padStart(2, "0")} / {String(mainSections.length).padStart(2, "0")}
        </p>
        {currentMain === "inicio" && heroSub !== "main" && (
          <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-[#F25835] uppercase">
            {heroSub}
          </span>
        )}
      </div>

    </main>
  )
}
