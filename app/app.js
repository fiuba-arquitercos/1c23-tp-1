const express = require('express')
const app = express()
const port = 3000

app.get('/space_news', (req, res) => {
  res.send('TODO: Space News')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})