const { Telegraf } = require('telegraf');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

function createDeps() {
  const serviceAccount = require(process.env.FIREBASE_CREDENTIAL_PATH);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
  const firestore = firebaseAdmin.firestore();

  return { firestore };
}

// In case createDeps() is async
function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => ctx.reply('Привет 👋! Чтобы узнать список доступных команд напиши /help'));
  bot.launch();

  const { firestore } = createDeps();

  require('./commands/index').forEach((command) => {
    bot.command(command.name, async (ctx) => command.handler({
      ctx,
      firestore,
    }));
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

startBot();
