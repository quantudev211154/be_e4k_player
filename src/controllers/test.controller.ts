import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { ETestLevel, ITest, TestSchema } from "../models/test.model";
import { EUserLevel } from "../models";
import { TEST_PER_EXAM } from "../constants";

export async function getAnExam(req: Request, res: Response) {
  try {
    const userLevel = req.query.userLevel;

    const testFilter = {
      level:
        userLevel === EUserLevel.NEWBIE ? ETestLevel.EASY : ETestLevel.MEDIUM,
      isDeleted: false,
    };
    const tests = await TestSchema.find(testFilter).select([
      "-isDeleted",
      "-deletedBy",
      "-creator",
      "-level",
      "-createdAt",
      "-updatedAt",
      "-answers._id",
    ]);

    let exam: ITest[] = [];

    if (tests.length > TEST_PER_EXAM) {
      while (exam.length <= TEST_PER_EXAM) {
        let randomTest = tests[Math.floor(Math.random() * tests.length)];

        const existTestInExam = exam.find(
          (item) => item._id.toString() == randomTest._id.toString()
        );

        if (!existTestInExam) exam.push(randomTest);
      }
    } else exam = tests;

    return HelperUtil.returnSuccessfulResult(res, { exam });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
