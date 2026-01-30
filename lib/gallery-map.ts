/**
 * Mapa espacial de la galería: como caminar por un museo.
 * Filas y columnas = salas. Navegación arriba/abajo/izq/der según conexiones.
 */

export type GalleryRoomId =
  | "inicio"
  | "artistas"
  | "lanzamientos"
  | "albumes"
  | "videos"
  | "film"
  | "photos"

export interface GridPosition {
  row: number
  col: number
}

/** Qué sala hay en cada celda (row, col). Fila 0 = pasillo principal, fila 1 = salas abajo. */
export const ROOM_AT_GRID: Record<number, Record<number, GalleryRoomId>> = {
  0: { 0: "inicio", 1: "artistas", 2: "lanzamientos", 3: "albumes" },
  1: { 0: "videos", 1: "film", 2: "photos" },
}

/** Posición en grid de cada sala (para ir a una sala por nombre). */
export const GRID_AT_ROOM: Record<GalleryRoomId, GridPosition> = {
  inicio: { row: 0, col: 0 },
  artistas: { row: 0, col: 1 },
  lanzamientos: { row: 0, col: 2 },
  albumes: { row: 0, col: 3 },
  videos: { row: 1, col: 0 },
  film: { row: 1, col: 1 },
  photos: { row: 1, col: 2 },
}

const GRID_COLS = 4
const GRID_ROWS = 2

export function getRoomAt(row: number, col: number): GalleryRoomId | null {
  const rowMap = ROOM_AT_GRID[row]
  if (!rowMap) return null
  return rowMap[col] ?? null
}

export function getPosition(room: GalleryRoomId): GridPosition {
  return GRID_AT_ROOM[room]
}

/** Dirección de movimiento. */
export type Direction = "up" | "down" | "left" | "right"

/**
 * Dado (row, col) y una dirección, devuelve la siguiente (row, col) si hay sala, o null.
 */
export function getNextPosition(
  row: number,
  col: number,
  direction: Direction
): GridPosition | null {
  let nextRow = row
  let nextCol = col
  switch (direction) {
    case "up":
      nextRow = row - 1
      break
    case "down":
      nextRow = row + 1
      break
    case "left":
      nextCol = col - 1
      break
    case "right":
      nextCol = col + 1
      break
  }
  if (nextRow < 0 || nextRow >= GRID_ROWS || nextCol < 0 || nextCol >= GRID_COLS)
    return null
  const room = getRoomAt(nextRow, nextCol)
  if (!room) return null
  return { row: nextRow, col: nextCol }
}

export function canNavigate(
  row: number,
  col: number,
  direction: Direction
): boolean {
  return getNextPosition(row, col, direction) !== null
}

export const GRID_COLUMNS = GRID_COLS
export const GRID_ROW_COUNT = GRID_ROWS
