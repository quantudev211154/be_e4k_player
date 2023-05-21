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
exports.getAllCourse = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
function getAllCourse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            let courses;
            const filter = {
                type: models_1.ECLRStatus.PUBLISHED,
                isDeleted: false,
            };
            const foundCourses = yield models_1.CourseSchema.find(filter)
                .select([
                "-level",
                "-creator",
                "-isDeleted",
                "-deletedBy",
                "-updatedAt",
                "-type",
            ])
                .sort({ position: -1 });
            courses = [...foundCourses];
            for (let i = 0; i < courses.length; ++i) {
                const diary = yield models_1.DiarySchema.findOne({ user: userId });
                let currentLevel = 0;
                if (!diary) {
                    currentLevel = 0;
                }
                else {
                    const targetCourseInDiary = diary.courses.find((item) => item.course.toString() == courses[i]._id.toString());
                    if (!targetCourseInDiary)
                        currentLevel = 0;
                    else {
                        let level = 0;
                        for (let j = 0; j < courses[i].lessions.length; ++j) {
                            const currentCourseLession = courses[i].lessions[j];
                            const existLessionInCourseDiary = targetCourseInDiary.lessions.find((lession) => lession.lession.toString() ==
                                currentCourseLession._id.toString());
                            if (existLessionInCourseDiary) {
                                if (existLessionInCourseDiary.rounds.length ===
                                    currentCourseLession.rounds.length)
                                    level++;
                            }
                        }
                        currentLevel = level;
                    }
                }
                const courseLessionNumber = courses[i].lessions.length;
                courses[i] = Object.assign(Object.assign({}, courses[i]._doc), { currentLevel, totalLevel: courseLessionNumber });
                courses[i].lessions = undefined;
            }
            return utils_1.HelperUtil.returnSuccessfulResult(res, { courses });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.getAllCourse = getAllCourse;
