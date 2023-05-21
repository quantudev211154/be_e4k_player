"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
/**
 *@swagger
 * tags:
 *      name: diary
 *      description: Contains all API for diary (PLAYER side)
 */
/**
 * @swagger
 * /diary:
 *   post:
 *     summary: Update diary for player after played one round (must provide token)
 *     tags: [diary]
 *     description: Player plays one round successfully => Call this API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The playerId
 *                 example: '644ea83e19b58c0a59a4e788'
 *               courseId:
 *                 type: string
 *                 description: The Id of course that contains round player is playing
 *                 example: '645d5c221aaa7ea41bb42a6f'
 *               lessionId:
 *                 type: string
 *                 description: The Id of lession that containes round player is playing
 *                 example: '645d5c371aaa7ea41bb42a75'
 *               roundId:
 *                 type: string
 *                 description: The Id round that player is playing
 *                 example: '#5eceed-288a8bb5-2d52-4a23-b4df-78411d889883'
 *               score:
 *                 type: number
 *                 description: The score of round that user is playing
 *                 example: 200
 *               hearts:
 *                 type: number
 *                 description: The remain hearts of player
 *                 example: 3
 *               playStatus:
 *                 type: string
 *                 description: Play status of round (DONE | FAILED)
 *                 example: DONE
 *     responses:
 *       200:
 *         description: Diary of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status from server
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                      updatedCourseInDiary:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 645d5cb51aaa7ea41bb42a8c
 *                              user:
 *                                  type: string
 *                                  example: 644ea83e19b58c0a59a4e788
 *                              courses:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              example: 645d5cb51aaa7ea41bb42a8d
 *                                          course:
 *                                              type: string
 *                                              example: 645d5c221aaa7ea41bb42a6f
 *                                          isCompleted:
 *                                              type: boolean
 *                                              example: false
 *                                          lessions:
 *                                              type: array
 *                                              items:
 *                                                  type: object
 *                                                  properties:
 *                                                      _id:
 *                                                          type: string
 *                                                          example: 645d5cb51aaa7ea41bb42a8e
 *                                                      lession:
 *                                                          type: string
 *                                                          example: 645d5c371aaa7ea41bb42a75
 *                                                      isCompleted:
 *                                                          type: boolean
 *                                                          example: false
 *                                                      rounds:
 *                                                          type: array
 *                                                          items:
 *                                                              type: object
 *                                                              properties:
 *                                                                  _id:
 *                                                                      type: string
 *                                                                      example: 645d5cb51aaa7ea41bb42a8f
 *                                                                  roundId:
 *                                                                      type: string
 *                                                                      example: #ad8aa8-7e40dd89-3fe8-4f1c-b2ef-5d00d09747ed
 *                                                                  score:
 *                                                                      type: number
 *                                                                      score: 100
 *                                                                  playedAt:
 *                                                                      type: Date
 *                                                                      example: 2023-05-11T21:16:27.108Z
 *                                                                  playStatus:
 *                                                                      type: string
 *                                                                      example: DONE (DONE | FAILED)
 *       500:
 *         description: Missing phone | login for invalid purpose (such as phone was registered as Admin right, but login as player)
 */
router.post("/", auth_middleware_1.checkAuth, controllers_1.DiaryController.updateDiary);
exports.default = router;
