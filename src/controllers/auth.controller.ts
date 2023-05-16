import { Request, Response } from "express";
import { AuthUtil, HelperUtil } from "../utils";
import { APIMessage } from "../constants";
import { EUserRole, UserSchema } from "../models";
import {
  removeAdminSensitiveAttributes,
  removePlayerSensitiveAttributes,
  sendRefreshToken,
} from "../utils/auth.util";
import { hash, verify } from "argon2";
import { Secret, verify as JWTVerify } from "jsonwebtoken";
import { TAuthPayload } from "../types/auth.type";

export async function login(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const existPlayer = await UserSchema.findOne({ phone });

    if (!existPlayer)
      return HelperUtil.returnErrorResult(
        res,
        APIMessage.ERR_NOT_FOUND_USER_BY_PHONE_NUMBER
      );

    if (existPlayer.role === EUserRole.ADMIN)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_LOGIN_DENIED);

    const isValidPassword = await verify(
      existPlayer.password as string,
      password
    );

    if (!isValidPassword)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_LOGIN_FAILED);

    const accessToken = AuthUtil.createToken("accessToken", existPlayer);
    const refreshToken = AuthUtil.createToken("refreshToken", existPlayer);

    removePlayerSensitiveAttributes(existPlayer);

    return HelperUtil.returnSuccessfulResult(res, {
      player: existPlayer,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { phone, username, password } = req.body;

    if (!phone || !username || !password)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const existPlayer = await UserSchema.findOne({ phone });

    if (existPlayer)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_EXISTED_USER);

    const hashedPassword = await hash(password);

    const newPlayer = await new UserSchema({
      phone,
      username,
      hearts: 5,
      golds: 500,
      password: hashedPassword,
    }).save();

    const accessToken = AuthUtil.createToken("accessToken", newPlayer);
    const refreshToken = AuthUtil.createToken("refreshToken", newPlayer);

    removePlayerSensitiveAttributes(newPlayer);

    return HelperUtil.returnSuccessfulResult(res, {
      player: newPlayer,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const existPlayer = await UserSchema.findById(id);

    if (!existPlayer)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_NO_EXIST_ADMIN);

    await UserSchema.findByIdAndUpdate(id, {
      tokenVersion: (existPlayer.tokenVersion as number) + 1,
    });

    return HelperUtil.returnSuccessfulResult(res, {
      message: "Player logged out",
    });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function checkSSO(req: Request, res: Response) {
  try {
    const refreshToken = req.body.refreshToken as string;

    if (!refreshToken) return HelperUtil.returnUnauthorizedResult(res);

    const decoded = JWTVerify(
      refreshToken,
      process.env.E4K_REFRESH_TOKEN_SECRET as Secret
    ) as TAuthPayload;

    const existPlayer = await UserSchema.findById(decoded.userId);

    if (!existPlayer || existPlayer.tokenVersion !== decoded.tokenVersion)
      return HelperUtil.returnUnauthorizedResult(res);

    sendRefreshToken(res, existPlayer);

    removePlayerSensitiveAttributes(existPlayer);

    return HelperUtil.returnSuccessfulResult(res, {
      player: existPlayer,
      accessToken: AuthUtil.createToken("accessToken", existPlayer),
    });
  } catch (error) {
    console.log(error);
    return HelperUtil.returnUnauthorizedResult(res);
  }
}
