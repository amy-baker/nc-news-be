const {selectAllTopics, selectAllEndpoints} = require('./model.js')

const getAllTopics = (req, res, next) => {
    selectAllTopics().then((data) => {
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}

const getAllEndpoints = (req, res, next) => {
    selectAllEndpoints().then((data) => {
        res.status(200).send(data)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllTopics, getAllEndpoints}