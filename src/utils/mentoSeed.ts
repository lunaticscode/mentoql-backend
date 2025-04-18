import { HttpStatusCode } from "axios";
import { OEPNROUTER_LLM_MODEL } from "../consts/llm";
import {
  MENTO_SEED_QUESTION_MAX_RATIO,
  MENTO_SEED_QUESTION_MIN_RATIO,
} from "../consts/ratio";
import { llmApi } from "./api";
import { getFilteredMentoSeedText } from "./filtering";

const summarizeQuestionByValidRatio = async (
  question: string,
  answer: string,
  recurCount: number = 1
) => {
  const targetRatio =
    (MENTO_SEED_QUESTION_MAX_RATIO + MENTO_SEED_QUESTION_MIN_RATIO) / 2;

  const questionTargetLength = Math.floor(
    (question.length + answer.length) * targetRatio
  );
  const [questionMinLength, questionMaxLength] = [
    Math.floor(
      (question.length + answer.length) * MENTO_SEED_QUESTION_MIN_RATIO
    ),
    Math.floor(
      (question.length + answer.length) * MENTO_SEED_QUESTION_MAX_RATIO
    ),
  ];

  try {
    const llmReq = await llmApi.post("/chat/completions", {
      model: OEPNROUTER_LLM_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${question}\n\n위 질문을 의미가 유지될 수 있게 ${questionTargetLength}자 이내로 요약해줘. 대신 질문의 기술적인 키워드는 그대로 유지해줘.`,
            },
          ],
        },
      ],
    });
    if (llmReq.status === HttpStatusCode.Ok) {
      const { content } = llmReq.data.choices[0].message;
      const filteredContent = getFilteredMentoSeedText(content);
      if (
        (questionMinLength > filteredContent.length ||
          questionMaxLength < filteredContent.length) &&
        recurCount
      ) {
        return await summarizeQuestionByValidRatio(
          filteredContent,
          answer,
          recurCount - 1
        );
      }
      return {
        q: content as string,
        a: answer,
      };
    }
    // recur..?
    // or 기존 question, answer;
    // openrouter 를 거쳐서 llm에 접근하는 구조이기 때문에,
    // openrouter 서버 상황을 알 수 없기 때문에 무작적 recur하는 것도 손실.
    // 보수적으로 기존 question, answer을 그대로 return 하는게 좋을 것 같음.
    return {
      q: question,
      a: answer,
    };
  } catch (err) {
    console.error(err);
    return {
      q: question,
      a: answer,
    };
  }
};

export { summarizeQuestionByValidRatio };
