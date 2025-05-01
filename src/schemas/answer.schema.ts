import { Schema, Document, model } from "mongoose";
const { ObjectId, String } = Schema.Types;
export interface AnswerSchema extends Document {
  questionId: typeof ObjectId;
  answeredBy: typeof ObjectId;
  content: string;
}

const answerSchema = new Schema<AnswerSchema>(
  {
    questionId: {
      type: ObjectId,
      required: true,
      ref: "Question",
    },
    answeredBy: { type: ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Answer = model<AnswerSchema>("Answer", answerSchema);
export default Answer;
