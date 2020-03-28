const express = require('express');
const upload = require('./upload');
const sq = require('./sqlite');
const cors = require('cors');

const server = express()

var bodyParser = require('body-parser')
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

server.use(cors(corsOptions))

server.post('/upload', upload)

server.post('/new', sq.create_day)
server.get('/get', sq.get_days);
server.post('/get', sq.get_dayById)

server.listen(8000, () => {
  console.log('Server started!')
})