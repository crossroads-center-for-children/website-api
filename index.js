require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./backend/server/server');
const port = process.env.PORT || 1337;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get(/\/(?!graphql)*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
