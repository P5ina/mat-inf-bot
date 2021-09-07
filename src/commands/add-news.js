module.exports = async ({
  ctx,
  next,
  listener,
}) => {
  await ctx.reply('Слушаю!');
  // Is it required for next bot.on(text) to run?
  await next();
  const text = await listener.listen();
  await ctx.reply(text);
};
