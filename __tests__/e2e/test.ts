// import { describe, it } from "node:test";
import request from "supertest";
import * as models from '../../src/models';
import { app } from "../../src";
import { HTTP } from "../../src/HTTPStatusCodes";

describe('/ht_01/api/testing/all-data', () => {
  // TEST #1
  it('should delete all videos and return empty array', async () => {
    await request(app)
      .delete('/ht_01/api/testing/all-data')
      .expect(HTTP.NO_CONTENT_204);
  });
});

describe('/hometask_01/api/videos', () => {
  let video1: models.h01_Video;

  beforeAll(async () => {
    await request(app).delete('/ht_01/api/testing/all-data');
  }); // db = [];

  // TEST #2
  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/hometask_01/api/videos')
      .expect(HTTP.OK_200, []);
  }); // db = [];

  // TEST #3
  it('should return 400 and error messages (incorrect input)', async () => {
    const reqBody = { title: 'string' };
    const resBody = {
      errorsMessages: [
        {
          message: `incorrect author`,
          field: 'author'
        }
      ]
    };

    await request(app)
      .post('/hometask_01/api/videos/')
      .send(reqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }) // db = [];

  // TEST #4
  it('should return 201 and created video', async () => {
    const reqBody = { title: 'string', author: 'string' };

    const response = await request(app)
      .post('/hometask_01/api/videos/')
      .send(reqBody);

    const video = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(video).toStrictEqual({
      id: expect.any(Number),
      title: reqBody.title,
      author: reqBody.author,
      availableResolutions: null,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });

    video1 = video;
  }) // db = [{id:1, title: 'string'}];

  // TEST #5
  it('should return 200 and existed video with id 1', async () => {
    const response = await request(app)
      .get(`/hometask_01/api/videos/${video1.id}`);

    const video = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(video).toStrictEqual(video1);

  }); // db = [{id:1, title: 'string'}];

  // TEST #6
  it('should return 404 (video with id 2 is unexist)', async () => {
    await request(app)
      .get('/hometask_01/api/videos/2')
      .expect(HTTP.NOT_FOUND_404);
  }); // db = [{id:1, title: 'string'}];

  // TEST #7
  it('should return 404 (video with id 2 is unexist)', async () => {
    const reqBody = { title: 'string', author: 'string' };

    await request(app)
      .put('/hometask_01/api/videos/2')
      .send(reqBody)
      .expect(HTTP.NOT_FOUND_404);
  }); // db = [{id:1, title: 'string'}];

  // TEST #8
  it('should return 400 and error messages (input is incorrect)', async () => {
    const reqBody = { author: 'new' };
    const resBody = {
      errorsMessages: [
        {
          message: `incorrect title`,
          field: 'title'
        }
      ]
    };

    await request(app)
      .put('/hometask_01/api/videos/1')
      .send(reqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // db = [{id:1, title: 'string'}];

  // TEST #9
  it('should return 204 and video with id 1 will be changed', async () => {
    const reqBody = { title: 'new', author: 'string' };

    await request(app)
      .put('/hometask_01/api/videos/1')
      .send(reqBody)
      .expect(HTTP.NO_CONTENT_204);
  }); // db = [{id:1, title: 'new'}];

  // TEST #10
  it('should return 404 (video with id 2 is unexist)', async () => {
    await request(app)
      .delete('/hometask_01/api/videos/2')
      .expect(HTTP.NOT_FOUND_404);
  }); // db = [{id:1, title: 'new'}];

  // TEST #11
  it('should return 204 and video with id 1 will be deleted', async () => {
    await request(app)
      .delete('/hometask_01/api/videos/1')
      .expect(HTTP.NO_CONTENT_204);
  }); // db = [];

  // TEST #12
  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/hometask_01/api/videos')
      .expect(HTTP.OK_200);
  }); // db = [];
});