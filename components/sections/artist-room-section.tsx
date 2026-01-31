"use client"

import Image from "next/image"
import { useState, useMemo, useRef, useEffect } from "react"
import { getArtistImageUrl, ARTISTS, type ArtistRoomId } from "@/lib/supabase-urls"
import { getAlbumsForArtist, type Album } from "@/lib/albums"
import { PhotoGalleryLightbox } from "@/components/photo-gallery-lightbox"
import { ArrowLeft, Lock } from "lucide-react"

/** Placeholder "Próximamente" — estilo candado bloqueado (como en artistas). */
function ProximamentePlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="group relative aspect-video overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.6)_0%,rgba(10,10,10,0.95)_70%,#080808_100%)]" />
          {/* Overlay oscuro al hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 pointer-events-none" />
          {/* Candado — grande, sutil, más visible al hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Lock className="w-[40%] h-[40%] max-w-24 max-h-24 text-white/[0.08] group-hover:text-white/[0.16] transition-all duration-300" strokeWidth={1} />
          </div>
          {/* Próximamente abajo */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Próximamente</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function AlbumCard({
  album,
  isActive,
  index,
  onPlay,
}: {
  album: Album
  isActive: boolean
  index: number
  onPlay: (album: Album) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(album)}
      className={`group relative aspect-square overflow-hidden bg-[#1a1a1a] text-left transition-all duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F25835] ${
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${100 + index * 80}ms` }}
    >
      <Image
        src={album.image}
        alt={album.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
      <div
        className="absolute top-0 right-0 w-7 h-7 md:w-9 md:h-9 border-t-2 border-r-2 transition-colors duration-300 group-hover:border-[#F25835]"
        style={{ borderColor: album.color }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
        <p className="font-mono text-[10px] tracking-[0.15em] text-white/60 uppercase truncate">
          {album.year} · {album.artist}
        </p>
        <h3
          className="font-serif text-sm md:text-lg italic mt-1 group-hover:text-[#F25835] transition-colors truncate"
          style={{ color: album.color }}
        >
          {album.title}
        </h3>
      </div>
    </button>
  )
}

interface ArtistRoomSectionProps {
  isActive: boolean
  artistId: ArtistRoomId
  onNavigateBack: () => void
  /** Al hacer clic en un álbum, ir a la sección Álbumes con este álbum seleccionado. */
  onNavigateToAlbum?: (albumId: number) => void
}

type Section = "albumes" | "colaboraciones" | "fotografias" | "arte-visual" | "contenido-extra"

export function ArtistRoomSection({ isActive, artistId, onNavigateBack, onNavigateToAlbum }: ArtistRoomSectionProps) {
  const [activeSection, setActiveSection] = useState<Section>("albumes")
  const artist = ARTISTS[artistId]
  const { individual, collaborations } = getAlbumsForArtist(artistId)
  const isComingSoon = artist.imageCount === 0

  const sections: { id: Section; label: string }[] = [
    { id: "albumes", label: "Álbumes / Música" },
    { id: "colaboraciones", label: "Colaboraciones" },
    { id: "fotografias", label: "Fotografías" },
    { id: "arte-visual", label: "Arte Visual" },
    { id: "contenido-extra", label: "Contenido Extra" },
  ]

  const artistImages = Array.from({ length: artist.imageCount }, (_, i) => i + 1)
  const [selectedPhotoIndexFotografias, setSelectedPhotoIndexFotografias] = useState<number | null>(null)
  const [selectedPhotoIndexArteVisual, setSelectedPhotoIndexArteVisual] = useState<number | null>(null)

  const photosFotografias = useMemo(
    () =>
      artistImages.map((num) => ({
        src: getArtistImageUrl(artistId, num),
        title: `${artist.name} - Foto ${num}`,
      })),
    [artistId, artist.name, artist.imageCount]
  )
  const photosArteVisual = useMemo(
    () =>
      artistImages.slice(0, 6).map((num) => ({
        src: getArtistImageUrl(artistId, num),
        title: `${artist.name} - Arte Visual ${num}`,
      })),
    [artistId, artist.name, artist.imageCount]
  )

  const handleAlbumClick = (album: Album) => {
    onNavigateToAlbum?.(album.id)
    if (typeof window !== "undefined" && (window as any).playPlaylist) {
      (window as any).playPlaylist(album.playlistName)
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (isActive && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [isActive])

  // Detectar scroll para colapsar el hero en móvil
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      setIsScrolled(scrollTop > 50) // Cambiar a estado colapsado después de 50px de scroll
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-full w-screen flex-shrink-0 bg-[#0a0a0a] overflow-hidden">
      <div className="h-full min-h-0 flex flex-col">
        {/* Hero Image - Mobile only, colapsable al hacer scroll */}
        <div 
          ref={heroRef}
          className={`relative md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isScrolled ? 'h-20' : 'h-48 sm:h-56'
          }`}
        >
          <Image
            src={getArtistImageUrl(artistId, 1)}
            alt={artist.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isScrolled ? 'scale-110' : 'scale-100'
            }`}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          {/* Botón de regreso sobre la imagen */}
          <button
            onClick={onNavigateBack}
            className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/50 backdrop-blur-sm rounded border border-white/20 text-white/80 hover:text-white hover:bg-black/70 transition-all group ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isScrolled ? 'scale-90' : 'scale-100'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <ArrowLeft className={`transition-all ${isScrolled ? 'h-3 w-3' : 'h-3.5 w-3.5'} group-hover:-translate-x-1`} />
            <span className={`font-mono tracking-[0.15em] uppercase transition-all ${
              isScrolled ? 'text-[9px] opacity-0 w-0' : 'text-[10px] opacity-100 w-auto'
            }`}>Volver</span>
          </button>
          {/* Nombre del artista sobre la imagen */}
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            isScrolled ? 'p-2' : 'p-4'
          } ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {!isScrolled && (
              <p className="font-mono text-[9px] tracking-[0.2em] text-[#F25835] uppercase mb-1">
                Sala Individual
              </p>
            )}
            <h2 className={`font-serif italic text-white transition-all ${
              isScrolled ? 'text-xl' : 'text-3xl'
            }`}>
              {artist.name}
            </h2>
          </div>
        </div>

        {/* Header con botón de regreso - Desktop only */}
        <div 
          className={`hidden md:block shrink-0 pt-12 md:pt-24 px-4 sm:px-6 md:p-8 lg:p-12 mb-8 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 mb-6 text-white/50 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">Volver</span>
          </button>
          
          <p className="font-mono text-xs tracking-[0.3em] text-[#F25835] uppercase mb-2">
            Sala Individual
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic text-white">
            {artist.name}
          </h2>
        </div>

        {/* Navegación de secciones - Mobile: horizontal scroll, Desktop: normal */}
        <div className="shrink-0 px-4 sm:px-6 md:px-8 lg:px-12 mb-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 border-b border-white/10 md:flex-wrap md:overflow-x-visible">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.15em] uppercase transition-all duration-300 pb-2 border-b-2 whitespace-nowrap flex-shrink-0 ${
                  activeSection === section.id
                    ? "text-[#F25835] border-[#F25835]"
                    : "text-white/40 border-transparent hover:text-white/70 active:text-white/70"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido con padding */}
        <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 md:px-8 lg:p-12">

          {/* Contenido de secciones — con scroll para ver todas las fotos/álbumes/etc. */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 pb-20 sm:pb-12 md:pb-0">
          {activeSection === "albumes" && (
            <div 
              className={`transition-all duration-700 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-white/50 mb-6">
                Discografía y material musical de {artist.name}
              </p>

              {isComingSoon ? (
                <ProximamentePlaceholder />
              ) : (
                <>
              {/* Álbumes individuales */}
              {individual.length > 0 && (
                <div className="mb-10">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#F25835] uppercase mb-4">
                    Solo
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {individual.map((album, index) => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        isActive={isActive}
                        index={index}
                        onPlay={handleAlbumClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Colaboraciones */}
              {collaborations.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#9AD9B0] uppercase mb-4">
                    Colaboraciones
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {collaborations.map((album, index) => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        isActive={isActive}
                        index={individual.length + index}
                        onPlay={handleAlbumClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {individual.length === 0 && collaborations.length === 0 && (
                <div className="aspect-square max-w-xs bg-[#1a1a1a] flex items-center justify-center">
                  <p className="font-mono text-xs text-white/30 uppercase">Próximamente</p>
                </div>
              )}
                </>
              )}
            </div>
          )}

          {activeSection === "colaboraciones" && (
            <div 
              className={`transition-all duration-700 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-white/50 mb-6">
                Proyectos en conjunto de {artist.name} con otros artistas
              </p>
              {isComingSoon ? (
                <ProximamentePlaceholder />
              ) : collaborations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {collaborations.map((album, index) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      isActive={isActive}
                      index={index}
                      onPlay={handleAlbumClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="aspect-square max-w-xs bg-[#1a1a1a] flex items-center justify-center">
                  <p className="font-mono text-xs text-white/30 uppercase">Sin colaboraciones aún</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "fotografias" && (
            <div 
              className={`transition-all duration-700 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-white/50 mb-6">
                Registro fotográfico de {artist.name}
              </p>
              {isComingSoon ? (
                <ProximamentePlaceholder />
              ) : (
                <>
              <p className="font-mono text-[10px] text-white/30 uppercase mb-4">
                Clic en una foto para ampliar · Flechas para navegar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {artistImages.map((num, index) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setSelectedPhotoIndexFotografias(index)}
                    className={`group relative aspect-square overflow-hidden bg-[#1a1a1a] cursor-pointer transition-all duration-700 text-left ${
                      isActive 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${100 + index * 50}ms` }}
                  >
                    <Image
                      src={getArtistImageUrl(artistId, num)}
                      alt={`${artist.name} - Foto ${num}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-mono text-[10px] text-white/80 uppercase">
                        Foto {num}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <PhotoGalleryLightbox
                photos={photosFotografias}
                selectedIndex={selectedPhotoIndexFotografias}
                onClose={() => setSelectedPhotoIndexFotografias(null)}
                onSelectIndex={setSelectedPhotoIndexFotografias}
                unoptimized
              />
                </>
              )}
            </div>
          )}

          {activeSection === "arte-visual" && (
            <div 
              className={`transition-all duration-700 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-white/50 mb-6">
                Portadas y contenido visual de {artist.name}
              </p>
              {isComingSoon ? (
                <ProximamentePlaceholder />
              ) : (
                <>
              <p className="font-mono text-[10px] text-white/30 uppercase mb-4">
                Clic en una imagen para ampliar · Flechas para navegar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistImages.slice(0, 6).map((num, index) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setSelectedPhotoIndexArteVisual(index)}
                    className={`group relative aspect-[4/3] overflow-hidden bg-[#1a1a1a] cursor-pointer transition-all duration-700 text-left ${
                      isActive 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${100 + index * 50}ms` }}
                  >
                    <Image
                      src={getArtistImageUrl(artistId, num)}
                      alt={`${artist.name} - Arte Visual ${num}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F25835] transition-colors duration-300" />
                  </button>
                ))}
              </div>
              <PhotoGalleryLightbox
                photos={photosArteVisual}
                selectedIndex={selectedPhotoIndexArteVisual}
                onClose={() => setSelectedPhotoIndexArteVisual(null)}
                onSelectIndex={setSelectedPhotoIndexArteVisual}
                unoptimized
              />
                </>
              )}
            </div>
          )}

          {activeSection === "contenido-extra" && (
            <div 
              className={`transition-all duration-700 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-white/50 mb-6">
                Reseñas, entrevistas y contenido extra de {artist.name}
              </p>
              <ProximamentePlaceholder />
            </div>
          )}
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-20 left-12 hidden md:block">
          <div className="flex items-center gap-4">
            <div className="w-16 h-[1px] bg-[#9AD9B0]" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#9AD9B0] uppercase">
              Cali, Colombia
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
