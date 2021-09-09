module.exports = ({
  Scenes,
}) => new Scenes.WizardScene(
  'help',
  (ctx) => {
    ctx.reply('Sample text.');
    return ctx.scene.leave();
  }
);
