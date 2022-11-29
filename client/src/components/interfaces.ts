export interface Letter {
  id: string;
  value: string;
  selected?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  playerName: string;
  turnNow?: boolean;
}