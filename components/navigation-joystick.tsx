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
      // Position in bottom-right, accounting for small screens
      const width = 128 // expanded size (default)
      const padding = 16
      return { 
        x: Math.max(padding, window.innerWidth - width - padding), 
        y: Math.max(padding, window.innerHeight - width - padding - 80) // Account for music player
      }
    }
    return { x: 0, y: 0 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const joystickRef = useRef<HTMLDivElement>(null)

  // Initialize position from localStorage if available
  useEffect(() => {
    setIsMounted(true)
    
    const updatePosition = () => {
      const savedPosition = localStorage.getItem('joystick-position')
      const savedCollapsed = localStorage.getItem('joystick-collapsed')
      
      if (savedPosition) {
        try {
          const { x, y } = JSON.parse(savedPosition)
          // Use saved collapsed state to determine width
          const savedIsCollapsed = savedCollapsed === 'true'
          const width = savedIsCollapsed ? 48 : 128
          const padding = 16
          const maxX = Math.max(padding, window.innerWidth - width - padding)
          const maxY = Math.max(padding, window.innerHeight - width - padding - 80)
          
          // Adjust position to maintain corner when size changes
          let adjustedX = Math.max(padding, Math.min(x, maxX))
          let adjustedY = Math.max(padding, Math.min(y, maxY))
          
          // Snap to nearest corner
          const corners = [
            { x: padding, y: padding },
            { x: Math.max(padding, window.innerWidth - width - padding), y: padding },
            { x: padding, y: Math.max(padding, window.innerHeight - width - padding - 80) },
            { x: Math.max(padding, window.innerWidth - width - padding), y: Math.max(padding, window.innerHeight - width - padding - 80) },
          ]
          
          let nearestCorner = corners[0]
          let minDistance = Math.sqrt(Math.pow(adjustedX - nearestCorner.x, 2) + Math.pow(adjustedY - nearestCorner.y, 2))
          
          for (const corner of corners) {
            const distance = Math.sqrt(Math.pow(adjustedX - corner.x, 2) + Math.pow(adjustedY - corner.y, 2))
            if (distance < minDistance) {
              minDistance = distance
              nearestCorner = corner
            }
          }
          
          // Snap if close to corner
          if (minDistance < 50) {
            adjustedX = nearestCorner.x
            adjustedY = nearestCorner.y
          }
          
          setPosition({ x: adjustedX, y: adjustedY })
        } catch {
          // If parsing fails, use default
          const width = 128 // expanded by default
          const padding = 16
          setPosition({ 
            x: Math.max(padding, window.innerWidth - width - padding), 
            y: Math.max(padding, window.innerHeight - width - padding - 80)
          })
        }
      } else {
        // Default position: bottom right, expanded
        const width = 128
        const padding = 16
        setPosition({ 
          x: Math.max(padding, window.innerWidth - width - padding), 
          y: Math.max(padding, window.innerHeight - width - padding - 80)
        })
      }
      
      if (savedCollapsed === 'true') {
        setIsCollapsed(true)
      }
    }
    
    updatePosition()
    
    // Handle window resize
    const handleResize = () => {
      setPosition((currentPos) => {
        const savedPosition = localStorage.getItem('joystick-position')
        const width = 48 // Use collapsed size for validation
        const padding = 8
        const maxX = Math.max(padding, window.innerWidth - width - padding)
        const maxY = Math.max(padding, window.innerHeight - width - padding - 80)
        
        if (!savedPosition) {
          return { 
            x: maxX, 
            y: maxY
          }
        }
        
        // Validate current position is still within bounds
        return {
          x: Math.max(padding, Math.min(currentPos.x, maxX)),
          y: Math.max(padding, Math.min(currentPos.y, maxY))
        }
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Save position to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('joystick-position', JSON.stringify(position))
    }
  }, [position, isMounted])

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
  const snapToCorner = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y }
    
    const width = isCollapsed ? 48 : 128
    const height = isCollapsed ? 48 : 128
    const padding = 16
    
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
    if (isDragging && joystickRef.current && typeof window !== 'undefined') {
      const width = isCollapsed ? 48 : 128
      const height = isCollapsed ? 48 : 128
      
      // Calculate new position based on center of joystick
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Constrain to viewport bounds
      const maxX = window.innerWidth - width
      const maxY = window.innerHeight - height
      
      const constrainedX = Math.max(0, Math.min(newX, maxX))
      const constrainedY = Math.max(0, Math.min(newY, maxY))
      
      setPosition({
        x: constrainedX,
        y: constrainedY,
      })
    }
  }, [isDragging, dragStart, isCollapsed])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      // Snap to nearest corner when released
      setPosition((currentPos) => {
        const snapped = snapToCorner(currentPos.x, currentPos.y)
        return snapped
      })
    }
  }, [isDragging, snapToCorner])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && joystickRef.current && typeof window !== 'undefined') {
      const touch = e.touches[0]
      const width = isCollapsed ? 48 : 128
      const height = isCollapsed ? 48 : 128
      
      const newX = touch.clientX - dragStart.x
      const newY = touch.clientY - dragStart.y
      
      const maxX = window.innerWidth - width
      const maxY = window.innerHeight - height
      
      const constrainedX = Math.max(0, Math.min(newX, maxX))
      const constrainedY = Math.max(0, Math.min(newY, maxY))
      
      setPosition({
        x: constrainedX,
        y: constrainedY,
      })
    }
  }, [isDragging, dragStart, isCollapsed])

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      // Snap to nearest corner when released
      setPosition((currentPos) => {
        const snapped = snapToCorner(currentPos.x, currentPos.y)
        return snapped
      })
    }
  }, [isDragging, snapToCorner])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
      return () => {
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow dragging from anywhere except navigation buttons
    const target = e.target as HTMLElement
    const button = target.closest('button')
    
    // Only prevent dragging if clicking directly on a navigation button
    // Allow dragging from the container and background elements
    if (button) {
      const ariaLabel = button.getAttribute('aria-label') || ''
      // Only prevent if it's a navigation button, not collapse/expand
      if (ariaLabel.includes('Navigate')) {
        return
      }
      // For collapse/expand buttons, allow dragging if clicking on the container around them
      if ((ariaLabel.includes('Collapse') || ariaLabel.includes('Expand')) && 
          target === button) {
        return
      }
    }
    
    // Prevent default to avoid text selection
    e.preventDefault()
    e.stopPropagation()
    
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect()
      const width = isCollapsed ? 48 : 128
      const height = isCollapsed ? 48 : 128
      
      setIsDragging(true)
      setDragStart({
        x: e.clientX - rect.left - width / 2,
        y: e.clientY - rect.top - height / 2,
      })
    }
  }

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    const button = target.closest('button')
    
    // Only prevent dragging if touching navigation buttons directly
    if (button) {
      const ariaLabel = button.getAttribute('aria-label') || ''
      if (ariaLabel.includes('Navigate')) {
        return
      }
      // For collapse/expand buttons, allow dragging if touching the container around them
      if ((ariaLabel.includes('Collapse') || ariaLabel.includes('Expand')) && 
          target === button) {
        return
      }
    }
    
    e.stopPropagation()
    
    const touch = e.touches[0]
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect()
      const width = isCollapsed ? 48 : 128
      const height = isCollapsed ? 48 : 128
      
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - rect.left - width / 2,
        y: touch.clientY - rect.top - height / 2,
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
        className="fixed z-[90] cursor-move select-none pointer-events-auto touch-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-12 h-12">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(false)
            }}
            className="absolute inset-0 flex items-center justify-center text-white transition-all hover:text-white/80 rounded-full pointer-events-auto z-10"
            aria-label="Expand joystick"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          {/* Invisible drag area around button */}
          <div className="absolute inset-0 -m-2 cursor-move" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={joystickRef}
      className="fixed z-[60] cursor-move select-none pointer-events-auto touch-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative">
        {/* Cross-shaped joystick (D-pad) */}
        <div className="relative w-32 h-32">
          {/* Connecting cross background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 bg-white/5 backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-l border-r border-white/10" />
          {showVertical && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-t border-b border-white/10" />
          )}

          {/* Center button - collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(true)
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-[#0a0a0a] rounded-full"
            aria-label="Collapse joystick"
          >
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Up button */}
          {showVertical && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigateUp()
              }}
              disabled={!canNavigateUp || isTransitioning}
              className="absolute top-0 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-transparent text-white transition-all hover:bg-white hover:text-[#0a0a0a] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed"
              aria-label="Navigate up"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}

          {/* Down button */}
          {showVertical && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigateDown()
              }}
              disabled={!canNavigateDown || isTransitioning}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-transparent text-white transition-all hover:bg-white hover:text-[#0a0a0a] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed"
              aria-label="Navigate down"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          )}

          {/* Left button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigateLeft()
            }}
            disabled={!canNavigateLeft || isTransitioning}
            className="absolute top-1/2 left-0 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-transparent text-white transition-all hover:bg-white hover:text-[#0a0a0a] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed"
            aria-label="Navigate left"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Right button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigateRight()
            }}
            disabled={!canNavigateRight || isTransitioning}
            className="absolute top-1/2 right-0 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-white text-[#0a0a0a] transition-all hover:bg-transparent hover:text-white hover:border-white disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-[#0a0a0a] disabled:cursor-not-allowed"
            aria-label="Navigate right"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
