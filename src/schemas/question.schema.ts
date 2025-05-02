import { z } from "zod";
import { model, Schema, Document } from "mongoose";
const { String } = Schema.Types;

export const questionInputSchema = z.object({
  queryRoomId: z.string(),
  content: z.string(),
});

export type QuestionInput = z.infer<typeof questionInputSchema>;
export interface QuestionObject extends QuestionInput {
  owner: string;
}
export interface QuestionSchema extends Document, QuestionObject {}

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
