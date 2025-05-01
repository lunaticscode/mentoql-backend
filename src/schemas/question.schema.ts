import { model, Schema, Document } from "mongoose";
const { String } = Schema.Types;

export interface QuestionInput {
  queryRoomId: string;
  owner: string;
  content: string;
  createdAt: Date;
}
export interface QuestionSchema extends Document, QuestionInput {}

const questionSchema = new Schema<QuestionSchema>(
  {
    queryRoomId: {
      type: String,
      required: true,
      ref: "QueryRoom",
    },
    owner: { type: String, required: true, ref: "User" },
    content: {
      type: String,
      required: true,
      min: 10,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Question = model<QuestionSchema>("Question", questionSchema);
export default Question;
