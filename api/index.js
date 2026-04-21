const { Bot } = require('@maxhub/max-bot-api');
const bot = new Bot(process.env.BOT_TOKEN);

// ----- БАЗА ЭКСПОНАТОВ ДЛЯ РЭНДОМА И ВИКТОРИНЫ -----
const exhibits = [
    { name: 'Казачья люлька', museum: 'Школьный музей с. Казинка', description: 'Курительная трубка казака начала XX века. Резьба по дереву, металлические накладки.', question: 'Что такое "люлька" у казаков?' },
    { name: 'Письмо с фронта', museum: 'Музей с. Кочубеевское', description: 'Треугольное письмо солдата, датированное 1943 годом. Карандашный текст, пожелтевшая бумага.', question: 'В каком году написано письмо с фронта?' },
    { name: 'Казачья шашка', museum: 'Ставропольский краеведческий музей', description: 'Боевая шашка конца XIX века, с клеймом мастера.', question: 'Как называется казачья сабля?' },
    { name: 'Самовар на дровах', museum: 'Музей Русского самовара (ст. Новотроицкая)', description: 'Тульский самовар 1896 года, ёмкость 12 литров.', question: 'Какой город славится производством самоваров?' }
];

// ----- КОМАНДЫ -----
bot.command('start', async (ctx) => {
    await ctx.reply(`🏛️ Цифровая витрина музеев Ставрополья

Привет! Я знаю всё о малых музеях края.

📋 Команды:
/museums — список музеев
/events — афиша
/map — карта
/random — случайный экспонат дня
/quiz — викторина (проверь знания)
/help — помощь

Напиши название музея (например, Казинка), и я расскажу о нём.`);
});

bot.command('help', async (ctx) => {
    await ctx.reply(`Помощь

/museums — все музеи с адресами
/events — ближайшие события
/map — карта с метками
/random — случайный экспонат из коллекции
/quiz — вопрос на знание экспонатов

Также просто напишите название музея, и я покажу его экспонаты.`);
});

// Случайный экспонат дня
bot.command('random', async (ctx) => {
    const randomIndex = Math.floor(Math.random() * exhibits.length);
    const ex = exhibits[randomIndex];
    await ctx.reply(`🎲 *Случайный экспонат дня*

Название: ${ex.name}
Музей: ${ex.museum}
Описание: ${ex.description}

Приходите в музей, чтобы увидеть своими глазами!`);
});

// Викторина: задаём случайный вопрос
let quizSessions = {}; // запоминаем, какой вопрос задали пользователю

bot.command('quiz', async (ctx) => {
    const randomIndex = Math.floor(Math.random() * exhibits.length);
    const ex = exhibits[randomIndex];
    const userId = ctx.message.from.id;
    // Сохраняем правильный ответ (упрощённо: ищем ключевые слова)
    let answerKey = '';
    if (ex.question.includes('люлька')) answerKey = 'трубка';
    else if (ex.question.includes('1943')) answerKey = '1943';
    else if (ex.question.includes('сабля')) answerKey = 'шашка';
    else if (ex.question.includes('город')) answerKey = 'тула';
    else answerKey = ex.name.toLowerCase();
    
    quizSessions[userId] = { question: ex.question, answer: answerKey, museum: ex.museum };
    
    await ctx.reply(`📚 Викторина!

Вопрос: ${ex.question}

Напишите свой ответ (можно одним словом или числом).`);
});

// Обработка ответов на викторину (ловим все сообщения)
bot.on('message_created', async (ctx) => {
    const text = ctx.message.body.text;
    const userId = ctx.message.from.id;
    
    // Если пользователь в процессе викторины
    if (quizSessions[userId] && !text.startsWith('/')) {
        const session = quizSessions[userId];
        const userAnswer = text.toLowerCase().trim();
        const isCorrect = userAnswer.includes(session.answer);
        
        if (isCorrect) {
            await ctx.reply(`✅ Правильно! Вы знаток музеев Ставрополья. Экспонат находится в музее: ${session.museum}.`);
        } else {
            await ctx.reply(`❌ Неправильно. Правильный ответ: ${session.answer}. Зато вы теперь это знаете! Приходите в музей ${session.museum}.`);
        }
        delete quizSessions[userId];
        return;
    }
    
    // Обработка обычных команд /museums, /events, /map и поиск по названиям музеев
    if (text.startsWith('/')) {
        if (text === '/museums') {
            await ctx.reply(`🏛️ Музеи Ставрополья

1. Школьный музей с. Казинка
"Возвращение к истокам" — археология, казачий быт.
📍 ул. Школьная, 1, с. Казинка

2. Музей с. Кочубеевское
Историко-краеведческий музей им. В.И. Фёдорова.
📍 ул. Ленина, 25, с. Кочубеевское

3. Ставропольский краеведческий музей
Более 250 тыс. экспонатов.
📍 ул. Дзержинского, 135, г. Ставрополь

4. Пятигорский краеведческий музей
История КМВ, палеонтология.
📍 пр. Кирова, 41, г. Пятигорск

5. Музей-заповедник М.Ю. Лермонтова
📍 ул. Лермонтова, 4, г. Пятигорск

6. Ессентукский краеведческий музей
📍 ул. Кисловодская, 5, г. Ессентуки

7. Георгиевский историко-краеведческий музей
📍 ул. Ленина, 110, г. Георгиевск

8. Музей Русского самовара
📍 ст. Новотроицкая, ул. Ленина, 44

9. Музей истории сел (с. Большая Рязань)
📍 с. Большая Рязань, ул. Советская, 15`);
        } 
        else if (text === '/events') {
            await ctx.reply(`📅 Афиша (апрель–май 2026)

🎉 25 апреля, 18:00 — Ночь музеев
🪶 1 мая, 12:00 — Выставка казачьих ремёсел
🕯️ 9 мая, 10:00 — Экскурсия Память сердца
🎨 15–20 мая — Фестиваль Ставрополье — край традиций`);
        }
        else if (text === '/map') {
            const mapLink = 'https://yandex.ru/maps/?pt=42.921,44.195,pm2rdm~41.928,44.393,pm2rdm~41.969,45.044,pm2rdm~43.037,44.039,pm2rdm~42.958,44.084,pm2rdm&z=9';
            await ctx.reply(`🗺️ Карта музеев: ${mapLink}`);
        }
        else if (text === '/random') {
            // уже обработано выше, но если сюда попало — ничего
        }
        else if (text === '/quiz') {
            // уже обработано
        }
        else {
            await ctx.reply(`Неизвестная команда. /start — главное меню.`);
        }
        return;
    }
    
    // Поиск по названию музея (текст)
    const lower = text.toLowerCase();
    if (lower.includes('казинка') || lower.includes('школьный')) {
        await ctx.reply(`🏛️ Школьный музей с. Казинка

Экспонаты: казачья люлька, фотографии военных лет, старинные предметы быта.

📍 ул. Школьная, 1. Часы: пн–пт 9:00–17:00. Вход свободный.`);
    } 
    else if (lower.includes('кочубеевское')) {
        await ctx.reply(`🏛️ Музей с. Кочубеевское

Экспонаты: письма с фронта, награды, орудия труда казаков.

📍 ул. Ленина, 25. Часы: вт–вс 10:00–18:00. Вход свободный.`);
    }
    else {
        await ctx.reply(`Вы написали: ${text}

Чтобы увидеть главное меню, нажмите /start

Подсказка: отправьте название музея (Казинка) или команду /random, /quiz.`);
    }
});

// Экспорт для Vercel
module.exports = async (req, res) => {
    try {
        const update = req.body;
        await bot.handleUpdate(update);
        res.status(200).send('OK');
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).send('Internal Server Error');
    }
};