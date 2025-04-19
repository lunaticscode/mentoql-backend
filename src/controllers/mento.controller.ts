import { METNO_SEED_COLLECTION } from "../consts/collection";
import {
  MENTO_SEED_QUESTION_MAX_RATIO,
  MENTO_SEED_QUESTION_MIN_RATIO,
} from "../consts/ratio";
import milvusClient from "../db_init";
import { AppController } from "../types";
import { getFilteredMentoSeedText } from "../utils/filtering";
import { summarizeQuestionByValidRatio } from "../utils/mentoSeed";
import { getMentoSeedQuestionRatio } from "../utils/weightRatio";

const getMentoSeed: AppController = () => {};

const insertMetnoSeed: AppController = async (req, res) => {
  const { question = "", answer = "" } = req.body;
  if (!question || !answer)
    return res
      .status(400)
      .json({ isError: true, message: "(!) Invalid request body." });

  const [filteredQuestion, filteredAnswer] = [
    getFilteredMentoSeedText(question),
    getFilteredMentoSeedText(answer),
  ];

  const questionRatio = getMentoSeedQuestionRatio(
    filteredQuestion,
    filteredAnswer
  );

  if (!questionRatio)
    return res
      .status(400)
      .json({ isError: true, message: "(!) Invalid request body." });

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

  // await milvusClient.loadCollectionSync({
  //   collection_name: METNO_SEED_COLLECTION.name,
  // });
  // const result = await milvusClient.query({
  //   collection_name: METNO_SEED_COLLECTION.name,
  //   expr: "", // 전체 조회
  //   output_fields: [
  //     "mento_seed_id",
  //     "mento_seed_vector",
  //     // "mento_seed_question",
  //     // "mento_seed_answer",
  //   ],
  //   limit: 100,
  // });
  // console.log(result);

  // const deleteResult = await milvusClient.delete({
  //   collection_name: METNO_SEED_COLLECTION.name,
  //   ids: [457453430890917793, 457453430890917795, 457453430890917797],
  // });

  // console.log({ deleteResult });
  if (insertResult.status.error_code) {
    return res.status(500).json({ isError: true });
  }
  return res
    .status(201)
    .json({ isError: false, insertCnt: insertResult.insert_cnt });
};

export { getMentoSeed, insertMetnoSeed };
