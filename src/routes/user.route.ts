import express from "express";
import { UserController } from "../controllers";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 *@swagger
 * tags:
 *      name: user
 *      description: Contains all PUBLIC routes that player side (android version) can use
 */

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update username for player (must provide accessToken)
 *     tags: [user]
 *     description: Call this API to update username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username of player
 *                 example: 'Quan Tu HEHEHE'
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *       500:
 *         description: Missing username or userId | Phone was used by another player
 */
router.put("/", checkAuth, UserController.updateUsername);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get info of player (must provide token)
 *     tags: [user]
 *     description: Call this API to get user info
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *       500:
 *         description: Missing userId or not found user | Phone was used by another player
 */
router.get("/", checkAuth, UserController.getUserInfo);

/**
 * @swagger
 * /user/hearts:
 *   post:
 *     summary: Buy heart for player
 *     tags: [user]
 *     description: Call this API to buy heart => player info after buy hearts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hearts:
 *                 type: string
 *                 description: Hearts qty that players want to buy (should be 3 or 5)
 *                 example: '3'
 *     responses:
 *       200:
 *         description: Player info after buy hearts (hearts increased, golds descreased)
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                              golds:
 *                                  type: integer
 *                                  example: 100
 *                              hearts:
 *                                  type: integer
 *                                  example: 3
 *       500:
 *         description: Missing userId or hearts | Not found user | No enough golds to buy hearts | Current player hearts hit maximum hearts (5) | Phone was used by another player
 */
router.post("/hearts", checkAuth, UserController.buyHearts);

/**
 * @swagger
 * /user/updateGolds:
 *   post:
 *     summary: Update golds for player
 *     tags: [user]
 *     description: Player receive login gift => Call this API to update player golds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               golds:
 *                 type: string
 *                 description: Golds that user will be updated (increase)
 *                 example: '100'
 *     responses:
 *       200:
 *         description: Player info after buy hearts (hearts increased, golds descreased)
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              registerDate:
 *                                  type: Date
 *                                  example: 2023-04-30T17:41:18.167Z
 *                              golds:
 *                                  type: integer
 *                                  example: 100
 *                              hearts:
 *                                  type: integer
 *                                  example: 3
 *       500:
 *         description: Missing userId or golds | Not found user
 */
router.post("/updateGolds", checkAuth, UserController.updateGolds);

/**
 * @swagger
 * /user/scoreBoard:
 *   get:
 *     summary: Get scoreboard from all players score
 *     tags: [user]
 *     description: Call this API to get player scoreboard
 *     responses:
 *       200:
 *         description: Score board
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
 *                      players:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *       500:
 *         description: Missing userId or not found user | Phone was used by another player
 */
router.get("/scoreBoard", checkAuth, UserController.getScoreboard);

/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Change password for player (must provide token)
 *     tags: [user]
 *     description: Call this API to help user change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Old password of player
 *                 example: '123123'
 *               newPassword:
 *                 type: string
 *                 description: New password of player
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: User info after password changed
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *       500:
 *         description: Missing userId or not found user | Phone was used by another player
 */
router.put("/change-password", checkAuth, UserController.changePassword);

/**
 * @swagger
 * /user/forget-password:
 *   put:
 *     summary: Recover password for player (no need token)
 *     tags: [user]
 *     description: Call this API to help user recover password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Phone of player
 *                 example: '0358444878'
 *               newPassword:
 *                 type: string
 *                 description: New password of player
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: User info after password changed
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *       500:
 *         description: Missing userId or not found user | Phone was used by another player
 */
router.put("/forget-password", UserController.recoverPassword);

/**
 * @swagger
 * /user/login-rewards:
 *   put:
 *     summary: Update login rewards for play (must provide token)
 *     tags: [user]
 *     description: Call this API to help user receives login rewards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               golds:
 *                 type: integer
 *                 description: Golds what user can be received
 *                 example: '100'
 *     responses:
 *       200:
 *         description: User info after password changed
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *                              claimCount:
 *                                  type: integer
 *                                  example: 2
 *                              lastClaimdDate:
 *                                  type: Date
 *                                  example: 2023-05-14T04:47:02.730Z
 *       500:
 *         description: Missing userId, golds or not found user | Phone was used by another player
 */
router.put("/login-rewards", checkAuth, UserController.updateLoginReward);

/**
 * @swagger
 * /user/update-hearts:
 *   put:
 *     summary: Update heart for user (must provide token)
 *     tags: [user]
 *     description: Call this API to update hearts of user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hearts:
 *                 type: integer
 *                 description: New hearts of user
 *                 example: 2
 *     responses:
 *       200:
 *         description: User info after updated hearts
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
 *                      updatedUser:
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
 *                                  example: Pham Quan Tu HIHIHI
 *                              weeklyScore:
 *                                  type: integer
 *                                  example: 0
 *                              golds:
 *                                  type: integer
 *                                  example: 0
 *                              hearts:
 *                                  type: integer
 *                                  example: 0
 *                              claimCount:
 *                                  type: integer
 *                                  example: 2
 *                              lastClaimdDate:
 *                                  type: Date
 *                                  example: 2023-05-14T04:47:02.730Z
 *       500:
 *         description: Missing userId, hearts or not found user | Phone was used by another player
 */
router.put("/update-hearts", checkAuth, UserController.updateHearts);

export default router;
