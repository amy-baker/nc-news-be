const express = require('express');
const app = express();

const { getAllTopics, getAllEndpoints } = require('./controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);


module.exports= app;