"use client"

import Image from "next/image"
import { useState } from "react"
import { getGalleryImageUrl, GALLERY } from "@/lib/supabase-urls"
import { PhotoGalleryLightbox } from "@/components/photo-gallery-lightbox"

interface PhotosSectionProps {
  isActive: boolean
}

// Generar fotos de galería (conjuntas)
const photos = Array.from({ length: GALLERY.imageCount }, (_, i) => ({
  id: i + 1,
  src: getGalleryImageUrl(i + 1),
  title: `Galería - Foto ${i + 1}`,
  category: "El Colectivo"
}))

const photosForLightbox = photos.map((p) => ({ src: p.src, title: p.title }))

export function PhotosSection({ isActive }: PhotosSectionProps) {
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <section className="relative h-full w-full flex-shrink-0 bg-[#0a0a0a] overflow-hidden">
      <div className="h-full min-h-0 flex flex-col p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        {/* Header */}
        <div 
          className={`shrink-0 mb-8 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[#9AD9B0] uppercase mb-2">
            Archivo Fotografico
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white">
            Photos
          </h2>
        </div>

        {/* Photos masonry grid — con scroll para ver todas las fotos */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 content-start">
            {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={`group relative cursor-pointer overflow-hidden transition-all duration-700 text-left aspect-square w-full ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              } ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onMouseEnter={() => setHoveredPhoto(photo.id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  hoveredPhoto === photo.id ? "scale-105" : "scale-100"
                }`}
                unoptimized
              />
              {/* Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Info */}
              <div 
                className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                  hoveredPhoto === photo.id 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
              >
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#9AD9B0] uppercase">
                  {photo.category}
                </p>
                <h3 className="font-serif text-lg text-white">
                  {photo.title}
                </h3>
              </div>
              {/* Corner accent */}
              <div 
                className={`absolute top-0 right-0 w-8 h-8 transition-all duration-300 ${
                  hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute top-0 right-0 w-full h-[2px] bg-[#9AD9B0]" />
                <div className="absolute top-0 right-0 h-full w-[2px] bg-[#9AD9B0]" />
              </div>
            </button>
          ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="shrink-0 mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase">
            Clic en una foto para ampliar · Flechas para navegar
          </p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#9AD9B0]" />
            <span className="font-mono text-[10px] text-[#9AD9B0]">03</span>
          </div>
        </div>
      </div>

      <PhotoGalleryLightbox
        photos={photosForLightbox}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={setSelectedIndex}
        unoptimized
      />
    </section>
  )
}
