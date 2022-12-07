import express, { Request, Response } from 'express';
import * as models from './models';
import { HTTP } from './HTTPStatusCodes';
import { local_db } from './localDB';
import { ReqBodyHasErrors, videoIsExist } from './CheckReqBodyAndURI';

export const app = express();
const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let db = [...local_db];

app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
  res.status(HTTP.OK_200); // TEST #2, #12
  res.json(db);
});

app.post('/hometask_01/api/videos', (
  req: Request<{}, models.APIErrorResult, models.h01_CreateVideoInputModel>,
  res: Response) => {

  const errorsInReqBody = ReqBodyHasErrors(req.body);
  console.log(errorsInReqBody);

  if (!errorsInReqBody) {
    let createdAt = new Date();

    let publicationDate = new Date(createdAt.getTime());
    publicationDate.setDate(publicationDate.getDate() + 1);

    const newVideo = {
      id: db.length + 1,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
      availableResolutions: req.body.availableResolutions || null
    };

    db.push(newVideo);

    res.status(HTTP.CREATED_201); // TEST#4
    res.json(newVideo);
  } else {
    res.status(HTTP.BAD_REQUEST_400); // TEST #3
    res.json(errorsInReqBody);
  }
});

app.get('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
  const video = videoIsExist(db, req.params.id);
  if (video) {
    res.status(HTTP.OK_200); // TEST #5
    res.json(video);
  } else res.sendStatus(HTTP.NOT_FOUND_404); // TEST #6
});

app.put('/hometask_01/api/videos/:id', (
  req: Request<{ id: string }, models.APIErrorResult, models.h01_UpdateVideoInputModel>,
  res: Response) => {

  const video = videoIsExist(db, req.params.id);
  if (video === false) res.sendStatus(HTTP.NOT_FOUND_404); // TEST #7

  const errorsInReqBody = ReqBodyHasErrors(req.body);

  if (!errorsInReqBody) {
    video.title = req.body.title;
    video.author = req.body.author;
    req.body.availableResolutions ? video.availableResolutions = req.body.availableResolutions : '';
    req.body.canBeDownloaded ? video.canBeDownloaded = req.body.canBeDownloaded : '';
    req.body.minAgeRestriction ? video.minAgeRestriction = req.body.minAgeRestriction : '';
    req.body.publicationDate ? video.publicationDate = req.body.publicationDate : '';
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #9
  } else {
    res.status(HTTP.BAD_REQUEST_400); // TEST #8
    res.json(errorsInReqBody);
  }
});

app.delete('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
  const video = videoIsExist(db, req.params.id);
  if (video === false) res.sendStatus(HTTP.NOT_FOUND_404); // TEST #10
  else {
    db = db.filter(video => video.id !== +req.params.id);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #11
  }
});

app.delete('/ht_01/api/testing/all-data', (req: Request, res: Response) => {
  db = [];
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})