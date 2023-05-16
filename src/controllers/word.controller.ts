import { Request, Response } from "express";
import { HelperUtil } from "../utils";
import { IWord, WordSchema } from "../models";
import { APIMessage, WordConstant } from "../constants";

export async function getAllWords(req: Request, res: Response) {
  try {
    const page = req.query.page;

    if (!page)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const words = await WordSchema.find()
      .limit(WordConstant.WORDS_PER_PAGE)
      .skip(
        WordConstant.WORDS_PER_PAGE * parseInt(page as string) -
          WordConstant.WORDS_PER_PAGE
      );

    return HelperUtil.returnSuccessfulResult(res, { words });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function getWordById(req: Request, res: Response) {
  try {
    const wordId = req.params.wordId;

    if (!wordId)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const word = await WordSchema.findById(wordId);

    return HelperUtil.returnSuccessfulResult(res, { word });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function addNewWord(req: Request, res: Response) {
  try {
    const { engVer, vieVers, images, audios, userId } = req.body;

    if (!engVer || !vieVers || vieVers.length === 0)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const newWord = await new WordSchema({
      engVer,
      vieVers,
      creator: userId,
      ...(images ? { images } : {}),
      ...(audios ? { audios } : {}),
    }).save();

    return HelperUtil.returnSuccessfulResult(res, { newWord });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export function searchWordsByKeyWord(req: Request, res: Response) {
  try {
    const { keyword } = req.body;

    if (!keyword)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    Promise.all([
      WordSchema.findOne({ engVer: keyword }),
      WordSchema.find({
        engVer: { $regex: ".*" + keyword + ".*", $options: "i" },
      }).limit(3),
    ]).then(([equalWords, relativeWords]) => {
      return HelperUtil.returnSuccessfulResult(res, {
        words: equalWords ? [equalWords, ...relativeWords] : relativeWords,
      });
    });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}

export async function updateWord(req: Request, res: Response) {
  try {
    const { engVer, vieVers, images, audios, userId } = req.body;
    const wordId = req.params.wordId;

    if (!wordId || !engVer || !vieVers || vieVers.length === 0)
      return HelperUtil.returnErrorResult(res, APIMessage.ERR_MISSING_PARAMS);

    const updater = {
      engVer,
      vieVers,
      creator: userId,
      ...(images ? { images } : {}),
      ...(audios ? { audios } : {}),
    };

    const word = await WordSchema.findByIdAndUpdate(wordId, updater, {
      new: true,
    });

    return HelperUtil.returnSuccessfulResult(res, { word });
  } catch (error) {
    return HelperUtil.returnErrorResult(res, error);
  }
}
