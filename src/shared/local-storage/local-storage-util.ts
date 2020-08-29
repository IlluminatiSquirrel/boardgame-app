import { Boardgame } from '../../interfaces/Boardgame.interface';

export function addToWishlist(boardgame: Boardgame): void {
  const storage = window.localStorage;
  const storageItem = storage.getItem('wishlist');
  if (storageItem) {
    const newWishlist: Boardgame[] = JSON.parse(storageItem);
    newWishlist.push(boardgame);
    storage.setItem('wishlist', JSON.stringify(newWishlist));
  } else {
    storage.setItem('wishlist', JSON.stringify([boardgame]));
  }
}

export function removeFromWishlist(boardgame: Boardgame): void {
  const storage = window.localStorage;
  const storageItem = storage.getItem('wishlist');
  if (storageItem) {
    const newWishlist: Boardgame[] = JSON.parse(storageItem);
    const removedBoardgameIndex = newWishlist.findIndex((wishlistBoardgame) => wishlistBoardgame.id === boardgame.id);
    newWishlist.splice(removedBoardgameIndex, 1);
    storage.setItem('wishlist', JSON.stringify(newWishlist));
  } else {
    storage.setItem('wishlist', JSON.stringify([boardgame]));
  }
}

export function getWishlistedBoardgames() {
  const wishlistedBoardgamesList: string | null = window.localStorage.getItem('wishlist');
  if (wishlistedBoardgamesList) {
    return JSON.parse(wishlistedBoardgamesList);
  }
  return null;
}

export function getWishlistedBoardgameIds(): string[] {
  const wishlistedBoardgamesList: string | null = window.localStorage.getItem('wishlist');
  if (wishlistedBoardgamesList) {
    return JSON.parse(wishlistedBoardgamesList).map((boardame: Boardgame) => boardame.id);
  }
  return [];
}
