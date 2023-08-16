const express = require('express');
const app = express();

const { getAllTopics, getAllEndpoints,getArticleById, getAllArticles, getCommentsById } = require('./controller.js');

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request' });
    } else if (res.status(404)) {
    res.status(404).send({msg: 'Article does not exist'})
    } else { res.status(500).send({ msg: 'Internal Server Error' });
}
  });

module.exports= app;