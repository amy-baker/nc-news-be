const selectAllTopics = require('./model.js')

const getAllTopics = (req, res, next) => {
    selectAllTopics().then((data) => {
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = getAllTopics