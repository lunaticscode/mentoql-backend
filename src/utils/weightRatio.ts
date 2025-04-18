const getMentoSeedQuestionRatio = (question: string, answer: string) => {
  if (!question.trim() || !answer.trim()) {
    return null;
  }
  const ratio = question.length / (question.length + answer.length);
  return ratio;
};

export { getMentoSeedQuestionRatio };
