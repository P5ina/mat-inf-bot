module.exports = ({
  Scenes,
  Markup,
  Composer,
  firebaseAdmin,
  firestore,
}) => {
  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const composer = new Composer();

  daysOfWeek.forEach((day) => {
    composer.action(day, (ctx) => {
      ctx.wizard.state.dayOfWeek = day;
      ctx.reply('Введите время');
      return ctx.wizard.next();
    });
  });

  return new Scenes.WizardScene(
    'add_timetable',
    (ctx) => {
      ctx.reply('Введите день недели', Markup.inlineKeyboard([
        Markup.button.callback('Пн', 'monday'),
        Markup.button.callback('Вт', 'tuesday'),
        Markup.button.callback('Ср', 'wednesday'),
        Markup.button.callback('Чт', 'thursday'),
        Markup.button.callback('Пт', 'friday'),
        Markup.button.callback('Сб', 'saturday'),
      ]));
      return ctx.wizard.next();
    },
    composer,
    (ctx) => {
      const time = ctx.message.text;

      if (!time.match(/^\d{1,2}:[0-5]\d$/)) {
        ctx.reply('Некорректное время начала уроков!');
        return;
      }

      ctx.wizard.state.time = time;
      ctx.reply('Введите уроки');
      return ctx.wizard.next();
    },
    (ctx) => {
      const lessons = ctx.message.text.trim().split('\n');
      const [hours, minutes] = ctx.wizard.state.time.split(':');

      firestore.collection('timetable').doc(ctx.wizard.state.dayOfWeek).set({
        lessons,
        lessonStart: firebaseAdmin.firestore.Timestamp.fromDate(
          new Date(0, 0, 0, hours, minutes)
        ),
      });
      ctx.reply('Расписание успешно задано!');
      return ctx.scene.leave();
    }
  );
};
