const express = require('express');
const app = express();

const { getAllTopics, getAllEndpoints,getArticleById, getAllArticles, getCommentsById } = require('./controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.use((err, req, res, next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
    res.status(500).send({msg: 'internal server error'})
    }
})

module.exports= app;