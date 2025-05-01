import { Schema, model, Document, Types } from "mongoose";
const { String, ObjectId } = Schema.Types;

export interface QueryRoomInput {
  roomId: string;
  title: string;
  description?: string;
  owner: string;
}
// ma4w6092b6acss // ma4w6ew6rv8f2j
export interface QueryRoomSchema extends Document, QueryRoomInput {}

const queryRoomSchema = new Schema<QueryRoomSchema>(
  {
    roomId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    owner: { type: String, required: true, ref: "User" },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

queryRoomSchema.virtual("questions", {
  ref: "Question",
  localField: "roomId",
  foreignField: "queryRoomId",
});

queryRoomSchema.set("toObject", { virtuals: true });
queryRoomSchema.set("toJSON", { virtuals: true });

const QueryRoom = model<QueryRoomSchema>("QueryRoom", queryRoomSchema);
export default QueryRoom;
