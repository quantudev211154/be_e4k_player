import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { ETestLevel, ITest, TestSchema } from "../models/test.model";
import { EUserLevel } from "../models";
import { TEST_PER_EXAM } from "../constants";

export async function getAnExam(req: Request, res: Response) {
  try {
    const testFilter = {
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

    while (exam.length < TEST_PER_EXAM) {
      let randomTest = tests[Math.floor(Math.random() * tests.length)];

      const existTestInExam = exam.find(
        (item) => item._id.toString() == randomTest._id.toString()
      );

      if (!existTestInExam) exam.push(randomTest);
    }

    return HelperUtil.returnSuccessfulResult(res, { exam });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
