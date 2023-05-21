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
 *      name: course
 *      description: Contains all API for course (PLAYER side)
 */
/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all course (without lession)
 *     tags: [course]
 *     description: Call this API (must provide accessToken)
 *     responses:
 *       200:
 *         description: All published course
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
 *                      courses:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: 64571ee67733e42b4241a91f
 *                                  title:
 *                                      type: string
 *                                      example: Test 1
 *                                  description:
 *                                      type: string
 *                                      example: hoa hoc de test thoi
 *                                  createdAt:
 *                                      type: Date
 *                                      example: 2023-05-07T03:45:42.746Z
 *                                  currentLevel:
 *                                      type: integer
 *                                      example: 0
 *                                  totalLevel:
 *                                      type: integer
 *                                      example: 1
 *       500:
 *         description: Missing phone or username | Phone was used by another player
 */
router.get("/", auth_middleware_1.checkAuth, controllers_1.CourseController.getAllCourse);
exports.default = router;
