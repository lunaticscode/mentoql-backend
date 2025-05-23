import QueryRoomModel, { QueryRoomObject } from "../schemas/queryRoom.schema";
import { PopulateOptions } from "mongoose";
const createQueryRoom = async (data: QueryRoomObject) => {
  try {
    const createResult = await QueryRoomModel.create(data);
    if (!createResult || !createResult._id) {
      throw new Error("CREATE_ERROR");
    }
    return createResult.roomId;
  } catch (err) {
    throw err;
  }
};

const getQueryRoomList = async (page: number, size: number) => {
  try {
    const rooms = await QueryRoomModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size);
    return rooms;
  } catch (err) {
    throw err;
  }
};

const getQueryRoom = async (roomId: string) => {
  try {
    const room = await QueryRoomModel.findOne({ roomId })
      .populate({
        path: "questions",
        match: {
          owner: {
            $in: ["test-mentee-1746264802799", "test-mentee-1746264805992"],
          },
        },
        options: {
          limit: 10,

          sort: { createdAt: -1 }, // 최신순 정렬
        },
      } as PopulateOptions)
      .exec();
    return room;
  } catch (err) {
    throw err;
  }
};

export { createQueryRoom, getQueryRoom, getQueryRoomList };
