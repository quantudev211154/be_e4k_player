import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { APIMessage } from "../constants";
import { CourseSchema, DiarySchema } from "../models";

export async function getAllLessionByCourseId(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!courseId || !userId)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const course = await CourseSchema.findById(courseId).select([
      "-lessions.level",
      "-lessions.type",
      "-lessions.creator",
    ]);

    if (!course)
      HelperUtil.returnErrorResult(res, APIMessage.ERR_NO_COURSE_FOUND);

    if (course) {
      const lessions: any = [];

      for (let i = 0; i < course.lessions.length; ++i) {
        let currentLession = course.lessions[i] as any;
        currentLession = {
          ...currentLession._doc,
          totalRounds: currentLession.rounds.length,
        };

        const diaryFilter = {
          user: userId,
        };
        const diary = await DiarySchema.findOne(diaryFilter);

        if (diary) {
          const courseInDiary = diary.courses.find(
            (course) => course.course.toString() == courseId.toString()
          );

          if (courseInDiary) {
            const lessionInDiary = courseInDiary.lessions.find(
              (lession) =>
                lession.lession.toString() == currentLession._id.toString()
            );

            if (lessionInDiary) {
              const roundsInDiary = lessionInDiary.rounds;
              const newRounds = [];

              for (let j = 0; j < currentLession.rounds.length; ++j) {
                const isPlayed = roundsInDiary.find(
                  (round) => round.roundId === currentLession.rounds[j].roundId
                );

                if (isPlayed) {
                  newRounds.push({
                    ...currentLession.rounds[j],
                    isPlayed: true,
                  });
                } else {
                  newRounds.push({
                    ...currentLession.rounds[j],
                    isPlayed: false,
                  });
                }
              }

              currentLession = {
                ...currentLession,
                rounds: newRounds,
                playedRounds: lessionInDiary.rounds.length,
              };
            } else {
              currentLession = {
                ...currentLession,
                playedRounds: 0,
              };
            }
          }
        } else {
          currentLession = {
            ...currentLession,
            playedRounds: 0,
          };
        }

        lessions.push(currentLession);
      }

      return HelperUtil.returnSuccessfulResult(res, { lession: lessions });
    }
  } catch (error: any) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
