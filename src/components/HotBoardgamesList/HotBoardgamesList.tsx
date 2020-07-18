import React, { useEffect, useState } from 'react';
import './HotBoardgamesList.scss';
import { xml2js } from 'xml-js';
import moment, { Moment } from 'moment';
import { Boardgame } from '../../interfaces/Boardgame.interface';
import BoardgamesListItem from '../BoardgamesListItem/BoardgamesListItem';

// 1 hour
const CACHING_DURATION = 3600;

export default function HotBoardgamesList() {
  const [boardgames, setBoardgames] = useState<ReadonlyArray<Boardgame>>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const hotBoardgames: string = await (await fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames')).text();
        const idList: ReadonlyArray<string> = xml2js(hotBoardgames).elements[0].elements.map((element) => element.attributes.id);
        const boardgameDetailsResponse: string = await (await fetch(`http://127.0.0.1:8080/https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${idList}`)).text();

        const getBoardgamePricesPromise = async (): Promise<Response> => {
          const boardgamePricesUrl: string = `https://boardgameprices.co.uk/api/info?eid=${idList}&sitename=localhost:3000`;
          if ('caches' in window) {
            const cacheName: string = 'boardgame-prices-cache';
            const cache: Cache = await caches.open(cacheName);

            const cachedResponse: Response | undefined = await checkCache(boardgamePricesUrl, cache);
            if (cachedResponse) {
              return cachedResponse;
            }

            return cacheResponse(boardgamePricesUrl, cache);
          }
          return fetch(boardgamePricesUrl);
        };
        const boardgamePricesResponse: Response = await getBoardgamePricesPromise();
        parseResponses(boardgameDetailsResponse, await boardgamePricesResponse.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  async function checkCache(url: string, cache: Cache): Promise<Response | undefined> {
    const cachedResponse: Response | undefined = await cache.match(url);
    if (cachedResponse) {
      const cacheExpiryDate: string | null = cachedResponse.headers.get('cache-expires');
      if (cacheExpiryDate && moment(cacheExpiryDate).isAfter(moment.utc())) {
        return cachedResponse;
      }
    }
    return undefined;
  }

  async function cacheResponse(url: string, cache: Cache): Promise<Response> {
    const response: Response = await fetch(url);
    const responseCopy: Response = response.clone();

    const expires: Moment = moment.utc().add(moment.duration(CACHING_DURATION, 's'));

    const cachedResponseFields = {
      status: response.status,
      statusText: response.statusText,
      headers: { 'cache-expires': expires.toString() },
    };

    response.headers.forEach((v, k) => {
      cachedResponseFields.headers[k] = v;
    });

    const body: string = await response.text();
    cache.put(url, new Response(body, cachedResponseFields));
    return responseCopy;
  }

  function parseResponses(boardgameDetails, boardgamesPrices): void {
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
