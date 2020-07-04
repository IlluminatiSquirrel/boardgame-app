import React from 'react';
import { Boardgame } from '../../interfaces/Boardgame.interface';
import './BoardgamesListItem.scss';

interface Props {
  boardgame: Boardgame
}

function Rating({ rating }: { rating: string | undefined }) {
  return (
    <div className="grid-item rating">
      <span>Rating</span>
      <span>{rating ? +parseFloat(rating).toFixed(2) : '?'}</span>
    </div>
  );
}

function Weight({ weight }: { weight: string | undefined }) {
  return (
    <div className="grid-item weight">
      <span>Weight</span>
      <span>{weight ? `${+parseFloat(weight).toFixed(2)} / 5` : '?'}</span>
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
      {priceUrl
        ? (
          <>
            <span className="best-available-price-header">Best availaible price</span>
            <a href={priceUrl} title="Visit boardgameprices.co.uk to find out more">{`£${price}`}</a>
          </>
        )
        : <span className="unknown-price" title="Price is unknown"> ? </span>}
    </div>
  );
}

export default function BoardgamesListItem({ boardgame }: Props) {
  return (
    <li className="boardgame-container">
      <img className="boardgame-image" alt="boardgame-thumbnail" src={boardgame.thumbnail} />
      <div className="boardgame-description">
        <div className="boardgame-name">{boardgame.name}</div>
        <div className="boardgame-extra-details">
          <Rating rating={boardgame.rating} />
          <Weight weight={boardgame.weight} />
          <PlayerNumber minPlayers={boardgame.minPlayers} maxPlayers={boardgame.maxPlayers} />
          <Playtime minPlaytime={boardgame.minPlaytime} maxPlaytime={boardgame.maxPlaytime} />
        </div>
      </div>
      <div className="boardgame-prices-container">
        <span className="price-header">Buying options</span>
        <Price priceUrl={boardgame.priceUrl} price={boardgame.price} />
      </div>
    </li>
  );
}
