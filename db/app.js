const express = require('express');
const app = express();
const cors = require('cors');

const { getAllTopics, getAllEndpoints,getArticleById, getAllArticles, getCommentsById, postComment, updateVotes, deleteComment, getAllUsers } = require('./controller.js');

app.use(cors());

app.get('/api/topics', getAllTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.use(express.json())

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', updateVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.get('/api/users', getAllUsers);

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02' || err.status === 400) {
        res.status(400).send({ msg: 'Bad Request' });
    } else if (err.status === 404) {
        res.status(404).send({ msg: 'Not Found' });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

module.exports= app;