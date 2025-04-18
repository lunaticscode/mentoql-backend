import {
  MENTO_SEED_QUESTION_MAX_RATIO,
  MENTO_SEED_QUESTION_MIN_RATIO,
} from "../consts/ratio";
import { AppController } from "../types";
import { getFilteredMentoSeedText } from "../utils/filtering";
import { getValidQuestionByValidRatio } from "../utils/mentoSeed";
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
    const { q: validQuestion, a: _validAnswer } =
      await getValidQuestionByValidRatio(filteredQuestion, filteredAnswer, 3);
    resultQuestion = validQuestion;
  }

  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  console.log({ srcQuestion: filteredQuestion, resultQuestion, resultAnswer });
  const response = await extractor([resultQuestion, resultAnswer], {
    pooling: "mean",
    normalize: true,
  });

  console.log(response.data.length);
  console.log(response.dims);
  return res.json({ isError: false });
};

export { getMentoSeed, insertMetnoSeed };
