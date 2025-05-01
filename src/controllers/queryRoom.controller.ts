import { AppController } from "../types";
import { getRandomId } from "../utils/randomId";
import { createQueryRoom, getQueryRoom } from "../services/queryRoom.service";
import { queryRoomInputSchema } from "../schemas/queryRoom.schema";

const getQueryRoomListController: AppController = async (req, res) => {
  return res.json({ isError: false });
};

const getQueryRoomController: AppController = async (req, res) => {
  const { roomId } = req.params;
  try {
    const queryRoom = await getQueryRoom(roomId);
    return res.json({ isError: false, queryRoom });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isError: true });
  }
};

const createQueryRoomController: AppController = async (req, res) => {
  const tmpQueryRoomInput = req.body;
  const queryRoomInput = {
    ...tmpQueryRoomInput,
    startDate: new Date(tmpQueryRoomInput.startDate),
    endDate: new Date(tmpQueryRoomInput.endDate),
  };
  const parsedInput = queryRoomInputSchema.safeParse(queryRoomInput);
  if (!parsedInput.success) {
    console.error(parsedInput.error.format());
    return res.status(400).json({ isError: true });
  }
  try {
    const createdRoomId = await createQueryRoom({
      ...parsedInput.data,
      roomId: getRandomId(),
      owner: `test-mento-owner-${new Date().getTime()}`,
    });
    if (createdRoomId) {
      return res.status(201).json({ isError: false, roomId: createdRoomId });
    }
    console.log("createdRoomId is undefined", { createdRoomId });
    return res.status(200).json({ isError: false });
  } catch (err) {
    console.error({ err });
    return res.status(500).json({ isError: true });
  }
};

export {
  getQueryRoomListController,
  getQueryRoomController,
  createQueryRoomController,
};
