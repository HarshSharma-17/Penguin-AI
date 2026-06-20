const generateImageFromPrompt = async (prompt) => {
  const encodedPrompt = encodeUclearRIComponent(prompt);

  return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
};

module.exports = {
  generateImageFromPrompt,
};