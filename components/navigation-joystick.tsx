"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react"

interface NavigationJoystickProps {
  onNavigateUp: () => void
  onNavigateDown: () => void
  onNavigateLeft: () => void
  onNavigateRight: () => void
  canNavigateUp: boolean
  canNavigateDown: boolean
  canNavigateLeft: boolean
  canNavigateRight: boolean
  isTransitioning: boolean
  showVertical: boolean
}

export function NavigationJoystick({
  onNavigateUp,
  onNavigateDown,
  onNavigateLeft,
  onNavigateRight,
  canNavigateUp,
  canNavigateDown,
  canNavigateLeft,
  canNavigateRight,
  isTransitioning,
  showVertical,
}: NavigationJoystickProps) {
  const [isCollapsed, setIsCollapsed] = useState(false) // Start expanded by default
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return getDefaultJoystickPosition(false, 128)
    }
    return { x: 0, y: 0 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)
  const [expandAnimationDone, setExpandAnimationDone] = useState(false)
  const [isPointerDown, setIsPointerDown] = useState(false)
  const joystickRef = useRef<HTMLDivElement>(null)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const expandButtonPressedRef = useRef(false)
  const DRAG_THRESHOLD_PX = 8

  // Posición fija: esquina inferior derecha, encima del reproductor — igual en mobile, tablet y web
  function getDefaultJoystickPosition(collapsed: boolean, widthHint?: number) {
    if (typeof window === 'undefined') return { x: 0, y: 0 }
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
    const isWeb = window.innerWidth >= 1024
    const size = collapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : isTablet ? 112 : 128)
    const width = widthHint ?? size
    const padding = isMobile ? 12 : 16
    // En web un poco más arriba para que no se tape con la barra del reproductor
    const musicPlayerHeight = isWeb ? 100 : 72
    return {
      x: window.innerWidth - width - padding,
      y: window.innerHeight - musicPlayerHeight - width - padding,
    }
  }

  const resetToDefaultPosition = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const width = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    const defaultPos = getDefaultJoystickPosition(isCollapsed, width)
    setPosition(defaultPos)
  }, [isCollapsed])

  // Tecla "J" para volver el joystick a la posición por defecto (centro-derecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'J') {
        resetToDefaultPosition()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetToDefaultPosition])

  // Leer si el usuario ya vio la miniguía (ocultar después del primer uso)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHintDismissed(localStorage.getItem('joystick-hint-seen') === 'true')
    }
  }, [])

  // Animación tipo Transformers al abrir: los lados salen del centro
  useEffect(() => {
    if (isCollapsed) {
      setExpandAnimationDone(false)
    } else {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setExpandAnimationDone(true))
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [isCollapsed])

  // Siempre posición fija al cargar/refrescar: esquina inferior derecha (mobile, tablet, web)
  useEffect(() => {
    setIsMounted(true)
    const savedCollapsed = typeof window !== 'undefined' ? localStorage.getItem('joystick-collapsed') : null
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const defaultPos = getDefaultJoystickPosition(
      savedCollapsed === 'true',
      savedCollapsed === 'true' ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    )
    setPosition(defaultPos)
    if (savedCollapsed === 'true') setIsCollapsed(true)

    const handleResize = () => {
      const collapsed = localStorage.getItem('joystick-collapsed') === 'true'
      const mobile = window.innerWidth < 768
      const w = collapsed ? (mobile ? 40 : 48) : (mobile ? 96 : 128)
      setPosition(getDefaultJoystickPosition(collapsed, w))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // No guardamos posición en localStorage: al refrescar siempre aparece en la esquina fija

  // Adjust position when collapsing/expanding to maintain corner position
  useEffect(() => {
    if (isMounted && joystickRef.current) {
      setPosition((currentPos) => {
        const width = isCollapsed ? 48 : 128
        const padding = 16
        
        // Determine which corner we're closest to
        const corners = [
          { x: padding, y: padding },
          { x: Math.max(padding, window.innerWidth - width - padding), y: padding },
          { x: padding, y: Math.max(padding, window.innerHeight - width - padding - 80) },
          { x: Math.max(padding, window.innerWidth - width - padding), y: Math.max(padding, window.innerHeight - width - padding - 80) },
        ]
        
        // Find nearest corner
        let nearestCorner = corners[0]
        let minDistance = Math.sqrt(Math.pow(currentPos.x - nearestCorner.x, 2) + Math.pow(currentPos.y - nearestCorner.y, 2))
        
        for (const corner of corners) {
          const distance = Math.sqrt(Math.pow(currentPos.x - corner.x, 2) + Math.pow(currentPos.y - corner.y, 2))
          if (distance < minDistance) {
            minDistance = distance
            nearestCorner = corner
          }
        }
        
        // If we're close to a corner, snap to it with the new size
        if (minDistance < 100) {
          return nearestCorner
        }
        
        // Otherwise, adjust position to maintain relative position
        const oldWidth = isCollapsed ? 128 : 48
        const widthDiff = width - oldWidth
        
        // Adjust position to keep the same corner aligned
        const maxX = Math.max(padding, window.innerWidth - width - padding)
        const maxY = Math.max(padding, window.innerHeight - width - padding - 80)
        
        // If we're near a corner, snap to it
        const snapThreshold = 50
        if (Math.abs(currentPos.x - padding) < snapThreshold && Math.abs(currentPos.y - padding) < snapThreshold) {
          return { x: padding, y: padding } // Top-left
        }
        if (Math.abs(currentPos.x - maxX) < snapThreshold && Math.abs(currentPos.y - padding) < snapThreshold) {
          return { x: maxX, y: padding } // Top-right
        }
        if (Math.abs(currentPos.x - padding) < snapThreshold && Math.abs(currentPos.y - maxY) < snapThreshold) {
          return { x: padding, y: maxY } // Bottom-left
        }
        if (Math.abs(currentPos.x - maxX) < snapThreshold && Math.abs(currentPos.y - maxY) < snapThreshold) {
          return { x: maxX, y: maxY } // Bottom-right
        }
        
        // Otherwise maintain position but constrain to bounds
        return {
          x: Math.max(padding, Math.min(currentPos.x, maxX)),
          y: Math.max(padding, Math.min(currentPos.y, maxY))
        }
      })
      
      localStorage.setItem('joystick-collapsed', String(isCollapsed))
    }
  }, [isCollapsed, isMounted])

  // Function to snap to nearest corner
  const handleExpandWithHint = useCallback(() => {
    if (!hintDismissed && typeof window !== 'undefined') {
      localStorage.setItem('joystick-hint-seen', 'true')
      setHintDismissed(true)
    }
    setIsCollapsed(false)
  }, [hintDismissed])

  const snapToCorner = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y }
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const width = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    const height = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    const padding = isMobile ? 8 : 16
    
    // Ensure position is within bounds
    const maxX = Math.max(padding, window.innerWidth - width - padding)
    const maxY = Math.max(padding, window.innerHeight - height - padding - 80) // Account for music player
    const constrainedX = Math.max(padding, Math.min(x, maxX))
    const constrainedY = Math.max(padding, Math.min(y, maxY))
    
    const corners = [
      { x: padding, y: padding }, // Top-left
      { x: maxX, y: padding }, // Top-right
      { x: padding, y: maxY }, // Bottom-left
      { x: maxX, y: maxY }, // Bottom-right
    ]
    
    // Find nearest corner
    let nearestCorner = corners[0]
    let minDistance = Math.sqrt(
      Math.pow(constrainedX - nearestCorner.x, 2) + Math.pow(constrainedY - nearestCorner.y, 2)
    )
    
    for (const corner of corners) {
      const distance = Math.sqrt(
        Math.pow(constrainedX - corner.x, 2) + Math.pow(constrainedY - corner.y, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestCorner = corner
      }
    }
    
    // Always snap to nearest corner (more aggressive snapping)
    const snapThreshold = window.innerWidth < 640 ? 80 : 120
    if (minDistance < snapThreshold) {
      return nearestCorner
    }
    
    return { x: constrainedX, y: constrainedY }
  }, [isCollapsed])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const cw = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    const ch = cw
    const ew = isMobile ? 96 : 128
    const eh = ew

    if (pointerStartRef.current && !isDragging) {
      const dx = e.clientX - pointerStartRef.current.x
      const dy = e.clientY - pointerStartRef.current.y
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD_PX) {
        pointerStartRef.current = null
        if (joystickRef.current) {
          const rect = joystickRef.current.getBoundingClientRect()
          setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }
        setIsDragging(true)
      }
    }

    if (isDragging && joystickRef.current && typeof window !== 'undefined') {
      const padding = isMobile ? 8 : 16
      const musicPlayerHeight = 80
      const newLeft = e.clientX - dragStart.x
      const newTop = e.clientY - dragStart.y

      if (isCollapsed) {
        const maxX = window.innerWidth - cw - padding
        const maxY = window.innerHeight - ch - padding - musicPlayerHeight
        setPosition({
          x: Math.max(padding, Math.min(newLeft, maxX)),
          y: Math.max(padding, Math.min(newTop, maxY)),
        })
      } else {
        const maxEx = window.innerWidth - ew - padding
        const maxEy = window.innerHeight - eh - padding - musicPlayerHeight
        const constrainedEx = Math.max(padding, Math.min(newLeft, maxEx))
        const constrainedEy = Math.max(padding, Math.min(newTop, maxEy))
        setPosition({
          x: constrainedEx + ew / 2 - cw / 2,
          y: constrainedEy + eh / 2 - ch / 2,
        })
      }
    }
  }, [isDragging, dragStart, isCollapsed])

  const handleMouseUp = useCallback(() => {
    setIsPointerDown(false)
    if (isDragging) {
      setIsDragging(false)
      setPosition((currentPos) => snapToCorner(currentPos.x, currentPos.y))
    } else if (pointerStartRef.current && expandButtonPressedRef.current && isCollapsed) {
      handleExpandWithHint()
    }
    pointerStartRef.current = null
  }, [isDragging, snapToCorner, isCollapsed, handleExpandWithHint])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const cw = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
    const ch = cw
    const ew = isMobile ? 96 : 128
    const eh = ew

    if (pointerStartRef.current && !isDragging) {
      const dx = touch.clientX - pointerStartRef.current.x
      const dy = touch.clientY - pointerStartRef.current.y
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD_PX) {
        pointerStartRef.current = null
        if (joystickRef.current) {
          const rect = joystickRef.current.getBoundingClientRect()
          setDragStart({ x: touch.clientX - rect.left, y: touch.clientY - rect.top })
        }
        setIsDragging(true)
      }
    }

    if (isDragging && joystickRef.current && typeof window !== 'undefined') {
      const padding = isMobile ? 8 : 16
      const musicPlayerHeight = 80
      const newLeft = touch.clientX - dragStart.x
      const newTop = touch.clientY - dragStart.y

      if (isCollapsed) {
        const maxX = window.innerWidth - cw - padding
        const maxY = window.innerHeight - ch - padding - musicPlayerHeight
        setPosition({
          x: Math.max(padding, Math.min(newLeft, maxX)),
          y: Math.max(padding, Math.min(newTop, maxY)),
        })
      } else {
        const maxEx = window.innerWidth - ew - padding
        const maxEy = window.innerHeight - eh - padding - musicPlayerHeight
        const constrainedEx = Math.max(padding, Math.min(newLeft, maxEx))
        const constrainedEy = Math.max(padding, Math.min(newTop, maxEy))
        setPosition({
          x: constrainedEx + ew / 2 - cw / 2,
          y: constrainedEy + eh / 2 - ch / 2,
        })
      }
    }
  }, [isDragging, dragStart, isCollapsed])

  const handleTouchEnd = useCallback(() => {
    setIsPointerDown(false)
    if (isDragging) {
      setIsDragging(false)
      setPosition((currentPos) => snapToCorner(currentPos.x, currentPos.y))
    } else if (pointerStartRef.current && expandButtonPressedRef.current && isCollapsed) {
      handleExpandWithHint()
    }
    pointerStartRef.current = null
  }, [isDragging, snapToCorner, isCollapsed, handleExpandWithHint])

  useEffect(() => {
    if (isPointerDown) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isPointerDown, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (isPointerDown) {
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
      return () => {
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isPointerDown, handleTouchMove, handleTouchEnd])

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const button = target.closest('button')
    const isExpandButton = isCollapsed && button?.getAttribute('aria-label')?.includes('Abrir joystick')
    const isCollapseButton = !isCollapsed && button?.getAttribute('aria-label')?.includes('Collapse')
    const isNavButton = button?.getAttribute('aria-label')?.includes('Navigate')

    if (isNavButton) return
    if (isCollapseButton) return // collapse se maneja con onClick

    e.preventDefault()
    e.stopPropagation()
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    expandButtonPressedRef.current = !!isExpandButton
    setIsPointerDown(true)

    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect()
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const width = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
      const height = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    const button = target.closest('button')
    const isExpandButton = isCollapsed && button?.getAttribute('aria-label')?.includes('Abrir joystick')
    const isCollapseButton = !isCollapsed && button?.getAttribute('aria-label')?.includes('Collapse')
    const isNavButton = button?.getAttribute('aria-label')?.includes('Navigate')

    if (isNavButton) return
    if (isCollapseButton) return

    e.stopPropagation()
    const touch = e.touches[0]
    pointerStartRef.current = { x: touch.clientX, y: touch.clientY }
    expandButtonPressedRef.current = !!isExpandButton
    setIsPointerDown(true)

    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect()
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const width = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
      const height = isCollapsed ? (isMobile ? 40 : 48) : (isMobile ? 96 : 128)
      setDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
    }
  }

  if (!isMounted) {
    return null
  }

  if (isCollapsed) {
    return (
      <div
        ref={joystickRef}
        className="fixed z-[85] cursor-move select-none pointer-events-auto touch-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Toca para abrir y navegar. Arrastra para mover. Presiona J para reposicionar."
      >
        {/* Miniguía: a la izquierda del botón, no afecta la posición del círculo */}
        {!hintDismissed && (
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1.5 rounded-md bg-[#0a0a0a]/95 border border-[#F25835]/60 text-[#F25835] font-mono text-[10px] md:text-xs tracking-wider uppercase shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-300"
            style={{ maxWidth: '160px' }}
          >
            <span className="font-semibold">Navega aquí</span>
            <span className="text-white/80 font-normal"> — Toca para abrir</span>
          </div>
        )}
        <div className="relative w-10 h-10 md:w-12 md:h-12">
          {/* Botón sólido: abrir se detecta en mouseup/touchend si no hubo arrastre */}
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-auto z-10 touch-manipulation bg-[#F25835] text-[#0a0a0a] border-2 border-[#d94a2a] shadow-lg shadow-[#F25835]/40 ring-2 ring-[#F25835]/30 transition-all active:scale-95 active:shadow-md md:hover:scale-105 md:hover:shadow-xl md:hover:shadow-[#F25835]/50"
            aria-label="Abrir joystick para navegar"
          >
            <ChevronUp className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5]" />
          </button>
          <div className="absolute inset-0 -m-2 cursor-move" />
        </div>
      </div>
    )
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const collapsedSize = isMobile ? 40 : 48
  const expandedSize = isMobile ? 96 : 128
  const expandedLeft = position.x + collapsedSize / 2 - expandedSize / 2
  const expandedTop = position.y + collapsedSize / 2 - expandedSize / 2

  return (
    <div
      ref={joystickRef}
      className="fixed z-[85] cursor-move select-none pointer-events-auto touch-none"
      style={{
        left: `${expandedLeft}px`,
        top: `${expandedTop}px`,
        transition: isDragging ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      title="Arrastra para mover. Presiona J para volver a la posición por defecto."
    >
      <div
        className="relative origin-center transition-transform duration-300 ease-out"
        style={{
          transform: expandAnimationDone ? 'scale(1)' : 'scale(0)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Cross-shaped joystick (D-pad) - responsive sizing */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Connecting cross background - verde menta (zapotico) para destacar en B/N */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border border-[#F25835]/30 bg-[#F25835]/10 backdrop-blur-sm shadow-lg shadow-[#F25835]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-l border-r border-[#F25835]/30" />
          {showVertical && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-t border-b border-[#F25835]/30" />
          )}

          {/* Center button - collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(true)
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center border border-[#F25835]/50 bg-[#F25835]/15 backdrop-blur-sm text-[#F25835] transition-all active:bg-[#F25835] active:text-[#0a0a0a] md:hover:bg-[#F25835] md:hover:text-[#0a0a0a] rounded-full touch-manipulation"
            aria-label="Collapse joystick"
          >
            <ChevronDown className="h-2.5 w-2.5 md:h-3 md:w-3" />
          </button>

          {/* Up button */}
          {showVertical && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (typeof window !== 'undefined' && (window as any).startMusicPlayer) {
                  (window as any).startMusicPlayer()
                }
                onNavigateUp()
              }}
              disabled={!canNavigateUp || isTransitioning}
              className="absolute top-0 left-1/2 -translate-x-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-[#F25835]/50 bg-transparent text-[#F25835] transition-all active:bg-[#F25835] active:text-[#0a0a0a] md:hover:bg-[#F25835] md:hover:text-[#0a0a0a] disabled:opacity-20 disabled:active:bg-transparent disabled:active:text-[#F25835] disabled:cursor-not-allowed touch-manipulation"
              aria-label="Navigate up"
            >
              <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}

          {/* Down button */}
          {showVertical && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (typeof window !== 'undefined' && (window as any).startMusicPlayer) {
                  (window as any).startMusicPlayer()
                }
                onNavigateDown()
              }}
              disabled={!canNavigateDown || isTransitioning}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-[#F25835]/50 bg-transparent text-[#F25835] transition-all active:bg-[#F25835] active:text-[#0a0a0a] md:hover:bg-[#F25835] md:hover:text-[#0a0a0a] disabled:opacity-20 disabled:active:bg-transparent disabled:active:text-[#F25835] disabled:cursor-not-allowed touch-manipulation"
              aria-label="Navigate down"
            >
              <ArrowDown className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}

          {/* Left button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (typeof window !== 'undefined' && (window as any).startMusicPlayer) {
                (window as any).startMusicPlayer()
              }
              onNavigateLeft()
            }}
            disabled={!canNavigateLeft || isTransitioning}
            className="absolute top-1/2 left-0 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-[#F25835]/50 bg-transparent text-[#F25835] transition-all active:bg-[#F25835] active:text-[#0a0a0a] md:hover:bg-[#F25835] md:hover:text-[#0a0a0a] disabled:opacity-20 disabled:active:bg-transparent disabled:active:text-[#F25835] disabled:cursor-not-allowed touch-manipulation shadow-md shadow-[#F25835]/10"
            aria-label="Navigate left"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Right button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (typeof window !== 'undefined' && (window as any).startMusicPlayer) {
                (window as any).startMusicPlayer()
              }
              onNavigateRight()
            }}
            disabled={!canNavigateRight || isTransitioning}
            className="absolute top-1/2 right-0 -translate-y-1/2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border border-[#F25835]/50 bg-[#F25835] text-[#0a0a0a] transition-all active:bg-transparent active:text-[#F25835] active:border-[#F25835] md:hover:bg-transparent md:hover:text-[#F25835] md:hover:border-[#F25835] disabled:opacity-20 disabled:active:bg-[#F25835] disabled:active:text-[#0a0a0a] touch-manipulation shadow-lg shadow-[#F25835]/20"
            aria-label="Navigate right"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
