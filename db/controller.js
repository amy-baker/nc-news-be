const {selectAllTopics } = require('./model.js')
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

module.exports = {getAllTopics, getAllEndpoints}