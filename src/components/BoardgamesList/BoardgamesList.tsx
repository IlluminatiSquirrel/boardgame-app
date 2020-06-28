import React, { useEffect, useState } from 'react';
import './BoardgamesList.scss';
import { xml2js } from 'xml-js';

interface Boardgame {
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

export default function BoardgamesList() {
  const [boardgames, setBoardgames] = useState<ReadonlyArray<Boardgame>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotBoardgames = await (await fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames')).text();
        const idList = xml2js(hotBoardgames).elements[0].elements.map((element) => element.attributes.id);
        const boardgameDetailsResponse = await (await fetch(`http://127.0.0.1:8080/https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${idList}`)).text();

        const getBoardgamePricesPromise = async () => {
          const boardgamePricesUrl = `https://boardgameprices.co.uk/api/info?eid=${idList}&sitename=localhost:3000`;
          if ('caches' in window) {
            const cacheName = 'boardgame-prices-cache';
            const cache = await caches.open(cacheName);
            const cacheResponse = await cache.match(boardgamePricesUrl);
            if (cacheResponse) {
              return cacheResponse;
            }
            const boardgamePricesResponse = await fetch(boardgamePricesUrl);
            cache.put(boardgamePricesUrl, boardgamePricesResponse);
            const newCacheResponse = await cache.match(boardgamePricesUrl);
            if (newCacheResponse) {
              return newCacheResponse;
            }
          }
          return fetch(boardgamePricesUrl);
        };
        const boardgamePricesResponse = await (await getBoardgamePricesPromise()).json();
        parseResponses(boardgameDetailsResponse, boardgamePricesResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  function parseResponses(boardgameDetails, boardgamesPrices) {
    const boardgameDetailsJs = xml2js(boardgameDetails);
    console.log(boardgameDetailsJs);
    console.log(boardgamesPrices);
    const boardgamesList = boardgameDetailsJs.elements[0].elements.map((boardgame) => {
      const boardgameObj: Boardgame = {
        id: boardgame.attributes.id,
      };
      boardgame.elements.forEach((boardgameProperty) => {
        if (boardgameProperty.name === 'thumbnail') {
          boardgameObj.thumbnail = boardgameProperty.elements[0].text;
        } else if (boardgameProperty.name === 'name' && boardgameProperty.attributes.type === 'primary') {
          boardgameObj.name = boardgameProperty.attributes.value;
        } else if (boardgameProperty.name === 'minplayers') {
          boardgameObj.minPlayers = boardgameProperty.attributes.value;
        } else if (boardgameProperty.name === 'maxplayers') {
          boardgameObj.maxPlayers = boardgameProperty.attributes.value;
        } else if (boardgameProperty.name === 'minplaytime') {
          boardgameObj.minPlaytime = boardgameProperty.attributes.value;
        } else if (boardgameProperty.name === 'maxplaytime') {
          boardgameObj.maxPlaytime = boardgameProperty.attributes.value;
        } else if (boardgameProperty.name === 'statistics') {
          boardgameProperty.elements[0].elements.forEach((boardgameStat) => {
            if (boardgameStat.name === 'average') {
              boardgameObj.rating = boardgameStat.attributes.value;
            } else if (boardgameStat.name === 'averageweight') {
              boardgameObj.weight = boardgameStat.attributes.value;
            }
          });
        }
      });
      const matchingBoardgame = boardgamesPrices.items.find((boardgameItem) => boardgameItem.external_id === boardgameObj.id);
      boardgameObj.price = matchingBoardgame?.prices[0]?.price;
      boardgameObj.priceUrl = matchingBoardgame?.url;
      return boardgameObj;
    });
    setBoardgames(boardgamesList);
  }

  return (
    <div>
      {boardgames.map((value: Boardgame) => (
        <div key={value.id} className="boardgame-container">
          <img className="boardgame-image" alt="boardgame-thumbnail" src={value.thumbnail} />
          <div className="boardgame-description">
            <div className="boardgame-name">{value.name}</div>
            <div className="boardgame-extra-details">
              <div className="grid-item rating">
                <span>Rating</span>
                <span>{value.rating ? +parseFloat(value.rating).toFixed(2) : '?'}</span>
              </div>
              <div className="grid-item weight">
                <span>Weight</span>
                <span>{value.weight ? `${+parseFloat(value.weight).toFixed(2)} / 5` : '?'}</span>
              </div>
              <div className="grid-item player-number">
                <span>Players</span>
                {value.minPlayers !== value.maxPlayers
                  ? <span>{`${value.minPlayers} - ${value.maxPlayers}`}</span>
                  : <span>{`${value.minPlayers}`}</span>}
              </div>
              <div className="grid-item playtime">
                <span>Playtime</span>
                {value.minPlaytime !== value.maxPlaytime
                  ? <span>{`${value.minPlaytime} - ${value.maxPlaytime} min`}</span>
                  : <span>{`${value.minPlaytime} min`}</span>}
              </div>
            </div>
          </div>
          <div className="boardgame-price">
            <span className="price-header">Buying options</span>
            {value.priceUrl
              ? (
                <>
                  <a href={value.priceUrl} title="Visit boardgameprices.co.uk to find out more">{`£${value.price}`}</a>
                  <span className="best-available-price-header">Best availaible price</span>
                </>
              )
              : <span className="unknown-price" title="Price is unknown"> ? </span>}
          </div>
        </div>
      ))}
    </div>
  );
}
