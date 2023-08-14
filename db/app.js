const express = require('express');
const app = express();

const getAllTopics = require('./controller.js');

app.get('/api/topics', getAllTopics);




module.exports= app;