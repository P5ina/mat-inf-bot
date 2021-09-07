module.exports = async ({
  firestore,
  bot,
}) => {
  bot.telegram.sendMessage(process.env.CHAT_ID, 'SHish');
};
