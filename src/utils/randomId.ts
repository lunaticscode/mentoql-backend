const getRandomId = () => {
  const timestamp = Date.now().toString(36);
  const randomSalt = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${randomSalt}`;
};

export { getRandomId };
