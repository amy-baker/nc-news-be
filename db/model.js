const db = require('./connection.js')

const selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => {
        return result.rows;
    })
}

module.exports = selectAllTopics;