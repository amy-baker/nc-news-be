const {selectAllTopics, selectArticleById, selectAllArticles, selectCommentsById, insertComment } = require('./model.js')
const fs = require('fs');

const getAllTopics = (req, res, next) => {
    selectAllTopics().then((data) => {
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}

const getAllEndpoints = (req, res, next) => {
    fs.promises.readFile('endpoints.json', 'utf-8')
    .then(endpointsInfo => {
        const parsedEndpoints = JSON.parse(endpointsInfo);
        res.status(200).send(parsedEndpoints)
    })
    .catch((err) => {
        next(err)
    })
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    });
};

const getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((result) => {
        const articles = result.rows;
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err)
    })
}

const getCommentsById = (req, res, next) => {
    
    const { article_id } = req.params;
    
    selectCommentsById(article_id)
    .then((result) => {
        
        res.status(200).send(result)
    })
    .catch((err) => {
        next(err)
    })
}

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
   
    insertComment(article_id, username, body)
    .then((comment) => {
        
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsById, postComment}