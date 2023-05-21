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
 *      name: lession
 *      description: Contains all API for lession (PLAYER side)
 */
/**
 * @swagger
 * /lession/{courseId}:
 *   get:
 *     summary: Get all lessions by courseId
 *     tags: [lession]
 *     description: Player enters phone => check is player exist? => if exist, let's call this API
 *     parameters:
 *        - in: path
 *          name: courseId
 *          schema:
 *            type: string
 *          required: true
 *          description: CourseId
 *     responses:
 *       200:
 *         description: Player info (without password), accessToken, refreshToken
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
 *                      lessions:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                title: string
 *                                example: 64571ef57733e42b4241a925
 *                              title:
 *                                type: string
 *                                example: Chuong test so 1
 *                              description:
 *                                type: string
 *                                example: Test chuong so 1 thoi
 *                              rounds:
 *                                type: array
 *                                items:
 *                                  type: object
 *                                  properties:
 *                                    playType:
 *                                        type: integer
 *                                        example: 1
 *                                    score:
 *                                        type: integer
 *                                        example: 10
 *                                    playStatus:
 *                                        type: string
 *                                        example: DONE (DONE | FAILED | NONE)
 *       500:
 *         description: Missing phone | login for invalid purpose (such as phone was registered as Admin right, but login as player)
 */
router.get("/:courseId", auth_middleware_1.checkAuth, controllers_1.LessionController.getAllLessionByCourseId);
exports.default = router;
