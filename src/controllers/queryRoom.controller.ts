import { AppController } from "../types";
import { getRandomId } from "../utils/randomId";
import { createQueryRoom, getQueryRoom } from "../services/queryRoom.service";

const _sleep = async (delay: number = 3000): Promise<void> =>
  await new Promise((resolve) => setTimeout(() => resolve(), delay));

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
  const { title = "", description = "" } = req.body;

  if (!title || !description) {
    return res.status(400).json({ isError: true });
  }
  const roomId = getRandomId();
  try {
    const createdRoomId = await createQueryRoom({
      title,
      description,
      roomId,
      owner: `test-owner-${new Date().getTime()}`,
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
