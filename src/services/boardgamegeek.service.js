import { xml2json, xml2js } from 'xml-js';

export function fetchHotBoardgames() {
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
              return resultsJs.elements[0].elements.map(element => {
                return {
                  name: element.elements[2].attributes.value,
                  thumbnail: element.elements[0].elements.text,
                }
              })
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
}