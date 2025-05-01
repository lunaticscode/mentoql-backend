import { Schema, model, Document, Types } from "mongoose";
import { z } from "zod";
const { String, Date } = Schema.Types;

export const queryRoomInputSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  startDate: z.date(),
  endDate: z.date(),
});

export type QueryRoomInput = z.infer<typeof queryRoomInputSchema>;

export interface QueryRoomObject extends QueryRoomInput {
  roomId: string;
  owner: string;
}

export interface QueryRoomSchema extends Document, QueryRoomObject {}

const queryRoomSchema = new Schema<QueryRoomSchema>(
  {
    roomId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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

const QueryRoomModel = model<QueryRoomSchema>("QueryRoom", queryRoomSchema);
export default QueryRoomModel;
