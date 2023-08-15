const express = require('express');
const app = express();

const { getAllTopics, getAllEndpoints,getArticleById} = require('./controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);


module.exports= app;