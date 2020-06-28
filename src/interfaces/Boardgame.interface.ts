export interface Boardgame {
  id: string;
  name?: string;
  thumbnail?: string;
  minPlayers?: string;
  maxPlayers?: string;
  minPlaytime?: string;
  maxPlaytime?: string;
  weight?: string;
  rating?: string;
  price?: string;
  priceUrl?: string;
}