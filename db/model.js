const db = require('./connection.js')
const fs = require('fs/promises');

const selectAllEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8")
  .then((contents) => {
    const endpointsInfo = JSON.parse(contents);
    return endpointsInfo
  })
  .catch((err) => {
    next(err)
  })
}

const selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => {
        return result.rows;
    })
}

const selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      if(error.status === 404) {
        return Promise.reject(error)
      } else {
        return Promise.reject({status : 500, msg: "Internal Server Error"})
      }
    })
};

const selectAllArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validColumns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const validOrder = ['asc', 'desc'];
  
    if (!validColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
  
    if (!validOrder.includes(order)) {
      return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
  
    const values = [];
    let query = `
      SELECT articles.article_id, articles.title, articles.topic, articles.author,
      articles.created_at, articles.votes, articles.article_img_url,
      CAST(COUNT(comments.article_id) AS INTEGER) 
      AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
  
    if (topic) {
      query += `WHERE topic = $${values.length + 1}`;
      values.push(topic);
    }
  
    query += `
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order}
    `;
  
    return db.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Not Found' });
        } else {
          return result.rows;
        }
      });
  };

  
const selectCommentsById = (id) => {

   return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id])
   .then((result) => {
    return result.rows
    })
    .catch((error) => {
      return Promise.reject({ status: 500, msg: "Internal Server Error" }); 
    })
   }


const insertComment = (id, username, body) => {
  if (username === undefined|| body === undefined) {
    return Promise.reject({
    status: 400,
    msg: 'Missing username or body'
    })
  } 
  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
  .then((result) => {
     if (result.rows.length === 0) {
    return Promise.reject({
    status: 404, msg: 'User not found'
          });
      }

    return selectArticleById(id) 
    .then(() => {
        return db.query(
            `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
            [body, username, id]
        );
    })
    .then((result) => {
       
        return result.rows[0];
    })
  })
}
const castVotes = (id, inc_votes) => {
    if (inc_votes === undefined || isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: 'Bad Request'
        })
    }
  
    return db.query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [inc_votes, id])
 
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
        return result.rows[0];
    })
};

const removeCommentById = (id) => {
   
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
        .then((result) => {
            
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Not Found'})
            }
        })
}

const selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`).then((result) => {
        return result.rows;
    })
}
 
module.exports = { selectAllEndpoints, selectAllTopics, selectArticleById, selectAllArticles, selectCommentsById, insertComment, castVotes, removeCommentById, selectAllUsers}