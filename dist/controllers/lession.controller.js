"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLessionByCourseId = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const models_1 = require("../models");
function getAllLessionByCourseId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { courseId } = req.params;
            const { userId } = req.body;
            if (!courseId || !userId)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_MISSING_PARAMS);
            const course = yield models_1.CourseSchema.findById(courseId).select([
                "-lessions.level",
                "-lessions.type",
                "-lessions.creator",
            ]);
            if (!course)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_NO_COURSE_FOUND);
            const lessions = [];
            const diaryFilter = {
                user: userId,
            };
            const diary = yield models_1.DiarySchema.findOne(diaryFilter);
            for (let i = 0; i < course.lessions.length; ++i) {
                let currentLession = course.lessions[i];
                currentLession = Object.assign(Object.assign({}, currentLession._doc), { totalRounds: currentLession.rounds.length });
                if (diary) {
                    const courseInDiary = diary.courses.find((course) => course.course.toString() == courseId.toString());
                    if (courseInDiary) {
                        const lessionInDiary = courseInDiary.lessions.find((lession) => lession.lession.toString() == currentLession._id.toString());
                        if (lessionInDiary) {
                            const roundsInDiary = lessionInDiary.rounds;
                            const newRounds = [];
                            for (let j = 0; j < currentLession.rounds.length; ++j) {
                                const isPlayed = roundsInDiary.find((round) => round.roundId === currentLession.rounds[j].roundId);
                                newRounds.push(Object.assign(Object.assign({}, currentLession.rounds[j]), { playStatus: isPlayed
                                        ? isPlayed.playStatus
                                        : models_1.ERoundPlayStatus.NONE }));
                            }
                            currentLession = Object.assign(Object.assign({}, currentLession), { rounds: newRounds, playedRounds: lessionInDiary.rounds.filter((round) => round.playStatus === models_1.ERoundPlayStatus.DONE).length });
                        }
                        else {
                            const newRounds = [];
                            for (let i = 0; i < currentLession.rounds.length; ++i) {
                                currentLession.rounds[i].playStatus = models_1.ERoundPlayStatus.NONE;
                                newRounds.push(currentLession.rounds[i]);
                            }
                            currentLession = Object.assign(Object.assign({}, currentLession), { playedRounds: 0, rounds: newRounds });
                        }
                    }
                    else {
                        const newRounds = [];
                        for (let i = 0; i < currentLession.rounds.length; ++i) {
                            currentLession.rounds[i].playStatus = models_1.ERoundPlayStatus.NONE;
                            newRounds.push(currentLession.rounds[i]);
                        }
                        currentLession = Object.assign(Object.assign({}, currentLession), { playedRounds: 0, rounds: newRounds });
                    }
                }
                else {
                    const newRounds = [];
                    for (let i = 0; i < currentLession.rounds.length; ++i) {
                        currentLession.rounds[i].playStatus = models_1.ERoundPlayStatus.NONE;
                        newRounds.push(currentLession.rounds[i]);
                    }
                    currentLession = Object.assign(Object.assign({}, currentLession), { playedRounds: 0, rounds: newRounds });
                }
                lessions.push(currentLession);
            }
            return utils_1.HelperUtil.returnSuccessfulResult(res, { lession: lessions });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.getAllLessionByCourseId = getAllLessionByCourseId;
