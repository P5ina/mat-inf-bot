/* eslint-disable consistent-return */
module.exports = ({
  Scenes,
  Markup,
  firebaseAdmin,
  firestore,
}) => new Scenes.WizardScene(
  'add_timetable',
  (ctx) => {
    ctx.reply('Введите день недели');
    return ctx.wizard.next();
  },
  (ctx) => {
    const daysOfWeek = {
      Пн: 'monday',
      Вт: 'tuesday',
      Ср: 'wednesday',
      Чт: 'thursday',
      Пт: 'friday',
      Сб: 'saturday',
    };

    if (!(ctx.message.text in daysOfWeek)) {
      ctx.reply('Некорректный день недели!');
      return;
    }

    ctx.wizard.state.dayOfWeek = daysOfWeek[ctx.message.text];
    ctx.reply('Введите время начала уроков');
    return ctx.wizard.next();
  },
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
      lessonStart: firebaseAdmin.firestore.Timestamp.fromDate(new Date(0, 0, 0, hours, minutes)),
    });
    ctx.reply('Расписание успешно задано!');
    return ctx.scene.leave();
  }
);
