"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const HTTPStatusCodes_1 = require("./HTTPStatusCodes");
const localDB_1 = require("./localDB");
const CheckReqBodyAndURI_1 = require("./CheckReqBodyAndURI");
exports.app = (0, express_1.default)();
const port = 3003;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
let db = [...localDB_1.local_db];
exports.app.get('/hometask_01/api/videos', (req, res) => {
    res.status(HTTPStatusCodes_1.HTTP.OK_200); // TEST #2, #12
    res.json(db);
});
exports.app.post('/hometask_01/api/videos', (req, res) => {
    const errorsInReqBody = (0, CheckReqBodyAndURI_1.ReqBodyHasErrors)(req.body);
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
        res.status(HTTPStatusCodes_1.HTTP.CREATED_201); // TEST#4
        res.json(newVideo);
    }
    else {
        res.status(HTTPStatusCodes_1.HTTP.BAD_REQUEST_400); // TEST #3
        res.json(errorsInReqBody);
    }
});
exports.app.get('/hometask_01/api/videos/:id', (req, res) => {
    const video = (0, CheckReqBodyAndURI_1.videoIsExist)(db, req.params.id);
    if (video) {
        res.status(HTTPStatusCodes_1.HTTP.OK_200); // TEST #5
        res.json(video);
    }
    else
        res.sendStatus(HTTPStatusCodes_1.HTTP.NOT_FOUND_404); // TEST #6
});
exports.app.put('/hometask_01/api/videos/:id', (req, res) => {
    const video = (0, CheckReqBodyAndURI_1.videoIsExist)(db, req.params.id);
    if (video === false)
        res.sendStatus(HTTPStatusCodes_1.HTTP.NOT_FOUND_404); // TEST #7
    const errorsInReqBody = (0, CheckReqBodyAndURI_1.ReqBodyHasErrors)(req.body);
    if (!errorsInReqBody) {
        video.title = req.body.title;
        video.author = req.body.author;
        req.body.availableResolutions ? video.availableResolutions = req.body.availableResolutions : '';
        req.body.canBeDownloaded ? video.canBeDownloaded = req.body.canBeDownloaded : '';
        req.body.minAgeRestriction ? video.minAgeRestriction = req.body.minAgeRestriction : '';
        req.body.publicationDate ? video.publicationDate = req.body.publicationDate : '';
        res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #9
    }
    else {
        res.status(HTTPStatusCodes_1.HTTP.BAD_REQUEST_400); // TEST #8
        res.json(errorsInReqBody);
    }
});
exports.app.delete('/hometask_01/api/videos/:id', (req, res) => {
    const video = (0, CheckReqBodyAndURI_1.videoIsExist)(db, req.params.id);
    if (video === false)
        res.sendStatus(HTTPStatusCodes_1.HTTP.NOT_FOUND_404); // TEST #10
    else {
        db = db.filter(video => video.id !== +req.params.id);
        res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #11
    }
});
exports.app.delete('/ht_01/api/testing/all-data', (req, res) => {
    db = [];
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #1
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
