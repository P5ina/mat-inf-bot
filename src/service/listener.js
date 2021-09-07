class Listener {
  constructor() {
    this.listeners = {};
  }

  init(bot) {
    bot.on('text', async (ctx) => {
      if (ctx.from.id in this.listeners) {
        this.listeners[ctx.from.id](ctx.message);
      }
    });
  }

  async listen(ctx) {
    return new Promise((res) => {
      this.listeners[ctx.from.id] = res;
    });
  }
}

module.exports = Listener;
