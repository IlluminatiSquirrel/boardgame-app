import React from 'react';
import { useEffect, useState } from 'react';
import './BoardgamesList.scss'
import { xml2js } from 'xml-js';

interface Boardgame {
	id: string;
	name?: string;
	thumbnail?: string;
	minPlayers?: string;
	maxPlayers?: string;
	minPlaytime?: string;
	maxPlaytime?: string;
}

export default function BoardgamesList() {

	const [items, setItems] = useState<ReadonlyArray<Boardgame>>([]);

	useEffect(() => {
		fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames')
			.then(res => res.text())
			.then(
				(result) => {
					const idList: ReadonlyArray<string> = xml2js(result).elements[0].elements.map(element => element.attributes.id);

					fetch('http://127.0.0.1:8080/https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=' + idList)
						.then(res => res.text())
						.then(
							(result) => {
								const resultsJs = xml2js(result);
								console.log(resultsJs);
								const boardgames = resultsJs.elements[0].elements.map(boardgame => {
									let boardgameObj: Boardgame = {
										id: boardgame.attributes.id,
									}
									boardgame.elements.forEach(boardgameProperty => {
										if(boardgameProperty.name === 'thumbnail') {
											boardgameObj.thumbnail = boardgameProperty.elements[0].text;
										}
										if(boardgameProperty.name === 'name' && boardgameProperty.attributes.type === 'primary') {
											boardgameObj.name = boardgameProperty.attributes.value;
										}
										if(boardgameProperty.name === 'minplayers') {
											boardgameObj.minPlayers = boardgameProperty.attributes.value
										}
										if(boardgameProperty.name === 'maxplayers') {
											boardgameObj.maxPlayers = boardgameProperty.attributes.value
										}
										if(boardgameProperty.name === 'minplaytime') {
											boardgameObj.minPlaytime = boardgameProperty.attributes.value
										}
										if(boardgameProperty.name === 'maxplaytime') {
											boardgameObj.maxPlaytime = boardgameProperty.attributes.value
										}
									});
									return boardgameObj;
								})
								setItems(boardgames);
							},
							(error) => {
								console.error(error);
							}
						)
				},
				(error) => {
					console.error(error);
				}
			)
	}, [])

	return (
		<div>
			{items.map((value, index) => {
				return (
					<div key={index} className="boardgame-container">
						<img className='boardgame-image' alt='' src={value.thumbnail}></img>
						<div className='boardgame-description'>
							<div className='boardgame-name'>{value.name}</div>
							<div className='player-number'>{value.minPlayers} - {value.maxPlayers} players</div>
							<div className='playtime'>{value.minPlaytime} - {value.maxPlaytime} min</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}