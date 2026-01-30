/**
 * Utilidades para generar URLs de Supabase Storage
 */

const SUPABASE_BASE_URL = "https://fblvewuvncyazppsnnsp.supabase.co/storage/v1/object/public/hermes"

/**
 * Genera URL de imagen de artista
 */
export function getArtistImageUrl(artistSlug: string, imageNumber: number): string {
  return `${SUPABASE_BASE_URL}/images/artists/${artistSlug}/${artistSlug}-${String(imageNumber).padStart(2, '0')}.jpeg`
}

/**
 * Genera URL de imagen de galería (conjunta)
 */
export function getGalleryImageUrl(imageNumber: number): string {
  return `${SUPABASE_BASE_URL}/images/galery/gallery-${String(imageNumber).padStart(2, '0')}.jpeg`
}

/**
 * Genera URL de video de galería
 */
export function getGalleryVideoUrl(videoNumber: number): string {
  return `${SUPABASE_BASE_URL}/videos/galery/gallery-${String(videoNumber).padStart(2, '0')}.mp4`
}

/**
 * Información de artistas disponibles
 */
export const ARTISTS = {
  grioth: {
    slug: "grioth",
    name: "Grioth",
    imageCount: 7,
  },
  kiro: {
    slug: "kiro",
    name: "Kiro",
    imageCount: 16,
  },
} as const

/**
 * Información de galería (conjunta)
 */
export const GALLERY = {
  imageCount: 8,
  videoCount: 5,
} as const
