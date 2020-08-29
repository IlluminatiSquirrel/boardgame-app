import React, { useState, useEffect } from 'react';
import { Boardgame } from '../../interfaces/Boardgame.interface';
import './BoardgamesListItem.scss';
import { addToWishlist, removeFromWishlist } from '../../shared/local-storage/local-storage-util';

type Props = {
  boardgame: Boardgame
}

function Rating({ rating }: { rating: string | undefined }) {
  function getRating(): string | number {
    if (rating && rating !== '0') {
      return +parseFloat(rating).toFixed(2);
    }
    return '--';
  }

  return (
    <div className="grid-item rating">
      <span>Rating</span>
      <span>{getRating()}</span>
    </div>
  );
}

function Weight({ weight }: { weight: string | undefined }) {
  function getWeight(): string {
    if (weight && weight !== '0') {
      return `${+parseFloat(weight).toFixed(2)} / 5`;
    }
    return '--';
  }

  return (
    <div className="grid-item weight">
      <span>Weight</span>
      <span>{getWeight()}</span>
    </div>
  );
}

function PlayerNumber({ minPlayers, maxPlayers }: { minPlayers: string | undefined, maxPlayers: string | undefined }) {
  return (
    <div className="grid-item player-number">
      <span>Players</span>
      {minPlayers !== maxPlayers
        ? <span>{`${minPlayers} - ${maxPlayers}`}</span>
        : <span>{`${minPlayers}`}</span>}
    </div>
  );
}

function Playtime({ minPlaytime, maxPlaytime }: { minPlaytime: string | undefined, maxPlaytime: string | undefined }) {
  return (
    <div className="grid-item playtime">
      <span>Playtime</span>
      {minPlaytime !== maxPlaytime
        ? <span>{`${minPlaytime} - ${maxPlaytime} min`}</span>
        : <span>{`${minPlaytime} min`}</span>}
    </div>
  );
}

function Price({ priceUrl, price }: { priceUrl: string | undefined, price: string | undefined }) {
  return (
    <div className="price">
      {priceUrl && price
        ? (
          <>
            <span className="best-available-price-header">Best availaible price</span>
            <a href={priceUrl} title="Visit boardgameprices.co.uk to find out more">
              {(+price).toLocaleString(undefined, { style: 'currency', currency: 'GBP' })}
            </a>
          </>
        )
        : <span className="unknown-price" title="Information unavailble"> -- </span>}
    </div>
  );
}

function WishlistButton({ isWishlisted, onAddClick, onRemoveClick }: { isWishlisted: boolean, onAddClick: () => void, onRemoveClick: () => void }) {
  if (isWishlisted) {
    return (
      <button
        className="on-wishlist-button"
        type="button"
        onClick={() => onRemoveClick()}
      >
        <i className="fas fa-check-square" />
        <span>On wishlist</span>
      </button>
    );
  }
  return (
    <button
      className="add-to-wishlist-button"
      type="button"
      onClick={() => onAddClick()}
    >
      <i className="fas fa-heart" />
      <span>Add to wishlist</span>
    </button>
  );
}

export default function BoardgamesListItem({ boardgame }: Props) {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  useEffect(() => {
    setIsWishlisted(boardgame.wishlisted ? boardgame.wishlisted : false);
  }, []);

  function handleAdd() {
    setIsWishlisted(true);
    addToWishlist(boardgame);
  }

  function handleRemove() {
    setIsWishlisted(false);
    removeFromWishlist(boardgame);
  }

  return (
    <li className="boardgame-container">
      <img className="boardgame-image" alt="boardgame-thumbnail" src={boardgame.thumbnail} />
      <div className="boardgame-description">
        <div className="boardgame-name" title={boardgame.name}>{boardgame.name}</div>
        <div className="boardgame-extra-details">
          <Rating rating={boardgame.rating} />
          <Weight weight={boardgame.weight} />
          <PlayerNumber minPlayers={boardgame.minPlayers} maxPlayers={boardgame.maxPlayers} />
          <Playtime minPlaytime={boardgame.minPlaytime} maxPlaytime={boardgame.maxPlaytime} />
        </div>
      </div>
      <div className="boardgame-price">
        <span className="price-header">Buying options</span>
        <Price priceUrl={boardgame.priceUrl} price={boardgame.price} />
      </div>
      <div className="menu-container">
        <WishlistButton
          isWishlisted={isWishlisted}
          onAddClick={handleAdd}
          onRemoveClick={handleRemove}
        />
      </div>
    </li>
  );
}
