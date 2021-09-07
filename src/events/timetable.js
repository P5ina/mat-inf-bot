module.exports = async ({
  firestore,
  bot,
}) => {
  const eventHeader = '*📚 Расписание на завтра*\n\n';
  // TODO: Get datetime
  const lessonRef = firestore.collection('timetable').doc('monday');

  const doc = await lessonRef.get();

  let message;

  if (doc.exists) {
    message = `\`\`\`${JSON.stringify(doc.data())}\`\`\``;
  } else {
    message = 'На завтра нет расписания 🎉';
  }

  bot.telegram.sendMessage(process.env.CHAT_ID, `${eventHeader} ${message}`, { parse_mode: 'Markdown' });
};
