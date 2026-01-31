"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { getGalleryVideoUrl, getGalleryImageUrl, GALLERY } from "@/lib/supabase-urls"
import { useState, useRef, useEffect } from "react"
import { VideoGalleryLightbox } from "@/components/video-gallery-lightbox"

interface VideosSectionProps {
  isActive: boolean
}

// Generar videos de galería
const videos = Array.from({ length: GALLERY.videoCount }, (_, i) => ({
  id: i + 1,
  title: `Galería - Video ${i + 1}`,
  duration: "0:00",
  thumbnail: getGalleryImageUrl(i + 1),
  videoUrl: getGalleryVideoUrl(i + 1),
  views: "0",
}))

const videosForLightbox = videos.map((v) => ({
  title: v.title,
  videoUrl: v.videoUrl,
  thumbnail: v.thumbnail,
}))

export function VideosSection({ isActive }: VideosSectionProps) {
  /** Índice del video seleccionado en el visor; null = vista grid */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isActive])

  return (
    <section className="relative h-full w-full flex-shrink-0 bg-[#0a0a0a] overflow-hidden">
      <div className="h-full min-h-0 flex flex-col p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        {/* Header */}
        <div 
          className={`shrink-0 mb-8 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[#F25835] uppercase mb-2">
            El Sonido del Futuro
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white">
            Videos
          </h2>
        </div>

        {/* Videos grid — con scroll para ver todos */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <button
              type="button"
              key={video.id}
              onClick={() => setSelectedIndex(index)}
              className={`group relative cursor-pointer transition-all duration-700 text-left ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F25835]" />
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-[#F25835]" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-lg text-white group-hover:text-[#F25835] transition-colors">
                  {video.title}
                </h3>
                <p className="font-mono text-[10px] text-white/40 mt-1">
                  {video.views} views
                </p>
              </div>
            </button>
          ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="shrink-0 mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase">
            Clic en un video para ampliar · Flechas para navegar
          </p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#F25835]" />
            <span className="font-mono text-[10px] text-[#F25835]">01</span>
          </div>
        </div>
      </div>

      <VideoGalleryLightbox
        videos={videosForLightbox}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={setSelectedIndex}
      />
    </section>
  )
}
