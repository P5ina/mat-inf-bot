const { Telegraf } = require('telegraf');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');
const cron = require('node-cron');
const table = require('text-table');

dotenv.config();

function createDeps() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const serviceAccount = require(process.env.FIREBASE_CREDENTIAL_PATH);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
  const firestore = firebaseAdmin.firestore();

  return { bot, firestore };
}

// In case createDeps() is async
function startBot() {
  const { bot, firestore } = createDeps();

  bot.start((ctx) => ctx.reply('Привет 👋! Чтобы узнать список доступных команд напиши /help'));

  require('./commands/index').forEach((command) => {
    bot.command(command.name, async (ctx) => command.handler({
      ctx,
      firestore,
    }));
  });

  bot.launch();
  console.log('🤖 Bot launched!');

  require('./events/index').forEach((cronEvent) => {
    const task = cron.schedule(cronEvent.time, () => cronEvent.handler({
      firestore,
      bot,
      table,
    }));

    process.once('SIGINT', () => task.stop());
    process.once('SIGTERM', () => task.stop());
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

startBot();
