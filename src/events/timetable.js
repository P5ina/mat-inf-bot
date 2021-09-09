module.exports = async ({
  firestore,
  bot,
  table,
}) => {
// shish

  console.log('⚡️ Event started...');
  const eventHeader = '*📚 Расписание на завтра*\n\n';

  const date = new Date();
  date.setDate(date.getDate() + 1);
  const weekday = Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  // TODO: Get datetime
  console.log('🔍 Finding ref document...');
  const lessonRef = firestore.collection('timetable').doc(weekday.toLowerCase());

  console.log('💾 Getting document...');
  const doc = await lessonRef.get();
  console.log('💾 Document getted!');

  let message;

  if (doc.exists) {
    const data = doc.data();

    const tableRaw = data.lessons.map((lesson, index) => {
      const lessonDate = new Date(data.lessonsStart.toDate().getTime() + index * 60 * 60000);
      const lessonTime = Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(lessonDate);

      return [`\`${lessonTime}\``, lesson];
    });

    message = table(tableRaw, { align: ['l', 'l'] });
  } else {
    console.log('❌ Document doesn\'t exists!');

    message = 'На завтра нет расписания 🎉';
  }

  console.log('💬 Sending message to group...');
  bot.telegram.sendMessage(process.env.CHAT_ID, `${eventHeader}${message}`, { parse_mode: 'Markdown' });
};
