import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { APIMessage } from "../constants";
import {
  CourseSchema,
  DiarySchema,
  ERoundPlayStatus,
  IDiaryCourse,
  IDiaryLessionRound,
  UserSchema,
} from "../models";

export async function updateDiary(req: Request, res: Response) {
  try {
    const { userId, courseId, lessionId, roundId, score, hearts, playStatus } =
      req.body;

    if (
      !userId ||
      !courseId ||
      !lessionId ||
      !roundId ||
      score === undefined ||
      !hearts ||
      !playStatus
    )
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const existCourse = await CourseSchema.findById(courseId);

    if (!existCourse)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_NO_COURSE_FOUND);

    const existCourseInDiaryFilter = {
      user: userId,
    };

    Promise.all([
      UserSchema.findById(userId),
      DiarySchema.findOne(existCourseInDiaryFilter),
    ])
      .then(async ([user, existCourseInDiary]) => {
        if (user) {
          let userUpdater: any = {
            hearts,
          };

          if (playStatus === ERoundPlayStatus.DONE) {
            userUpdater = {
              ...userUpdater,
              weeklyScore: user.weeklyScore
                ? user.weeklyScore + parseInt(score)
                : parseInt(score),
              golds: user.golds
                ? Math.round(user.golds + score / 2)
                : Math.round(score / 2),
            };
          }
          const userUpdate = UserSchema.findByIdAndUpdate(userId, userUpdater);

          if (!existCourseInDiary) {
            const newDiarySchema = new DiarySchema({
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

            Promise.all([userUpdate, newDiarySchema]).then(
              ([userUpdated, updatedCourseInDiary]) => {
                return HelperUtil.returnSuccessfulResult(res, {
                  updatedCourseInDiary,
                });
              }
            );
          } else {
            const isExistCourse = existCourseInDiary.courses.find(
              (course) => course.course.toString() == courseId.toString()
            );

            if (!isExistCourse) {
              const newCourse: IDiaryCourse = {
                course: courseId,
                isCompleted: existCourse.lessions.length === 1,
                lessions: [
                  {
                    lession: lessionId,
                    isCompleted:
                      existCourse.lessions.find(
                        (lession) =>
                          lession._id.toString() == lessionId.toString()
                      )?.rounds.length === 1,
                    rounds: [
                      {
                        roundId,
                        playStatus,
                        score,
                      },
                    ],
                  },
                ],
              };

              existCourseInDiary.courses.push(newCourse);
            } else {
              for (let i = 0; i < existCourseInDiary.courses.length; ++i) {
                const currentCourse = existCourseInDiary.courses[i];

                if (currentCourse.course.toString() == courseId.toString()) {
                  const existLessionInCourseDiary = currentCourse.lessions.find(
                    (lession) =>
                      lession.lession.toString() == lessionId.toString()
                  );

                  if (!existLessionInCourseDiary) {
                    currentCourse.lessions.push({
                      lession: lessionId,
                      isCompleted:
                        existCourse.lessions.find(
                          (lession) =>
                            lession._id.toString() == lessionId.toString()
                        )?.rounds.length === 1
                          ? true
                          : false,
                      rounds: [{ roundId, score, playStatus }],
                    });
                  } else {
                    for (let j = 0; j < currentCourse.lessions.length; ++j) {
                      const currentLession = currentCourse.lessions[j];

                      if (
                        currentLession.lession.toString() ==
                        lessionId.toString()
                      ) {
                        let existRoundInDiary = currentLession.rounds.find(
                          (round) => round.roundId === roundId
                        );

                        if (!existRoundInDiary)
                          currentLession.rounds.push({
                            roundId,
                            score,
                            playStatus,
                          });
                        else {
                          const newRounds = currentLession.rounds.map(
                            (round) => {
                              if (round.roundId === roundId)
                                round = {
                                  ...round,
                                  score,
                                  playStatus,
                                };

                              return round;
                            }
                          );

                          currentLession.rounds = newRounds;
                        }
                      }

                      const lessionInExistCourse = existCourse.lessions.find(
                        (lession) =>
                          lession._id.toString() ==
                          currentLession.lession.toString()
                      );

                      if (
                        lessionInExistCourse &&
                        currentLession.rounds.filter(
                          (round) => round.playStatus === ERoundPlayStatus.DONE
                        ).length >= lessionInExistCourse.rounds.length
                      )
                        currentLession.isCompleted = true;
                    }
                  }
                }

                const completedCourseInDiary = currentCourse.lessions.filter(
                  (lession) => lession.isCompleted
                );

                if (
                  completedCourseInDiary.length >= currentCourse.lessions.length
                )
                  currentCourse.isCompleted = true;
              }
            }

            Promise.all([userUpdate, existCourseInDiary.save()]).then(
              ([userUpdated, updatedCourseInDiary]) => {
                return HelperUtil.returnSuccessfulResult(res, {
                  updatedCourseInDiary,
                });
              }
            );
          }
        } else {
          return HelperUtil.returnErrorResult(res, APIMessage.ERR_UNEXPECTED);
        }
      })
      .catch((err) => {
        return HelperUtil.returnErrorResult(res, APIMessage.ERR_UNEXPECTED);
      });
  } catch (error: any) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
