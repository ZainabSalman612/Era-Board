export interface Era {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface BoardItem {
  id: string;
  eraId: string;
  type: "image" | "note" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  // Image fields
  imageUrl?: string;
  // Note fields
  title?: string;
  content?: string;
  noteColor?: string;
  textColor?: string;
  createdAt: number;
}

export const NOTE_COLORS = [
  "#2c4251", // Dark Navy
  "#6b95ab", // Muted Blue
  "#d3a8cc", // Soft Pink
  "#f1f1f1", // Off-White
  "#ffffff", // White
] as const;

export const TEXT_COLORS = [
  "#2c4251", // Dark Navy
  "#6b95ab", // Muted Blue
  "#d3a8cc", // Soft Pink
  "#f1f1f1", // Off-White
  "#ffffff", // White
] as const;

export const ERA_COLORS = [
  "#2c4251", // Dark Navy
  "#6b95ab", // Muted Blue
  "#d3a8cc", // Soft Pink
] as const;
