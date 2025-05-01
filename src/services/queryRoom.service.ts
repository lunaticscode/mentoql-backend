import QueryRoom, { QueryRoomInput } from "../schemas/queryRoom.schema";
const createQueryRoom = async (data: QueryRoomInput) => {
  try {
    const createResult = await QueryRoom.create(data);
    if (!createResult || !createResult._id) {
      throw new Error("CREATE_ERROR");
    }
    return createResult.roomId;
  } catch (err) {
    throw err;
  }
};

const getQueryRoom = async (roomId: string) => {
  try {
    const rooms = await QueryRoom.find({ roomId }).populate("questions").exec();
    return rooms;
  } catch (err) {
    throw err;
  }
};

export { createQueryRoom, getQueryRoom };
