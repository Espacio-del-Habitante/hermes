"use client"

import Image from "next/image"
import { useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export interface PhotoGalleryItem {
  src: string
  title: string
}

interface PhotoGalleryLightboxProps {
  /** Lista de fotos. */
  photos: PhotoGalleryItem[]
  /** Índice de la foto mostrada; null = cerrado. */
  selectedIndex: number | null
  /** Cerrar el visor. */
  onClose: () => void
  /** Cambiar a otra foto por índice (para prev/next). */
  onSelectIndex: (index: number) => void
  /** Usar unoptimized en Image (para URLs externas/Supabase). */
  unoptimized?: boolean
}

export function PhotoGalleryLightbox({
  photos,
  selectedIndex,
  onClose,
  onSelectIndex,
  unoptimized = false,
}: PhotoGalleryLightboxProps) {
  const total = photos.length
  const currentIndex = selectedIndex ?? 0

  const goPrev = useCallback(() => {
    const next = currentIndex <= 0 ? total - 1 : currentIndex - 1
    onSelectIndex(next)
  }, [currentIndex, total, onSelectIndex])

  const goNext = useCallback(() => {
    const next = currentIndex >= total - 1 ? 0 : currentIndex + 1
    onSelectIndex(next)
  }, [currentIndex, total, onSelectIndex])

  useEffect(() => {
    if (selectedIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedIndex, onClose, goPrev, goNext])

  if (selectedIndex === null || total === 0 || typeof document === "undefined") return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] animate-in fade-in-0 duration-200"
      style={{ isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
      aria-label="Vista de foto"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0a0a0a] cursor-default z-0"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          goPrev()
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 md:p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="h-8 w-8 md:h-9 md:w-9" />
      </button>
      <div
        className="relative w-[calc(100vw-8rem)] max-w-4xl h-[75vh] md:h-[80vh] flex items-center justify-center px-4 z-10"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <Image
          src={photos[currentIndex].src}
          alt={photos[currentIndex].title}
          fill
          className="object-contain select-none"
          unoptimized={unoptimized}
          priority
          sizes="(max-width: 896px) calc(100vw - 8rem), 896px"
          draggable={false}
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          goNext()
        }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 md:p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
        aria-label="Foto siguiente"
      >
        <ChevronRight className="h-8 w-8 md:h-9 md:w-9" />
      </button>
      <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-1.5 text-center pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#9AD9B0] uppercase">
          {currentIndex + 1} / {total}
        </p>
        <p className="font-serif text-sm text-white/80">{photos[currentIndex].title}</p>
      </div>
    </div>,
    document.body
  )
}
