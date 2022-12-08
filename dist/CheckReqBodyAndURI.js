"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoIsExist = exports.ReqBodyHasErrors = void 0;
const models = __importStar(require("./models"));
const ReqBodyHasErrors = (body) => {
    const errors = []; // NO TYPE !!!
    // let errorsMessages: Array<models.FieldError>;
    if (!body.title || body.title.length > 40) {
        errors.push({ message: 'incorrect title', field: 'title' });
    }
    ;
    if (!body.author || body.author.length > 20) {
        errors.push({ message: 'incorrect author', field: 'author' });
    }
    ;
    if (body.availableResolutions) {
        const resolutionArray = Array.from(new Set(body.availableResolutions));
        if (resolutionArray.length !== body.availableResolutions.length) {
            errors.push({
                message: 'incorrect availableResolutions',
                field: 'availableResolutions'
            });
        }
        else {
            for (let res of body.availableResolutions) {
                if (!(res in models.videoResolution)) {
                    errors.push({
                        message: 'incorrect availableResolutions',
                        field: 'availableResolutions'
                    });
                    break;
                }
            }
        }
    }
    ;
    if (body.canBeDownloaded !== true || body.canBeDownloaded !== false) {
        errors.push({
            message: 'incorrect canBeDownloaded',
            field: 'canBeDownloaded'
        });
    }
    ;
    if (body.minAgeRestriction) {
        const age = body.minAgeRestriction;
        if (!(age >= 1 && age <= 18 || age === null)) {
            errors.push({
                message: 'incorrect minAgeRestriction',
                field: 'minAgeRestriction'
            });
        }
    }
    ;
    if (body.publicationDate) {
        if (new Date(body.publicationDate).toISOString() !== body.publicationDate) {
            errors.push({
                message: 'incorrect publicationDate',
                field: 'publicationDate'
            });
        }
        ;
    }
    ;
    if (errors.length > 0) {
        return { errorsMessages: errors };
    }
    else
        return false;
};
exports.ReqBodyHasErrors = ReqBodyHasErrors;
const videoIsExist = (db, id) => {
    const video = db.filter((el) => el.id === +id)[0];
    return video ? video : false;
};
exports.videoIsExist = videoIsExist;
