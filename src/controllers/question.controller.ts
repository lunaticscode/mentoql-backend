import { SUCCESS_STATUS_CODE } from "../consts/api";
import CustomError, { getErrorArgs } from "../consts/error";
import { createQuestion } from "../services/question.service";
import { AppController } from "../types";

const createQuestionController: AppController = async (req, res, next) => {
  const { queryRoomId, content } = req.body;
  if (!queryRoomId || !content) {
    return next(
      new CustomError(
        getErrorArgs("INVALID_REQUEST_INPUT"),
        "createQuestionController > Invalid queryRoomId, content body parameter."
      )
    );
  }
  try {
    const createdQuestionId = await createQuestion({
      queryRoomId,
      content,
      owner: `test-mentee-${new Date().getTime()}`,
    });
    return res
      .status(SUCCESS_STATUS_CODE.POST)
      .json({ questionId: createdQuestionId });
  } catch (err) {
    return next(
      new CustomError(
        getErrorArgs("UKNOWN_ERROR"),
        "createQuestionController > createQuestion service error."
      )
    );
  }
};
export { createQuestionController };
