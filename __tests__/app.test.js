const db = require('../db/connection.js');
const app = require('../db/app.js');
const seed = require('../db/seeds/seed.js');
const { articleData, commentData, topicData, userData } = require('../db/data/test-data/index.js');
const request = require("supertest");

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