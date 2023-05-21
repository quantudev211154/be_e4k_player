"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSSO = exports.logout = exports.register = exports.login = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const models_1 = require("../models");
const auth_util_1 = require("../utils/auth.util");
const argon2_1 = require("argon2");
const jsonwebtoken_1 = require("jsonwebtoken");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { phone, password } = req.body;
            if (!phone || !password)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_MISSING_PARAMS);
            const existPlayer = yield models_1.UserSchema.findOne({ phone });
            if (!existPlayer)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_NOT_FOUND_USER_BY_PHONE_NUMBER);
            if (existPlayer.role === models_1.EUserRole.ADMIN)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_LOGIN_DENIED);
            const isValidPassword = yield (0, argon2_1.verify)(existPlayer.password, password);
            if (!isValidPassword)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_LOGIN_FAILED);
            const accessToken = utils_1.AuthUtil.createToken("accessToken", existPlayer);
            const refreshToken = utils_1.AuthUtil.createToken("refreshToken", existPlayer);
            (0, auth_util_1.removePlayerSensitiveAttributes)(existPlayer);
            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                player: existPlayer,
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.login = login;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { phone, username, password, level } = req.body;
            if (!phone || !username || !password || !level)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_MISSING_PARAMS);
            const existPlayer = yield models_1.UserSchema.findOne({ phone });
            if (existPlayer)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_EXISTED_USER);
            const hashedPassword = yield (0, argon2_1.hash)(password);
            const newPlayer = yield new models_1.UserSchema({
                phone,
                username,
                hearts: 5,
                golds: 500,
                level,
                password: hashedPassword,
            }).save();
            const accessToken = utils_1.AuthUtil.createToken("accessToken", newPlayer);
            const refreshToken = utils_1.AuthUtil.createToken("refreshToken", newPlayer);
            (0, auth_util_1.removePlayerSensitiveAttributes)(newPlayer);
            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                player: newPlayer,
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.register = register;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            if (!id)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_MISSING_PARAMS);
            const existPlayer = yield models_1.UserSchema.findById(id);
            if (!existPlayer)
                return utils_1.HelperUtil.returnErrorResult(res, constants_1.APIMessage.ERR_NO_EXIST_ADMIN);
            yield models_1.UserSchema.findByIdAndUpdate(id, {
                tokenVersion: existPlayer.tokenVersion + 1,
            });
            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                message: "Player logged out",
            });
        }
        catch (error) {
            return utils_1.HelperUtil.returnErrorResult(res, error);
        }
    });
}
exports.logout = logout;
function checkSSO(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken)
                return utils_1.HelperUtil.returnUnauthorizedResult(res);
            const decoded = (0, jsonwebtoken_1.verify)(refreshToken, process.env.E4K_REFRESH_TOKEN_SECRET);
            const existPlayer = yield models_1.UserSchema.findById(decoded.userId);
            if (!existPlayer || existPlayer.tokenVersion !== decoded.tokenVersion)
                return utils_1.HelperUtil.returnUnauthorizedResult(res);
            (0, auth_util_1.sendRefreshToken)(res, existPlayer);
            (0, auth_util_1.removePlayerSensitiveAttributes)(existPlayer);
            return utils_1.HelperUtil.returnSuccessfulResult(res, {
                player: existPlayer,
                accessToken: utils_1.AuthUtil.createToken("accessToken", existPlayer),
            });
        }
        catch (error) {
            console.log(error);
            return utils_1.HelperUtil.returnUnauthorizedResult(res);
        }
    });
}
exports.checkSSO = checkSSO;
