import { Schema, model, Document, SchemaTimestampsConfig } from "mongoose";
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

export interface QueryRoomSchema
  extends Document,
    SchemaTimestampsConfig,
    QueryRoomObject {}

const getFilteredReturnObject = (schema: QueryRoomSchema) => {
  const { _id, id, updatedAt, ...filtered } = schema;
  return filtered;
};

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
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret, _options) {
        return getFilteredReturnObject(ret as QueryRoomSchema);
      },
    },
  }
);

queryRoomSchema.virtual("questions", {
  ref: "Question",
  localField: "roomId",
  foreignField: "queryRoomId",
  limit: 10,
});

const QueryRoomModel = model<QueryRoomSchema>("QueryRoom", queryRoomSchema);
export default QueryRoomModel;
