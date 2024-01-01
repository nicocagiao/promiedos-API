const PORT = 3000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const url = 'https://www.promiedos.com.ar/'

// app.get('/', function (req, res) {
// res.json('This is my webscraper')
// })

app.get('/', (req, res) => {
  axios(url)
      .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);

          const partidos = [];

          const mainTitleElement = $('#fixturein .tituloin a');
          const leagueTitle = mainTitleElement.clone().children().remove().end().text().trim();
          const countryName = mainTitleElement.attr('href').trim();
          const countryImg = mainTitleElement.find('img').attr('src').trim();


              // Para seleccionar los elementos de los partidos
          $('tr[name="vp"]').each(function () {
              
              const gameState = $(this).find('.game-play').text().trim();
              const gamet1Element = $(this).find('.game-t1').first();
              const gamet1 = gamet1Element.find('.datoequipo').text().trim();
              const gamet2Element = $(this).find('.game-t1').last();
              const gamet2 = gamet2Element.find('.datoequipo').text().trim();
              const gamer1Element = $(this).find('.game-r1 span');
              const gamer1 = gamer1Element.length ? gamer1Element.text().trim() : "";
              const gamer2Element = $(this).find('.game-r2 span');
              const gamer2 = gamer2Element.length ? gamer2Element.text().trim() : "";
              
// Añadimos el objeto al arreglo principal solo si hay información relevante

if (gameState || gamet1 || gamet2 || gamer1 || gamer2) {
     const partido = {
                     leagueTitle,
                      countryName,
                      countryImg,
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

          res.json(partidos);
      })
      .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));





