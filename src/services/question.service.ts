import Question, { QuestionObject } from "../schemas/question.schema";
const createQuestion = async (data: QuestionObject) => {
  try {
    const createResult = await Question.create(data);
    if (!createResult || !createResult._id) {
      throw new Error("CREATE_ERROR");
    }
    return createResult._id;
  } catch (err) {
    throw err;
  }
};

export { createQuestion };
