const redis = require('redis');
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
let redisClient = redis.createClient('redis://redis:6379');

redisClient.connect().then(() => {
  console.log("Connected to redis!!")
}).catch(() => {
  console.log("Unable to connect to redis :(")
})

app.get('/space_news', (req, res) => {
  axios.get('https://api.spaceflightnewsapi.net/v4/articles')
  .then(spaceFlightRes => {
    
    let titles = null;
     
    redisClient.get('space_news').then( (titlesString) => { 
        if (titlesString !== null) {
          titles = JSON.parse(titlesString);
          console.log("could get cached data")
        }
    }).catch(() => {console.log("Data not found or expired")})
     
    if (!titles){
      const headerDate = spaceFlightRes.headers && spaceFlightRes.headers.date ? spaceFlightRes.headers.date : 'no response date';
      //console.log('Status Code:', spaceFlightRes.status);
      //console.log('Date in Response header:', headerDate);

      const response_body = spaceFlightRes.data;
      //console.log('Data:', response_body);
      const spaceflightNews = response_body.results.slice(0, 5);
      titles = spaceflightNews.map((spaceflightNew) => spaceflightNew.title);
    }

    redisClient.set('space_news', JSON.stringify(titles), {EX: 60}).then(() => {console.log("Cached")}); 
    res.send(titles)
    
  })
  .catch(err => {
    console.log('Error: ', err.message);
    res.send(err.message)
  });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});