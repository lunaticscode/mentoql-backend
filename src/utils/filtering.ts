const getFilteredMentoSeedText = (srcText: string) => {
  return srcText
    .replace(/[\n\r\t]/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/[\x00-\x1F]/g, "")
    .trim();
};

export { getFilteredMentoSeedText };
