const db = require('./connection.js')
const fs = require('fs').promises;

const selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => {
        return result.rows;
    })
}

const selectAllEndpoints = async () => {
    try {
    const endpointsInfo = await fs.readFile('endpoints.json', 'utf-8');
        const parsedEndpoints = JSON.parse(endpointsInfo);
    return parsedEndpoints;
} catch (error) {
    console.log(error)
}

}

module.exports = { selectAllTopics, selectAllEndpoints}