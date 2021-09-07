module.exports = async ({
  cron,
  time,
  firestore,
  bot,
  respond,
}) => {
  respond(cron.schedule(time, () => {
    bot.telegram.sendMessage(process.env.CHAT_ID, 'SHish');
  }));
};
