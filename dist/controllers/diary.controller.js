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
exports.updateDiary = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const models_1 = require("../models");
function updateDiary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, courseId, lessionId, roundId, score, hearts, playStatus } = req.body;
            if (!userId ||
                !courseId ||
                !lessionId ||
                !roundId ||
                score === undefined ||
                !hearts ||
                !playStatus)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_MISSING_PARAMS);
            const existCourse = yield models_1.CourseSchema.findById(courseId);
            if (!existCourse)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_NO_COURSE_FOUND);
            const existCourseInDiaryFilter = {
                user: userId,
            };
            Promise.all([
                models_1.UserSchema.findById(userId),
                models_1.DiarySchema.findOne(existCourseInDiaryFilter),
            ])
                .then(([user, existCourseInDiary]) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (user) {
                    let userUpdater = {
                        hearts,
                    };
                    if (playStatus === models_1.ERoundPlayStatus.DONE) {
                        userUpdater = Object.assign(Object.assign({}, userUpdater), { weeklyScore: user.weeklyScore
                                ? user.weeklyScore + parseInt(score)
                                : parseInt(score), golds: user.golds
                                ? Math.round(user.golds + score / 2)
                                : Math.round(score / 2) });
                    }
                    const userUpdate = models_1.UserSchema.findByIdAndUpdate(userId, userUpdater);
                    if (!existCourseInDiary) {
                        const newDiarySchema = new models_1.DiarySchema({
                            user: userId,
                            courses: [
                                {
                                    course: courseId,
                                    lessions: [
                                        {
                                            lession: lessionId,
                                            rounds: [
                                                {
                                                    roundId,
                                                    score,
                                                    playStatus,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        }).save();
                        Promise.all([userUpdate, newDiarySchema]).then(([userUpdated, updatedCourseInDiary]) => {
                            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                                updatedCourseInDiary,
                            });
                        });
                    }
                    else {
                        for (let i = 0; i < existCourseInDiary.courses.length; ++i) {
                            const currentCourse = existCourseInDiary.courses[i];
                            if (currentCourse.course.toString() == courseId.toString()) {
                                const existLessionInCourseDiary = currentCourse.lessions.find((lession) => lession.lession.toString() == lessionId.toString());
                                if (!existLessionInCourseDiary) {
                                    currentCourse.lessions.push({
                                        lession: lessionId,
                                        isCompleted: ((_a = existCourse.lessions.find((lession) => lession._id.toString() == lessionId.toString())) === null || _a === void 0 ? void 0 : _a.rounds.length) === 1
                                            ? true
                                            : false,
                                        rounds: [{ roundId, score, playStatus }],
                                    });
                                }
                                else {
                                    for (let j = 0; j < currentCourse.lessions.length; ++j) {
                                        const currentLession = currentCourse.lessions[j];
                                        if (currentLession.lession.toString() == lessionId.toString()) {
                                            let existRoundInDiary = currentLession.rounds.find((round) => round.roundId === roundId);
                                            if (!existRoundInDiary)
                                                currentLession.rounds.push({
                                                    roundId,
                                                    score,
                                                    playStatus,
                                                });
                                            else {
                                                const newRounds = currentLession.rounds.map((round) => {
                                                    if (round.roundId === roundId)
                                                        round = Object.assign(Object.assign({}, round), { score,
                                                            playStatus });
                                                    return round;
                                                });
                                                currentLession.rounds = newRounds;
                                            }
                                        }
                                        const lessionInExistCourse = existCourse.lessions.find((lession) => lession._id.toString() ==
                                            currentLession.lession.toString());
                                        if (lessionInExistCourse &&
                                            currentLession.rounds.filter((round) => round.playStatus === models_1.ERoundPlayStatus.DONE).length >= lessionInExistCourse.rounds.length)
                                            currentLession.isCompleted = true;
                                    }
                                }
                            }
                            const completedCourseInDiary = currentCourse.lessions.filter((lession) => lession.isCompleted);
                            if (completedCourseInDiary.length >= currentCourse.lessions.length)
                                currentCourse.isCompleted = true;
                        }
                        Promise.all([userUpdate, existCourseInDiary.save()]).then(([userUpdated, updatedCourseInDiary]) => {
                            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                                updatedCourseInDiary,
                            });
                        });
                    }
                }
                else {
                    return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_UNEXPECTED);
                }
            }))
                .catch((err) => {
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_UNEXPECTED);
            });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.updateDiary = updateDiary;
