const express = require('express');
const app = express();

const getAllTopics = require('./controller.js');

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.use((err, req, res, next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
    res.status(500).send({msg: 'internal server error'})
    }
});

module.exports= app;