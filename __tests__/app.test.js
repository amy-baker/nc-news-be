const db = require('../db/connection.js');
const app = require('../db/app.js');
const seed = require('../db/seeds/seed.js');
const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index.js');
const request = require("supertest");
const fs = require('fs');

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

afterAll(() => db.end());

describe('/api/topics', () => {
    test('GET 200: returns an array of objects, which have properties of slug and description', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then((response) => {
            const topics = response.body;
            expect(topics).toEqual(expect.any(Array));
            expect(topics.length).toEqual(3);

            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug');
                expect(topic).toHaveProperty('description')
            })     
         });
   
    });
});

describe('/api', () => {
    test('GET 200: returns an object which describes all available endpoints on the API', () => {
        let convertEndpointsFile = fs.readFileSync('endpoints.json', 'utf-8');
        convertEndpointsFile = JSON.parse(convertEndpointsFile);
        const endpointsCount = Object.keys(convertEndpointsFile).length;

        return request(app).get('/api')
        .expect(200)
        .then((response) => {
           const endpoints = response.body;
           expect(endpoints).toEqual(expect.any(Object));
           expect(Object.keys(endpoints).length).toEqual(endpointsCount);

                for (let endpointInstance in endpoints) {
                let endpoint = endpoints[endpointInstance]
                expect(endpoint).toHaveProperty('description');
                expect(endpoint).toHaveProperty("queries")
                expect(endpoint).toHaveProperty('exampleResponse');
                }
            })
        })
    })
describe('/api/articles/:id', () => {
    test('GET 200: responds with an article object with required properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
        
            let article = response.body.article 
            expect(article).toBeInstanceOf(Object)
            expect(article.author).toEqual("butter_bridge");
            expect(article.title).toEqual("Living in the shadow of a great man");
            expect(article.body).toEqual("I find this existence challenging");
            expect(article).toHaveProperty('created_at');
            expect(article).toHaveProperty('votes');
            expect(article).toHaveProperty('article_img_url');
        });
    });
    test('GET 400: responds with appropriate error message when given invalid id as input', () => {
        return request(app)
        .get('/api/articles/bingus')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('Bad Request')
        })
    })
    test('GET 404: sends appropriate error message when given a valid but nonexistent id as input',() => {
        return request(app)
        .get('/api/articles/450')
        .expect(404)
        .catch((err) => {
            expect(err).toEqual('Not Found');
          })
    })
})
describe('/api/articles', () => {
    test('GET 200: responds with an array of article objects with comment_count created from comments.js and body property removed', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles
            
            expect(articles.length).toEqual(13)
            articles.forEach((article) => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
                expect(article).not.toHaveProperty('body');

        })
        })
    })
    test('GET 200:array is ordered in descending order of created_at date', () => {
       return request(app)
       .get('/api/articles')
       .expect(200)
       .then((response) => {
            expect(response.body.articles).toBeSortedBy('created_at', {
                descending: true
            });
       })
    })
    test('GET 404: sends appropriate error message when no articles found', () => {
        return request(app)
        .get('/api/articles/450')
        .expect(404)
        .catch((err) => {
            expect(err.response.body.msg).toEqual("Not Found")
            
        })
    })
})
describe('/api/articles/:article_id/comments', () => {
    test('GET 200: returns with an array of comments corresponding with the article id input', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body;
            
            expect(comments.length).toEqual(11)
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');
            })
        })
    })
    test('GET 200: array is ordered in descending order of created_at date', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
             expect(response.body).toBeSortedBy('created_at', {
                 descending: true
             });
        })
     })
    test('GET 404: returns appropriate error message when passed id is valid but attached to no article', () => {
        return request(app)
        .get('/api/articles/4206/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('Not Found')
        })
    })
    test('GET 400: returns appropriate error message when invalid id is passed', () => {
        return request(app)
        .get('/api/articles/invalidid/comments')
        .expect(400)
        .catch((err) => {
            expect(err.response.body.msg).toEqual("Bad Request")
        })
        })
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test ('POST 201:adds comment object for articles', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send({ username: "butter_bridge", body: "comment example"})
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                
                expect(comment.body).toBe('comment example')
                expect(comment.author).toBe("butter_bridge")
            })
        })
        test('ignores unnecessary properties', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send({ username: "butter_bridge", body: "comment example", rogueProp: ";)"})
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                
                expect(comment.body).toBe('comment example')
                expect(comment.author).toBe("butter_bridge")
            })
        })
        test('POST 400: responds with appropriate error message when attempt is made on an article with an invalid id', () => {
            return request(app)
            .post('/api/articles/jerryjeans/comments')
            .send({ username: "butter_bridge", body: "comment example"})
            .expect(400)
            .catch((err) => {
                expect(err.response).toEqual('Invalid article id')
            })
    
            })
            test('POST 404: responds with appropriate error message when attempt is made with a valid id that doesnt correspond to any article', () => {
                return request(app)
                .post('/api/articles/6000/comments')
                .send({ username: "butter_bridge", body: "comment example"})
                .expect(404)
                .catch((err) => {
                    expect(err.response).toEqual('Not Found')
                })
        })
        test('POST 404: responds with appropriate error message when no user attached to username', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send({ username: 'amy', body: 'test!!!'})
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('User not found')
        })
    })
        test('POST 400: responds with appropriate error message when no body is passed in', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send({ username: "butter_bridge" })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toEqual('Missing username or body')
            })
        })
        test('POST 400: responds with appropriate error message when no username passed in', () => {
            return request(app)
            .post('/api/articles/3/comments')
            .send({ body: "test comment" })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toEqual('Missing username or body')
            })
        })
     })