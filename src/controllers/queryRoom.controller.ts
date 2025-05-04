import { AppController } from "../types";
import { getRandomId } from "../utils/randomId";
import {
  createQueryRoom,
  getQueryRoom,
  getQueryRoomList,
} from "../services/queryRoom.service";
import { queryRoomInputSchema } from "../schemas/queryRoom.schema";
import CustomError, { getErrorArgs } from "../consts/error";
import { SUCCESS_STATUS_CODE } from "../consts/api";

const getQueryRoomListController: AppController = async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  if (!page || !size) {
    return next(
      new CustomError(
        getErrorArgs("INVALID_REQUEST_INPUT"),
        "getQueryRoomListController > Invalid page, size parameter."
      )
    );
  }
  const [parsedPage, parserdSize] = [Number(page), Number(size)];
  try {
    const rooms = await getQueryRoomList(parsedPage, parserdSize);
    return res.status(SUCCESS_STATUS_CODE.GET).json({ rooms });
  } catch (err) {
    return next(
      new CustomError(
        getErrorArgs("UKNOWN_ERROR"),
        "getQueryRoomListController"
      )
    );
  }
};

const getQueryRoomController: AppController = async (req, res, next) => {
  const { roomId } = req.params;
  if (!roomId) {
    return next(
      new CustomError(
        getErrorArgs("INVALID_REQUEST_INPUT"),
        "getQueryRoomController > Invalid roomId parameter"
      )
    );
  }
  try {
    const queryRoom = await getQueryRoom(roomId);
    return res.status(SUCCESS_STATUS_CODE.GET).json({ queryRoom });
  } catch (err) {
    console.error(err);
    return next(
      new CustomError(getErrorArgs("UKNOWN_ERROR"), "getQueryRoomController")
    );
  }
};

const createQueryRoomController: AppController = async (req, res, next) => {
  const tmpQueryRoomInput = req.body;
  const queryRoomInput = {
    ...tmpQueryRoomInput,
    startDate: new Date(tmpQueryRoomInput.startDate),
    endDate: new Date(tmpQueryRoomInput.endDate),
  };
  const parsedInput = queryRoomInputSchema.safeParse(queryRoomInput);
  if (!parsedInput.success) {
    return next(
      new CustomError(
        getErrorArgs("INVALID_REQUEST_INPUT"),
        "createQueryRoomController > Invalid queryRoomInput."
      )
    );
  }
  try {
    const createdRoomId = await createQueryRoom({
      ...parsedInput.data,
      roomId: getRandomId(),
      owner: `test-mento-owner-${new Date().getTime()}`,
    });
    return res.status(SUCCESS_STATUS_CODE.POST).json({ roomId: createdRoomId });
  } catch (err) {
    return next(
      new CustomError(getErrorArgs("UKNOWN_ERROR"), "createQueryRoomController")
    );
  }
};

export {
  getQueryRoomListController,
  getQueryRoomController,
  createQueryRoomController,
};
