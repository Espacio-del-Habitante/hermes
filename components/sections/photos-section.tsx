"use client"

import Image from "next/image"
import { useState } from "react"

interface PhotosSectionProps {
  isActive: boolean
}

const photos = [
  { id: 1, src: "/images/guateke-cover.png", title: "Guateke Crew", category: "Retratos" },
  { id: 2, src: "/images/probando-la-sopa.png", title: "Arte Urbano", category: "Arte" },
  { id: 3, src: "/images/cubanitos-cover.png", title: "Sesion Cubanitos", category: "Detras de Camaras" },
  { id: 4, src: "/images/cuadro-removebg-preview.png", title: "La Obra", category: "Arte" },
]

export function PhotosSection({ isActive }: PhotosSectionProps) {
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  return (
    <section className="relative h-full w-full flex-shrink-0 bg-[#0a0a0a]">
      <div className="h-full flex flex-col p-8 md:p-12 lg:p-16">
        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
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

        {/* Photos masonry grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`group relative cursor-pointer overflow-hidden transition-all duration-700 ${
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
                src={photo.src || "/placeholder.svg"}
                alt={photo.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  hoveredPhoto === photo.id ? "scale-105" : "scale-100"
                }`}
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
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase">
            Scroll up to return
          </p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#9AD9B0]" />
            <span className="font-mono text-[10px] text-[#9AD9B0]">03</span>
          </div>
        </div>
      </div>
    </section>
  )
}
