const PORT = 3000
// const axios = require('axios')
// const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const scraper = require('./scraper')

const url = 'https://www.promiedos.com.ar/'

app.get('/', function (req, res) {
res.json('Este es un webscraper del sitio https://www.promiedos.com.ar/ (para ver los resultados ir a http://localhost:3000/results')
})

app.get('/results', async (req, res) => {
    const partidos = await scraper.getPartidos(url);
    res.json(partidos);
  });

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));