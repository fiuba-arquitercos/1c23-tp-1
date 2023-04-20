const express = require('express')
const app = express()
const port = 3000

app.get('/space_news', (req, res) => {
  res.send('TODO: Space News')
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};
// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
  console.log("shutdown gracefully!");
  server.close(() => {
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(0);
  });
};
// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal, signals[signal]);
  });
});