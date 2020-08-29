import React from 'react';
import { getWishlistedBoardgames } from '../../shared/local-storage/local-storage-util';
import { Boardgame } from '../../interfaces/Boardgame.interface';
import BoardgamesListItem from '../BoardgamesListItem/BoardgamesListItem';

export default function Wishlist() {
  const boardgames: Boardgame[] = getWishlistedBoardgames();

  return (
    <ul className="boardgame-list-container">
      {boardgames?.map((boardgame: Boardgame) => (
        <BoardgamesListItem key={boardgame.id} boardgame={boardgame} />
      ))}
    </ul>
  );
}
