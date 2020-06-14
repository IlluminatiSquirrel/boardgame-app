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
}

export default function BoardgamesList() {
  const [items, setItems] = useState<ReadonlyArray<Boardgame>>([]);
  let idList: ReadonlyArray<string> = [];

  useEffect(() => {
    fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames')
      .then((res) => res.text())
      .then((res) => {
        idList = xml2js(res).elements[0].elements.map((element) => element.attributes.id);
        return fetch(`http://127.0.0.1:8080/https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${idList}`);
      })
      .then((res) => res.text())
      .then((res) => parseResponse(res))
      .catch((error) => console.error(error));
  }, []);

  function parseResponse(boardgameDetailsResult) {
    const resultsJs = xml2js(boardgameDetailsResult);
    // console.log(resultsJs);
    const boardgames = resultsJs.elements[0].elements.map(
      (boardgame) => {
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
        return boardgameObj;
      },
    );
    setItems(boardgames);
  }

  return (
    <div>
      {items.map((value) => (
        <div key={value.id} className="boardgame-container">
          <img className="boardgame-image" alt="boardgame-thumbnail" src={value.thumbnail} />
          <div className="boardgame-description">
            <div className="boardgame-name">{value.name}</div>
            <div className="boardgame-extra-details">
              <div className="player-number">
                {'Players: '}
                {value.minPlayers}
                {' - '}
                {value.maxPlayers}
              </div>
              <div className="playtime">
                {'Playtime: '}
                {value.minPlaytime}
                {' - '}
                {value.maxPlaytime}
                {' min'}
              </div>
              <div className="rating">
                {'Rating: '}
                {value.rating ? +parseFloat(value.rating).toFixed(2) : '?'}
              </div>
              <div className="weight">
                {'Average weight: '}
                {value.weight ? +parseFloat(value.weight).toFixed(2) : '?'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
