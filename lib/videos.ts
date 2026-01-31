/**
 * Configuración de videos: exclusivos (plataforma) y YouTube.
 */

import { getGalleryVideoUrl, getGalleryImageUrl, GALLERY } from "./supabase-urls"

export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  /** URL del video (plataforma) o ID de YouTube para embed */
  videoUrl?: string
  youtubeId?: string
  album?: string
}

/** Videos alojados en nuestra plataforma (Supabase) */
export const EXCLUSIVE_VIDEOS: VideoItem[] = Array.from({ length: GALLERY.videoCount }, (_, i) => ({
  id: `exclusive-${i + 1}`,
  title: `Galería - Video ${i + 1}`,
  thumbnail: getGalleryImageUrl(i + 1),
  videoUrl: getGalleryVideoUrl(i + 1),
}))

/** Videos de YouTube (videoclips, estrenos, etc.) */
export const YOUTUBE_VIDEOS: VideoItem[] = [
  {
    id: "youtube-eyo",
    title: "E.Y.O - Videoclip Oficial",
    thumbnail: "https://img.youtube.com/vi/Nip7axa9Uf8/maxresdefault.jpg",
    youtubeId: "Nip7axa9Uf8",
    album: "Guateke",
  },
]
