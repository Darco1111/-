const { Bot, Keyboard } = require('@maxhub/max-bot-api');

const BOT_TOKEN = 'f9LHodD0cOJkUQUzFZV421abcLiZ-zfziqV9Vj0PMUf6I844abcou-tl4uHRhd6_GjlyIg-1qMzkI8tbwG2e';
const bot = new Bot(BOT_TOKEN);

// Главная клавиатура с кнопками
const mainKeyboard = Keyboard.inlineKeyboard([
    [
        Keyboard.button.callback('🏛️ Музеи', 'action_museums'),
        Keyboard.button.callback('📅 Афиша', 'action_events')
    ],
    [
        Keyboard.button.callback('🗺️ Карта', 'action_map'),
        Keyboard.button.callback('➕ Добавить экспонат', 'action_addexhibit')
    ]
]);

// Обработчик команды /start
bot.command('start', async (ctx) => {
    await ctx.reply('Выберите действие:', {
        extra: {
            attachments: [mainKeyboard]
        }
    });
});

// Обработчики нажатий на кнопки
bot.action('action_museums', async (ctx) => {
    await ctx.reply('Список музеев: /museums');
});

bot.action('action_events', async (ctx) => {
    await ctx.reply('Афиша: /events');
});

bot.action('action_map', async (ctx) => {
    await ctx.reply('Карта: /map');
});

bot.action('action_addexhibit', async (ctx) => {
    await ctx.reply('Для добавления экспоната используйте команду /addexhibit');
});

// Эхо для остальных сообщений
bot.on('message_created', async (ctx) => {
    await ctx.reply(`Вы написали: ${ctx.message.body.text}`);
});

bot.start().then(() => console.log('✅ Бот с кнопками запущен'));