import React from 'react';
import { useEffect, useState } from 'react';
import './BoardgamesList.scss'
import { xml2json, xml2js } from 'xml-js';

export default function BoardgamesList() {

	const [items, setItems] = useState([]);

	useEffect(() => {
		fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames')
			.then(res => res.text())
			.then(
				(result) => {
					const idList = xml2js(result).elements[0].elements.map(element => element.attributes.id);

					fetch('http://127.0.0.1:8080/https://www.boardgamegeek.com/xmlapi2/thing?id=' + idList)
						.then(res => res.text())
						.then(
							(result) => {
								const resultsJs = xml2js(result);
								console.log(resultsJs);
								const boardgames = resultsJs.elements[0].elements.map(element => {
									return {
										name: element.elements[2].attributes.value,
										thumbnail: element.elements[0].elements[0].text,
									}
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
							<div className='boardgame-rank'>Rank: {value.rank}</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}