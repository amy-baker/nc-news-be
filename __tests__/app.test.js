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

describe('/api', () => {
    test('GET: returns an object which describes all available endpoints on the API', () => {
        return request(app).get('/api')
        .expect(200)
        .then((response) => {
           const endpoints = response.body;
            // console.log(endpoints, "<endpoints")
           expect(endpoints).toEqual(expect.any(Object));

                for (let endpointInstance in endpoints) {
                    let endpoint = endpoints[endpointInstance]
                // console.log(endpoint, "<endpoint")
                expect(endpoint).toHaveProperty('description');
                expect(endpoint).toHaveProperty("queries")
                expect(endpoint).toHaveProperty('exampleResponse');
                }
            // i had like 300 false positive w this so i am very much unsure if this actually works sorry if it doesn't
            })
        })
    })