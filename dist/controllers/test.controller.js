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
exports.getAnExam = void 0;
const utils_1 = require("../utils");
const test_model_1 = require("../models/test.model");
const constants_1 = require("../constants");
function getAnExam(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testFilter = {
                isDeleted: false,
            };
            const tests = yield test_model_1.TestSchema.find(testFilter).select([
                "-isDeleted",
                "-deletedBy",
                "-creator",
                "-level",
                "-createdAt",
                "-updatedAt",
                "-answers._id",
            ]);
            let exam = [];
            while (exam.length < constants_1.TEST_PER_EXAM) {
                let randomTest = tests[Math.floor(Math.random() * tests.length)];
                const existTestInExam = exam.find((item) => item._id.toString() == randomTest._id.toString());
                if (!existTestInExam)
                    exam.push(randomTest);
            }
            return utils_1.HelperUtil.returnSuccessfulResult(res, { exam });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.getAnExam = getAnExam;
