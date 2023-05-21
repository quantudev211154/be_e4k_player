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
 *      name: test
 *      description: Contains all PUBLIC routes that player side (android version) can use
 */
/**
 * @swagger
 * /test?userLevel={userLevel}:
 *   get:
 *     summary: Get get exam for user (1 exam contains 15 test)
 *     tags: [test]
 *     description: Call this API to get test for user
 *     parameters:
 *         - in: path
 *           name: userLevel
 *           schema:
 *              type: string
 *           required: true
 *           description: The current level of user (NEWBIE | STARTER)
 *           example: NEWBIE
 *     responses:
 *       200:
 *         description: User info updated
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
 *                      exam:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: 64699c7d7d9a975c2ba796b8
 *                                  question:
 *                                      type: string
 *                                      example: Nghe mua thu em a ben them
 *                                  attachment:
 *                                      type: string
 *                                      example: 'link ne hihi'
 *                                  attachmentType:
 *                                      type: string
 *                                      example: IMAGE (IMAGE | AUDIO)
 *                                  correctAnswer:
 *                                      type: string
 *                                      example:  "#4bb4e9-4bd61c15-5f87-4003-b3c9-810eea8e8974"
 *                                  answers:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              answerId:
 *                                                  type: string
 *                                                  example: "#4bb4e9-4bd61c15-5f87-4003-b3c9-810eea8e8974"
 *                                              content:
 *                                                  type: string
 *                                                  example: Dung
 *                                  score:
 *                                      type: number
 *                                      example: 10
 *       500:
 *         description: Missing userId or not found user | Phone was used by another player
 */
router.get("/", auth_middleware_1.checkAuth, controllers_1.TestController.getAnExam);
exports.default = router;
