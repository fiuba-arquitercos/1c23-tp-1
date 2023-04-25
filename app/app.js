const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

app.get("/ping", (req, res) =>{
  res.status(200).send("pong");
})

app.get('/space_news', (req, res) => {
  axios.get('https://api.spaceflightnewsapi.net/v4/articles')
  .then(spaceFlightRes => {
    const headerDate = spaceFlightRes.headers && spaceFlightRes.headers.date ? spaceFlightRes.headers.date : 'no response date';
    console.log('Status Code:', spaceFlightRes.status);
    console.log('Date in Response header:', headerDate);

    const response_body = spaceFlightRes.data;
    console.log('Data:', response_body);
    const spaceflightNews = response_body.results.slice(0, 5);;
    const titles = spaceflightNews.map((spaceflightNew) => spaceflightNew.title);
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