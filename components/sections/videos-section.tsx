"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface VideosSectionProps {
  isActive: boolean
}

const videos = [
  {
    id: 1,
    title: "Cubanitos - Video Oficial",
    duration: "3:28",
    thumbnail: "/images/cubanitos-cover.png",
    views: "12.4K"
  },
  {
    id: 2,
    title: "Probando la Sopa - Live Session",
    duration: "15:42",
    thumbnail: "/images/probando-la-sopa.png",
    views: "8.2K"
  },
  {
    id: 3,
    title: "El Colectivo - Documentary",
    duration: "24:18",
    thumbnail: "/images/guateke-cover.png",
    views: "5.7K"
  },
]

export function VideosSection({ isActive }: VideosSectionProps) {
  return (
    <section className="relative h-full w-full flex-shrink-0 bg-[#0a0a0a]">
      <div className="h-full flex flex-col p-8 md:p-12 lg:p-16">
        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
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

        {/* Videos grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`group relative cursor-pointer transition-all duration-700 ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 font-mono text-xs text-white">
                  {video.duration}
                </div>
                {/* Accent corner */}
                <div className="absolute top-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F25835]" />
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-[#F25835]" />
                </div>
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="font-serif text-lg text-white group-hover:text-[#F25835] transition-colors">
                  {video.title}
                </h3>
                <p className="font-mono text-[10px] text-white/40 mt-1">
                  {video.views} views
                </p>
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
            <span className="w-8 h-[1px] bg-[#F25835]" />
            <span className="font-mono text-[10px] text-[#F25835]">01</span>
          </div>
        </div>
      </div>
    </section>
  )
}
