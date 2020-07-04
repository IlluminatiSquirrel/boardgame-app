import React, { useEffect, useState } from 'react';
import './HotBoardgamesList.scss';
import { xml2js } from 'xml-js';
import { Boardgame } from '../../interfaces/Boardgame.interface';
import BoardgamesListItem from '../BoardgamesListItem/BoardgamesListItem';

// 1 hour
const CACHING_DURATION = 3600;

export default function HotBoardgamesList() {
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
            const boardgamePricesResponseCopy = boardgamePricesResponse.clone();

            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + CACHING_DURATION);

            const cachedResponseFields = {
              status: boardgamePricesResponse.status,
              statusText: boardgamePricesResponse.statusText,
              headers: { 'Cache-Expires': expires.toUTCString() },
            };

            boardgamePricesResponse.headers.forEach((v, k) => {
              cachedResponseFields.headers[k] = v;
            });

            const body = await boardgamePricesResponse.text();
            cache.put(boardgamePricesUrl, new Response(body, cachedResponseFields));
            return boardgamePricesResponseCopy;
          }
          return fetch(boardgamePricesUrl);
        };
        const boardgamePricesResponse = await getBoardgamePricesPromise();
        parseResponses(boardgameDetailsResponse, await boardgamePricesResponse.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  function parseResponses(boardgameDetails, boardgamesPrices) {
    const boardgameDetailsJs = xml2js(boardgameDetails);
    // console.log(boardgameDetailsJs);
    // console.log(boardgamesPrices);
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
    <ul>
      {boardgames.map((boardgame: Boardgame) => (
        <BoardgamesListItem key={boardgame.id} boardgame={boardgame} />
      ))}
    </ul>
  );
}
