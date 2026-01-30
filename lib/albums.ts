/**
 * Datos de álbumes compartidos entre la sección Álbumes y las salas individuales de artistas.
 */

export interface Album {
  id: number
  title: string
  artist: string
  year: string
  image: string
  color: string
  playlistName: string
  /** slug del artista principal(es): "grioth" | "kiro" | "grioth-kiro" para colaboraciones */
  artistSlug?: "grioth" | "kiro" | "grioth-kiro"
}

export const ALBUMS: Album[] = [
  {
    id: 1,
    title: "Guateke",
    artist: "Grioth & Kiro",
    year: "2022",
    image: "/images/covers/guateke-cover.png",
    color: "#F25835",
    playlistName: "Guateke",
    artistSlug: "grioth-kiro",
  },
  {
    id: 2,
    title: "Probando la Sopa",
    artist: "Grioth",
    year: "2023",
    image: "/images/covers/probando-la-sopa.jpeg",
    color: "#F29422",
    playlistName: "Probando la Sopa",
    artistSlug: "grioth",
  },
  {
    id: 3,
    title: "KITDROGA-EP",
    artist: "Kiro",
    year: "2024",
    image: "/images/covers/kitdroga-ep.jpg",
    color: "#9AD9B0",
    playlistName: "KITDROGA-EP",
    artistSlug: "kiro",
  },
  {
    id: 4,
    title: "Con mas ganas de hacer rap que de trabajar",
    artist: "Grioth & Kiro",
    year: "2024",
    image: "/images/covers/cubanitos-cover.png",
    color: "#F25835",
    playlistName: "Con mas ganas de hacer rap que de trabajar",
    artistSlug: "grioth-kiro",
  },
]

/** Álbumes individuales de Grioth */
export function getGriothAlbums(): Album[] {
  return ALBUMS.filter((a) => a.artistSlug === "grioth")
}

/** Álbumes individuales de Kiro */
export function getKiroAlbums(): Album[] {
  return ALBUMS.filter((a) => a.artistSlug === "kiro")
}

/** Colaboraciones (Grioth & Kiro) */
export function getCollaborationAlbums(): Album[] {
  return ALBUMS.filter((a) => a.artistSlug === "grioth-kiro")
}

/** Para una sala de artista: sus álbumes individuales + colaboraciones */
export function getAlbumsForArtist(artistId: "grioth" | "kiro"): {
  individual: Album[]
  collaborations: Album[]
} {
  const individual = ALBUMS.filter((a) => a.artistSlug === artistId)
  const collaborations = getCollaborationAlbums()
  return { individual, collaborations }
}

export type ArtistId = "grioth" | "kiro"

/** Artistas que participan en un álbum (para enlazar a sus salas). */
export function getArtistIdsFromAlbum(album: Album): ArtistId[] {
  if (!album.artistSlug) return []
  if (album.artistSlug === "grioth-kiro") return ["grioth", "kiro"]
  return [album.artistSlug]
}
