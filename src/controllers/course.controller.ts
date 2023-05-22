import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { CourseSchema, DiarySchema, ECLRStatus } from "../models";

export async function getAllCourse(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    let courses: any;

    const filter = {
      type: ECLRStatus.PUBLISHED,
      isDeleted: false,
    };
    const foundCourses = await CourseSchema.find(filter)
      .select([
        "-level",
        "-creator",
        "-isDeleted",
        "-deletedBy",
        "-updatedAt",
        "-type",
      ])
      .sort({ position: 1 });

    courses = [...foundCourses];

    for (let i = 0; i < courses.length; ++i) {
      const diary = await DiarySchema.findOne({ user: userId });
      let currentLevel = 0;

      if (!diary) {
        currentLevel = 0;
      } else {
        const targetCourseInDiary = diary.courses.find(
          (item) => item.course.toString() == courses[i]._id.toString()
        );

        if (!targetCourseInDiary) currentLevel = 0;
        else {
          let level = 0;

          for (let j = 0; j < courses[i].lessions.length; ++j) {
            const currentCourseLession = courses[i].lessions[j];
            const existLessionInCourseDiary = targetCourseInDiary.lessions.find(
              (lession) =>
                lession.lession.toString() ==
                currentCourseLession._id.toString()
            );

            if (existLessionInCourseDiary) {
              if (
                existLessionInCourseDiary.rounds.length ===
                currentCourseLession.rounds.length
              )
                level++;
            }
          }

          currentLevel = level;
        }
      }

      const courseLessionNumber = courses[i].lessions.length;

      courses[i] = {
        ...courses[i]._doc,
        currentLevel,
        totalLevel: courseLessionNumber,
      };

      courses[i].lessions = undefined;
    }

    return HelperUtil.returnSuccessfulResult(res, { courses });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
