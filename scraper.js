const axios = require('axios')
const cheerio = require('cheerio')
const url = 'https://www.promiedos.com.ar/'

async function getPartidos(req, res) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const partidos = [];

        // Utilizamos la clase común para seleccionar los elementos de los partidos
        $('tr[name="nvp"]').each(function () {
            const leagueTitleElement = $(this).prevAll('.tituloin').first().find('a');
                const leagueTitle = leagueTitleElement.contents().filter(function () {
                    return this.nodeType === 3; // Filter out non-text nodes
                }).map(function () {
                    return $(this).text().trim();
                }).get().join(' ');

            const leagueFlag = leagueTitleElement.find('img').attr('src');
            const gameStatePlay = $(this).find('.game-play');
            const timestamp = gameStatePlay.length ? gameStatePlay.text().trim() : null;
            const gameStateFin = $(this).find('.game-fin').text().trim();
            const gameStateTime = $(this).find('.game-time').text().trim();
            let gameState;

            if (gameStatePlay.length) {
                gameState = gameStatePlay;
                } else if (gameStateFin.length) {
                gameState = gameStateFin;
                } else {
                gameState = gameStateTime || timestamp;
                }


            const gamet1 = $(this).find('.game-t1').first().find('.datoequipo').text().trim();
            const gamet2 = $(this).find('.game-t1').last().find('.datoequipo').text().trim();
            const gamer1 = $(this).find('.game-r1 span').text().trim();
            const gamer2 = $(this).find('.game-r2 span').text().trim();

            // Añadimos el objeto al arreglo principal solo si hay información relevante
            if (gameState || gamet1 || gamet2 || gamer1 || gamer2 || leagueFlag) {
                const partido = {
                    leagueTitle,
                    leagueFlag,
                    gameState,
                    gamet1,
                    gamet2,
                    gamer1,
                    gamer2,
                    url: "https://www.promiedos.com.ar/"
                };
                partidos.push(partido);
            }
        });
  return partidos;
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {
  getPartidos,
};
