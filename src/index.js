const { Telegraf } = require('telegraf');
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

function createDeps() {
  const serviceAccount = require(process.env.FIREBASE_CREDENTIAL_PATH);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  const firestore = firebaseAdmin.firestore();

  return { firestore };
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Привет 👋! Чтобы узнать список доступных команд напиши /help'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
