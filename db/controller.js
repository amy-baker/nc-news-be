const {selectAllEndpoints, selectAllTopics, selectArticleById, selectAllArticles, selectCommentsById, insertComment, castVotes, removeCommentById, selectAllUsers } = require('./model.js')
const fs = require('fs');

const getAllEndpoints = (req, res, next) => {
  selectAllEndpoints()
  .then((endpoints) => {
    res.status(200).send({endpoints})
  })
  .catch((err) => {
    next(err)
  })
}


const getAllTopics = (req, res, next) => {
    selectAllTopics().then((data) => {
        res.status(200).send(data)
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
    const { topic, sort_by, order } = req.query;
    selectAllArticles(topic, sort_by, order)
    .then((result) => {
        const articles = result;
        res.status(200).send(articles);

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

const updateVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    castVotes(article_id, inc_votes)
    .then((response) => {
        res.status(200).send(response)
    })
    .catch((err) => {
        next(err)
    })
}

const deleteComment = (req, res, next) => {

    const { comment_id } = req.params;

    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err)
    })
}

const getAllUsers = (req, res, next) => {
  
    selectAllUsers().then((data) => {
        
        res.status(200).send(data)
        
    })
    .catch((err) => {
        next(err)
    })
}


module.exports = {getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsById, postComment, updateVotes, deleteComment, getAllUsers}