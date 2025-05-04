import { SUCCESS_STATUS_CODE } from "../consts/api";
import { METNO_SEED_COLLECTION } from "../consts/collection";
import CustomError, { getErrorArgs } from "../consts/error";
import {
  MENTO_SEED_QUESTION_MAX_RATIO,
  MENTO_SEED_QUESTION_MIN_RATIO,
} from "../consts/ratio";
import milvusClient from "../db_init";
import { AppController } from "../types";
import { getFilteredMentoSeedText } from "../utils/filtering";
import { summarizeQuestionByValidRatio } from "../utils/mentoSeed";
import { getMentoSeedQuestionRatio } from "../utils/weightRatio";

const getMentoSeed: AppController = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (typeof question !== "string") {
      return next(
        new CustomError(getErrorArgs("INVALID_REQUEST_INPUT"), "getMentoSeed")
      );
    }
    if (!question || !question.trim().length || question.length < 10) {
      return next(
        new CustomError(getErrorArgs("INVALID_REQUEST_INPUT"), "getMentoSeed")
      );
    }

    const { pipeline } = await import("@xenova/transformers");
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const embeddedQuestion = await extractor([question], {
      pooling: "mean",
      normalize: true,
    });

    const searchResult = await milvusClient.search({
      collection_name: METNO_SEED_COLLECTION.name,
      data: Array.from(embeddedQuestion.data, Number),
      limit: 3,
      output_fields: ["mento_seed_question", "mento_seed_answer"],
    });
    if (searchResult.status.error_code !== "Success") {
      return next(
        new CustomError(
          getErrorArgs("MILVUS_CLIENT_ERROR"),
          "getMentoSeed > milvusClient.search"
        )
      );
    }
    const result = await milvusClient.query({
      collection_name: METNO_SEED_COLLECTION.name,
      expr: "",
      output_fields: ["mento_seed_question", "mento_seed_answer"],
      limit: 100,
    });
    return res.status(SUCCESS_STATUS_CODE.POST).json({ isError: false });
  } catch (err) {
    return next(new CustomError(getErrorArgs("UKNOWN_ERROR"), "getMentoSeed"));
  }
};

const insertMetnoSeed: AppController = async (req, res, next) => {
  try {
    const { question = "", answer = "" } = req.body;
    if (!question || !answer)
      return next(
        new CustomError(
          getErrorArgs("INVALID_REQUEST_INPUT"),
          "insertMentoSeed > parsing req.body"
        )
      );

    const [filteredQuestion, filteredAnswer] = [
      getFilteredMentoSeedText(question),
      getFilteredMentoSeedText(answer),
    ];

    const questionRatio = getMentoSeedQuestionRatio(
      filteredQuestion,
      filteredAnswer
    );

    if (!questionRatio)
      return next(
        new CustomError(
          getErrorArgs("INVALID_REQUEST_INPUT"),
          "insertMentoSeed > get ratio from question, answer"
        )
      );
    let resultQuestion = filteredQuestion;
    let resultAnswer = filteredAnswer;
    if (
      MENTO_SEED_QUESTION_MAX_RATIO < questionRatio ||
      MENTO_SEED_QUESTION_MIN_RATIO > questionRatio
    ) {
      const validQuestion = await summarizeQuestionByValidRatio(
        filteredQuestion,
        filteredAnswer,
        3
      );
      resultQuestion = validQuestion;
    }

    const { pipeline } = await import("@xenova/transformers");
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const [questionEmbedding, answerEmbedding] = await Promise.all([
      await extractor([resultQuestion], {
        pooling: "mean",
        normalize: true,
      }),
      await extractor([resultAnswer], {
        pooling: "mean",
        normalize: true,
      }),
    ]);

    const avrWeight =
      (MENTO_SEED_QUESTION_MAX_RATIO + MENTO_SEED_QUESTION_MIN_RATIO) / 2;

    const [castedQuestionEmbedding, castedAnswerEmbedding] = [
      Array.from(questionEmbedding.data, Number),
      Array.from(answerEmbedding.data, Number),
    ];

    const combinedVector = castedQuestionEmbedding.map(
      (q, i) => avrWeight * q + (1 - avrWeight) * castedAnswerEmbedding[i]
    );

    const data = [
      {
        mento_id: "test-humanwater-id",
        mento_seed_vector: combinedVector,
        mento_seed_question: resultQuestion,
        mento_seed_answer: resultAnswer,
      },
    ];

    const insertResult = await milvusClient.insert({
      collection_name: METNO_SEED_COLLECTION.name,
      data,
    });

    if (insertResult.status.error_code !== "Success") {
      return next(
        new CustomError(
          getErrorArgs("MILVUS_CLIENT_ERROR"),
          "insertMentoSeed > insertResult.status.error_code"
        )
      );
    }
    return res
      .status(SUCCESS_STATUS_CODE.POST)
      .json({ isError: false, insertCnt: insertResult.insert_cnt });
  } catch (err) {
    return next(
      new CustomError(getErrorArgs("UKNOWN_ERROR"), "insertMentoSeed")
    );
  }
};

export { getMentoSeed, insertMetnoSeed };
