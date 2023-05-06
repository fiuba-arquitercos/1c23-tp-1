const { createClient } = require("redis");
const { StatsD } = require("hot-shots");
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const {performance} = require('perf_hooks');

let redisClient = createClient({ url: 'redis://redis:6379' });
const statsd_client = new StatsD({
  "graphiteHost": "127.0.0.1",
  "graphitePort": 2003,
  "port": 8125,
  "flushInterval": 1000,
  "deleteIdleStats": true
});

const db = new Map();

const delay = time => new Promise(resolveCallback => setTimeout(resolveCallback, time));

async function executeProcess(id) {
  db.set(id, 'PENDING')
  await delay(10000);
  db.set(id, 'FINISH')
}


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

app.get('/fact', async (req, res) => {

  let factString = await redisClient.get('fact');

  if (factString !== null) {
    console.log("could get cached fact");
    res.send(JSON.parse(factString));
  }else {
    axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
    .then(factsRes => {

      const factsInfo = factsRes.data;
      console.log('Data: ', factsInfo);
      let fact = factsInfo['text'];
      redisClient.set('fact', JSON.stringify(fact), {EX: 60}).then(() => {console.log("Cached fact")}); 
      res.send(fact)
    })
    .catch(err => {
      console.log('Error: ', err.message)
      res.send(err.message)
    });
  }
})

app.get('/space_news', async (req, res) => {
  let titlesString = await redisClient.get('space_news');

  if (titlesString !== null) {
    console.log("could get cached space_news");
    res.send(JSON.parse(titlesString));
  } else {

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
    
        redisClient.set('space_news', JSON.stringify(titles), {EX: 60}).then(() => {console.log("Cached space_news")}); 
        res.send(titles);
      })
      .catch(err => {
        console.log('Error: ', err.message);
        res.send(err.message)
      });
  }
})

async function process_metar_request(req) {

  let response_message;
  const codeStation = req.query.station;
  let metarKeyString = 'metar_' + (codeStation !== undefined? codeStation:'no_param');
  console.log(metarKeyString);
  let metarString = await redisClient.get(metarKeyString);
  
  if (metarString !== null) {
    console.log("could get cached metar");
    response_message = JSON.parse(metarString);
  
  } else {
    const parser = new XMLParser();
  
    try {
      const startTime = performance.now();
      let metarRes = await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${codeStation}&hoursBeforeNow=1`)
      const endTime = performance.now();
      statsd_client.timing('metar_api.response_time', startTime - endTime);
      
      
      const parsed = parser.parse(metarRes.data);
  
      if(parsed.response.data.hasOwnProperty('METAR')){
          const metarInfos = parsed.response.data.METAR;
          console.log(metarInfos)
          console.log(typeof metarInfos)
          if (metarInfos.hasOwnProperty('raw_text')){
            response_message = decode(metarInfos.raw_text);
          } else {
            response_message = metarInfos.map((metarInfo) => decode(metarInfo.raw_text));
          }
            
        } else {
          response_message = "Metar devolvio vacio para ese aeródromo";
        }
  
    } catch (err) {
      console.log('Error: ', err.message);
      response_message = err.message;
    }
  
    redisClient.set(metarKeyString, JSON.stringify(response_message), {EX: 10}).then(() => {console.log("Cached results")});
  }

  return response_message;
}

app.get('/metar', async (req, res) =>{
  const startTime = performance.now();

  let response_message = await process_metar_request(req);

  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(duration);
  statsd_client.timing('app.metar_endpoint.response_time', duration);
  res.send(response_message)

})

app.post('/big_process', (req, res) => {
  let process_count = db.size
  let process_id = process_count + 1
  executeProcess(process_id)
  res.send('PROCESS ID: ' + process_id);
})

app.get('/big_process/:id', (req, res) => {
  let id = Number(req.params.id)
  let process = db.get(id)
  if (process) {
    res.send('PROCESS: ' + process);
  }
  res.status(404).send('Process not found');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

