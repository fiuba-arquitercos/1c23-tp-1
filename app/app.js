const { createClient } = require("redis");
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
let redisClient = createClient({ url: 'redis://redis:6379' });

(async () => {
      await redisClient.connect();
})();
redisClient.on('ready', () => {
  console.log("Connected!");
});

redisClient.on("error", (err) => {
  console.log("Error in the Connection");
});

const { XMLParser } = require('fast-xml-parser');
const { decode } = require('metar-decoder');

app.get("/ping", (req, res) =>{
  res.status(200).send("pong");
})

app.get('/fact', (req, res) => {
  axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
  .then(factsRes => {
    const factsInfo = factsRes.data;
    console.log('Data: ', factsInfo)
    res.send(factsInfo['text'])
  })
  .catch(err => {
    console.log('Error: ', err.message)
    res.send(err.message)
  });
})

app.get('/space_news', async (req, res) => {
  let titlesString = await redisClient.get('space_news');

  if (titlesString !== null) {
    console.log("could get cached data");
    res.send(JSON.parse(titlesString));
  } else {
    console.log("Data not found or expired");

    axios.get('https://api.spaceflightnewsapi.net/v4/articles')
      .then(spaceFlightRes => {
      
        let titles = null;
        
        const headerDate = spaceFlightRes.headers && spaceFlightRes.headers.date ? spaceFlightRes.headers.date : 'no response date';
        console.log('Status Code:', spaceFlightRes.status);
        console.log('Date in Response header:', headerDate);

        const response_body = spaceFlightRes.data;
        console.log('Data:', response_body);
        const spaceflightNews = response_body.results.slice(0, 5);
        titles = spaceflightNews.map((spaceflightNew) => spaceflightNew.title);
    
        redisClient.set('space_news', JSON.stringify(titles), {EX: 60}).then(() => {console.log("Cached")}); 
        res.send(titles);
      })
      .catch(err => {
        console.log('Error: ', err.message);
        res.send(err.message)
      });
  }


})

app.get('/metar', (req, res) =>{
    const codeStation = req.query.station
    console.log(codeStation)
    const parser = new XMLParser();
    axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${codeStation}&hoursBeforeNow=1`)
    .then(metarRes => {

      const parsed = parser.parse(metarRes.data);
      if(parsed.response.data.hasOwnProperty('METAR')){
          const metarInfos = parsed.response.data.METAR;
          console.log(metarInfos)
          console.log(typeof metarInfos)
          if (metarInfos.hasOwnProperty('raw_text')){
              const results = decode(metarInfos.raw_text);
              console.log(results);
              res.send(results);
          } else {
              const results = metarInfos.map((metarInfo) => decode(metarInfo.raw_text));
              console.log(results);
              res.send(results);
          }
          
      } else {
          res.send("Metar devolvio vacio para ese aeródromo")
      }
    })
    .catch(err => {
      console.log('Error: ', err.message);
      res.send(err.message)
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

