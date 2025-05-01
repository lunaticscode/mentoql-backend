import { createQuestion } from "../services/question.service";
import { AppController } from "../types";

const createQuestionController: AppController = async (req, res) => {
  const { queryRoomId, content } = req.body;
  if (!queryRoomId || !content) {
    return res
      .status(400)
      .json({ isError: true, message: "INVALID_QUESTION_INPUT" });
  }
  try {
    const createdQuestionId = await createQuestion({
      queryRoomId,
      content,
      owner: `test-mentee-${new Date().getTime()}`,
    });
    if (createdQuestionId) {
      return res.status(201).json({ isError: false });
    }
    console.log("createdQuestionId is undefined", { createdQuestionId });
    return res.json({ isError: true });
  } catch (err) {
    console.error({ err });
    return res.status(500).json({ isError: true });
  }
};
export { createQuestionController };
