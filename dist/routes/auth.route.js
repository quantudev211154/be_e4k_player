"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
/**
 *@swagger
 * tags:
 *      name: auth
 *      description: Contains all authentication route for PLAYER (login, register, logout)
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login for player
 *     tags: [auth]
 *     description: Player enters phone => check is player exist? => if exist, let's call this API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone of player.
 *                 example: '0358444878'
 *               password:
 *                 type: string
 *                 description: The password of player.
 *                 example: '123123'
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
 *                      player:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 644ea83e19b58c0a59a4e788
 *                              phone:
 *                                  type: string
 *                                  example: 0358434916
 *                              username:
 *                                  type: string
 *                                  example: Test player
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              role:
 *                                  type: string
 *                                  example: PLAYER
 *                              level:
 *                                  type: string
 *                                  example: NEWBIE (NEWBIE | STARTER)
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                 accessToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNjgyODc4ODA4LCJleHAiOjE2ODI4ODA2MDh9.9uiHTAYLtKjcYJPjtA5stSGKNXwnScDJvMOMnYW2u74
 *                 refreshToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwidG9rZW5WZXJzaW9uIjoyLCJpYXQiOjE2ODI4Nzg4MDgsImV4cCI6MTY4MzEzODAwOH0.v-GbmDFFev-rAz8TWZfo4zFX1nJn6Tzl4wiaerKUOYA.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNjgyODc4ODA4LCJleHAiOjE2ODI4ODA2MDh9.9uiHTAYLtKjcYJPjtA5stSGKNXwnScDJvMOMnYW2u74
 *       500:
 *         description: Missing phone | login for invalid purpose (such as phone was registered as Admin right, but login as player)
 */
router.post("/login", controllers_1.AuthController.login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register for player
 *     tags: [auth]
 *     description: Call this API to register new user -> After OTP authenticated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone of player.
 *                 example: '0358444878'
 *               password:
 *                 type: string
 *                 description: The password of player.
 *                 example: '123123'
 *               username:
 *                  type: string
 *                  example: "Be Heo"
 *               level:
 *                  type: string
 *                  example: NEWBIE (NEWBIE | STARTER)
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
 *                      player:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 644ea83e19b58c0a59a4e788
 *                              phone:
 *                                  type: string
 *                                  example: 0358434916
 *                              username:
 *                                  type: string
 *                                  example: Test player
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              level:
 *                                  type: string
 *                                  example: 0
 *                              role:
 *                                  type: string
 *                                  example: PLAYER
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                 accessToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNjgyODc4ODA4LCJleHAiOjE2ODI4ODA2MDh9.9uiHTAYLtKjcYJPjtA5stSGKNXwnScDJvMOMnYW2u74
 *                 refreshToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwidG9rZW5WZXJzaW9uIjoyLCJpYXQiOjE2ODI4Nzg4MDgsImV4cCI6MTY4MzEzODAwOH0.v-GbmDFFev-rAz8TWZfo4zFX1nJn6Tzl4wiaerKUOYA.eyJ1c2VySWQiOiI2NDRlYTgzZTE5YjU4YzBhNTlhNGU3ODgiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNjgyODc4ODA4LCJleHAiOjE2ODI4ODA2MDh9.9uiHTAYLtKjcYJPjtA5stSGKNXwnScDJvMOMnYW2u74
 *       500:
 *         description: Missing phone | login for invalid purpose (such as phone was registered as Admin right, but login as player)
 */
router.post("/register", controllers_1.AuthController.register);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [auth]
 *     description: Create token to upper one and reject all token request with token.tokenVersion != player.tokenVersion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The id of player
 *                 example: '644ea83e19b58c0a59a4e788'
 *     responses:
 *       200:
 *         description: Player's logout status
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
 *                      message:
 *                          type: string
 *                          example: Player logged out
 *       500:
 *         description: Missing phone or username | Phone was used by another player
 */
router.post("/logout", controllers_1.AuthController.logout);
/**
 * @swagger
 * /auth/checkSSO:
 *   post:
 *     summary: Player no need to login in the next open app time (SSO =  Single sign on)
 *     tags: [auth]
 *     description: Create POST request with refresh token in body to this API first => server check info from refreshToken => return checkSSO status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token returned from previous successful login
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDUwM2EzNGIwNjJiNThjYTJjNmQwMzkiLCJwaG9uZSI6IjAwMDAwMDAwMDAiLCJyb2xlIjoiUExBWUVSIiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE2ODI5NzkzODAsImV4cCI6MTY4MzIzODU4MH0.eHlckR7XBiGizpcM2tylgRXpANj5Y74FsMF9vqtAhps
 *     responses:
 *       200:
 *         description: Player's logout status
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
 *                      player:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 644ea83e19b58c0a59a4e788
 *                              phone:
 *                                  type: string
 *                                  example: '0358434916'
 *                              username:
 *                                  type: string
 *                                  example: Test player
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              level:
 *                                  type: integer
 *                                  example: 0
 *                              role:
 *                                  type: string
 *                                  example: PLAYER
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                 accessToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDUwM2EzNGIwNjJiNThjYTJjNmQwMzkiLCJwaG9uZSI6IjAwMDAwMDAwMDAiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNjgyOTc5NDU2LCJleHAiOjE2ODI5ODEyNTZ9.DsDjJ4qOzia9vzEWcD0xIj5-Y8ehkK3UkszxsxZjPk8
 *                 refreshToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDUwM2EzNGIwNjJiNThjYTJjNmQwMzkiLCJwaG9uZSI6IjAwMDAwMDAwMDAiLCJyb2xlIjoiUExBWUVSIiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE2ODI5Nzk0NTYsImV4cCI6MTY4MzIzODY1Nn0.I14hgCWzrKPTieSTCtMZXPYf52yAnAEWKa5iFY1V_u4
 *       500:
 *         description: Missing phone or username | Phone was used by another player
 */
router.post("/checkSSO", controllers_1.AuthController.checkSSO);
exports.default = router;
