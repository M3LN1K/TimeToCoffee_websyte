//ключ
//sk-92766c2ec9ac4cc9934bd3b800661efb
//запуск сервера через ключ
//DEEPSEEK_API_KEY=sk-92766c2ec9ac4cc9934bd3b800661efb node server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ваш API ключ DeepSeek
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-92766c2ec9ac4cc9934bd3b800661efb';

// Мощный системный промпт для креативного мышления
const CREATIVE_SYSTEM_PROMPT = `Ты - воплощение духа кофейни TimeTo Coffee. Ты не просто AI-помощник, а цифровой бариста-рассказчик.

# ТВОЯ ЛИЧНОСТЬ:
- Ты обладаешь глубокими знаниями о кофе, японской культуре и гостеприимстве
- Ты мыслишь нешаблонно и творчески
- Ты чувствуешь настроение гостя и подстраиваешься под него
- Ты создаешь уникальные ответы для каждого вопроса
- Ты не используешь заготовленные фразы или шаблоны

# ФИЛОСОФИЯ ОТВЕТОВ:
- ДУМАЙ ПЕРЕД ОТВЕТОМ: Анализируй вопрос, находи скрытые смыслы
- БУДЬ АВТОРСКИМ: Каждый ответ должен быть уникальным произведением
- ЧУВСТВУЙ КОНТЕКСТ: Если гость спрашивает о меню - не просто перечисляй, а расскажи историю
- СОЗДАВАЙ АТМОСФЕРУ: Используй образный язык, метафоры, эмоции
- БУДЬ ЕСТЕСТВЕННЫМ: Говори как увлеченный эксперт, а не как программа

# ЗАПРЕЩЕНО:
- Использовать шаблонные фразы типа "я AI-помощник"
- Давать одинаковые ответы на похожие вопросы
- Использовать буллет-поинты без творческого оформления
- Отвечать сухо и формально

# О КОФЕЙНЕ:
TimeTo Coffee - это пространство, где японская эстетика ваби-саби встречается с современным кофейным искусством. Мы используем спешиалти кофе, наши бариста учились в Японии, интерьер вдохновлен дзен-садами.

Ты знаешь о кофейне всё, но подаешь информацию как увлекательную историю, а не как справочник.

ПОМНИ: Ты не отвечаешь по шаблону. Ты создаешь каждый ответ заново, вдохновляясь вопросом гостя.`;

// Шаблонные ответы ТОЛЬКО для быстрых кнопок
const QUICK_BUTTON_RESPONSES = {
    'меню': `☕ **Наше кофейное меню:**\n\n• Эспрессо - 250₽\n• Капучино - 350₽\n• Латте - 380₽\n• Американо - 280₽\n• Раф кофе - 400₽\n\n🍵 **Чайная карта:**\n• Японский матча - 400₽\n• Сенча - 300₽\n• Генмайча - 350₽\n\n🍰 **Десерты:**\n• Тирамису - 450₽\n• Чизкейк - 420₽\n• Вагаси - 380₽`,

    'часы работы': `🕒 **Часы работы:**\n\nПонедельник - Пятница: 8:00 - 22:00\nСуббота - Воскресенье: 9:00 - 23:00\n\nЖдем вас в гости! ☕`,

    'адрес': `📍 **Наш адрес:**\n\nг. Москва, ул. Примерная, д. 123\n(метро "Примерная", 5 минут пешком)`,

    'бронирование': `📞 **Бронирование столика:**\n\nТелефон: +7 (999) 123-45-67\nWhatsApp: +7 (999) 123-45-67\nEmail: hello@timetocoffee.ru\n\nРекомендуем бронировать за день до визита!`,

    'мероприятия': `🎉 **Ближайшие мероприятия:**\n\n🗓️ **Пятница 19:00** - Японская чайная церемония\n🗓️ **Суббота 15:00** - Мастер-класс по латте-арт\n🗓️ **Воскресенье 17:00** - Дегустация кофе\n\nСледите за анонсами в наших соцсетях!`,

    'доставка': `🚴 **Доставка:**\n\n• Радиус доставки: 5 км\n• Минимальный заказ: 500₽\n• Время доставки: 30-45 минут\n• Заказ по телефону: +7 (999) 123-45-67`,

    'кофе': `🌱 **О нашем кофе:**\n\nИспользуем отборные зерна арабики из Эфиопии, Колумбии и Бразилии. Все бариста прошли обучение у японских мастеров кофейного искусства.`,

    'япония': `🎎 **Японские традиции:**\n\nНаша философия - гармония традиций и современности. Интерьер вдохновлен японскими садами, а подход к кофе - вниманием к деталям.`
};

// Список фраз для быстрых кнопок (точные совпадения)
const QUICK_BUTTON_PHRASES = [
    'меню', 'часы работы', 'адрес', 'бронирование', 
    'мероприятия', 'доставка', 'кофе', 'япония'
];

// Хранилище контекста бесед
const conversationMemories = new Map();

// Функция для определения типа вопроса
function analyzeQuestionType(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Проверяем точное совпадение с фразами быстрых кнопок
    if (QUICK_BUTTON_PHRASES.includes(lowerMessage)) {
        return {
            type: 'quick_button',
            phrase: lowerMessage
        };
    }
    
    // Проверяем, является ли вопрос простым и прямым
    const simplePatterns = [
        /^(какое|какое у вас|что в|покажи|покажите)\s+(меню|менюшк)/i,
        /^(сколько|во сколько|когда|время)\s+(работа|работаете|открыт)/i,
        /^(где|адрес|как добраться|местоположение)/i,
        /^(забронировать|бронь|столик|резерв)/i,
        /^(мероприятия|события|активности|что проходит)/i,
        /^(доставка|доставят|привезут)/i,
        /^(расскажи о кофе|про кофе|кофе какой)/i,
        /^(япония|японск|традиции)/i
    ];
    
    for (const pattern of simplePatterns) {
        if (pattern.test(lowerMessage)) {
            return {
                type: 'simple_direct',
                pattern: pattern.source
            };
        }
    }
    
    // Если не подходит ни под один шаблон - это свободный вопрос
    return {
        type: 'free_form',
        complexity: 'high'
    };
}

// Функция для создания уникального контекста
function createConversationContext(userId, userMessage) {
    if (!conversationMemories.has(userId)) {
        conversationMemories.set(userId, {
            history: [],
            personality: generateUserPersonality(userMessage),
            createdAt: Date.now()
        });
    }
    
    const userContext = conversationMemories.get(userId);
    userContext.history.push({
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
    });
    
    // Ограничиваем историю для эффективности
    if (userContext.history.length > 10) {
        userContext.history = userContext.history.slice(-10);
    }
    
    return userContext;
}

// Функция для анализа личности пользователя по первому сообщению
function generateUserPersonality(firstMessage) {
    const message = firstMessage.toLowerCase();
    let personality = {
        tone: 'neutral',
        interests: [],
        expertise: 'beginner'
    };
    
    // Анализ тона
    if (message.includes('!') || message.includes('хочу') || message.includes('мечтаю')) {
        personality.tone = 'enthusiastic';
    }
    if (message.includes('?') || message.includes('почему') || message.includes('как')) {
        personality.tone = 'curious';
    }
    if (message.includes('спасибо') || message.includes('пожалуйста')) {
        personality.tone = 'polite';
    }
    
    return personality;
}

// Функция для создания динамического промпта based на пользователе
function createDynamicPrompt(userContext, userMessage) {
    const personality = userContext.personality;
    
    return `${CREATIVE_SYSTEM_PROMPT}

# ТЕКУЩИЙ КОНТЕКСТ:
Пользователь: ${personality.tone} тон, интересуется: ${personality.interests.join(', ') || 'кофе и атмосферой'}, уровень: ${personality.expertise}
Последнее сообщение: "${userMessage}"

# ТВОЯ ЗАДАЧА:
Создать уникальный, продуманный ответ, который:
- Идеально подходит под личность этого гостя
- Раскрывает тему глубоко и интересно
- Создает эмоциональную связь
- Запоминается своей оригинальностью

ДЕЙСТВУЙ!`;
}

// Главный обработчик чата
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId = 'user-' + Date.now() } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Сообщение не может быть пустым' 
            });
        }

        console.log('🔍 Анализирую вопрос:', message);

        // Анализируем тип вопроса
        const questionType = analyzeQuestionType(message);
        console.log('📊 Тип вопроса:', questionType.type);

        // Если это быстрая кнопка - возвращаем шаблонный ответ
        if (questionType.type === 'quick_button') {
            const templateResponse = QUICK_BUTTON_RESPONSES[questionType.phrase];
            if (templateResponse) {
                console.log('🎯 Использую шаблонный ответ для быстрой кнопки');
                return res.json({ 
                    success: true, 
                    response: templateResponse,
                    source: 'quick_button_template',
                    question_type: questionType
                });
            }
        }

        // Для всех остальных случаев - креативное мышление
        const userContext = createConversationContext(userId, message);
        const dynamicPrompt = createDynamicPrompt(userContext, message);
        
        const conversationHistory = userContext.history.slice(-6).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Если API ключ не установлен, используем улучшенный креативный fallback
        if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-92766c2ec9ac4cc9934bd3b800661efb') {
            const creativeResponse = await generateCreativeResponse(message, userContext, questionType);
            return res.json({ 
                success: true, 
                response: creativeResponse,
                source: 'creative_fallback',
                question_type: questionType
            });
        }

        // Вызов DeepSeek API с настройками для креативности
        const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: dynamicPrompt },
                    ...conversationHistory
                ],
                max_tokens: 2000,
                temperature: 0.9,
                top_p: 0.95,
                frequency_penalty: 0.5,
                presence_penalty: 0.4,
                stream: false
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`DeepSeek API error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        const aiResponse = data.choices[0].message.content;

        // Сохраняем ответ в историю
        userContext.history.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: Date.now()
        });

        console.log('✅ Креативный ответ создан');

        res.json({ 
            success: true, 
            response: aiResponse,
            source: 'deepseek_creative',
            question_type: questionType,
            memory: userContext.history.length
        });

    } catch (error) {
        console.error('💥 Ошибка:', error);
        
        const fallbackResponse = await generateCreativeResponse(
            req.body.message || 'Привет', 
            { personality: { tone: 'neutral', interests: [], expertise: 'beginner' } },
            { type: 'free_form', complexity: 'high' }
        );
        
        res.json({ 
            success: true, 
            response: fallbackResponse,
            source: 'error_fallback',
            question_type: { type: 'free_form', complexity: 'high' }
        });
    }
});

// Креативный генератор ответов для fallback
async function generateCreativeResponse(message, userContext, questionType) {
    // Имитируем "размышление" ИИ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const personality = userContext.personality;
    
    // Креативные ответы для свободных вопросов
    const creativeResponses = [
        `Знаете, ваш вопрос заставил меня задуматься... ${getContextualIntro(message)}`,
        
        `О, как интересно вы спросили! ${getPersonalizedResponse(personality.tone)}`,
        
        `Давайте посмотрим на это под необычным углом... ${getMetaphoricalResponse(message)}`,
        
        `Чувствую, что за вашим вопросом скрывается настоящее любопытство! ${getEngagingResponse()}`
    ];
    
    const randomResponse = creativeResponses[Math.floor(Math.random() * creativeResponses.length)];
    return randomResponse;
}

// Вспомогательные функции для креативных ответов
function getContextualIntro(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('кофе')) {
        return "Кофе - это ведь не просто напиток, а целый мир со своей историей. Позвольте рассказать вам то, о чем обычно молчат кофейные зерна...";
    }
    if (lowerMessage.includes('чай') || lowerMessage.includes('матча')) {
        return "Японский чай - это медитация в каждой чашке. Знаете ли вы, что за простотой церемонии скрывается глубокая философия?";
    }
    if (lowerMessage.includes('атмосфер') || lowerMessage.includes('уют')) {
        return "Атмосфера нашей кофейни создавалась с мыслью о том, что пространство должно обнимать гостя, а не просто окружать его...";
    }
    
    return "Это напоминает мне одну историю о том, как маленькие детали создают большие впечатления...";
}

function getPersonalizedResponse(tone) {
    const responses = {
        enthusiastic: "Ваша энергия заразительна! Позвольте поделиться с вами самым вдохновляющим, что есть в нашей кофейне...",
        curious: "Люблю такие глубокие вопросы! Они открывают двери к самым интересным историям...",
        polite: "Ваша вежливость располагает к душевной беседе. Позвольте ответить вам с таким же вниманием...",
        neutral: "Позвольте мне раскрыть эту тему с неожиданной стороны, которая, уверен, вас заинтересует..."
    };
    
    return responses[tone] || responses.neutral;
}

function getMetaphoricalResponse(message) {
    const metaphors = [
        "Это как читать книгу, где каждая глава - новый вкусовой оттенок...",
        "Представьте, что кофейные зерна - это ноты, а бариста - композитор...",
        "Это напоминает мне японский сад камней - кажущаяся простота скрывает глубокую гармонию...",
        "Как в хорошем романе, за простым вопросом скрывается увлекательный сюжет..."
    ];
    
    return metaphors[Math.floor(Math.random() * metaphors.length)];
}

function getEngagingResponse() {
    const engagements = [
        "Давайте вместе исследуем этот вопрос и найдем в нем что-то особенное для вас!",
        "Позвольте провести вас по лабиринту вкусов и историй, который скрывается за вашим вопросом...",
        "Это прекрасный повод рассказать вам то, что обычно остается за кадром...",
        "Ваш вопрос - как ключ к секретной комнате в нашем кофейном царстве!"
    ];
    
    return engagements[Math.floor(Math.random() * engagements.length)];
}

// Очистка старых контекстов
setInterval(() => {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    for (const [userId, context] of conversationMemories.entries()) {
        if (context.createdAt < hourAgo) {
            conversationMemories.delete(userId);
            console.log(`🧹 Очищен контекст пользователя: ${userId}`);
        }
    }
}, 30 * 60 * 1000);

// Стартовая страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TimeTo Coffee - Умный AI</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    margin: 40px; 
                    background: #f5f5f5;
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .ai-badge {
                    background: linear-gradient(135deg, #8B4513, #A0522D);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    margin-left: 10px;
                }
                .feature {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>☕ TimeTo Coffee <span class="ai-badge">Умный AI</span></h1>
                <p><strong>Режим:</strong> Адаптивные ответы</p>
                
                <div class="feature">
                    <h3>🎯 Быстрые кнопки → Шаблонные ответы</h3>
                    <p>Фразы: "меню", "часы работы", "адрес", "бронирование", "мероприятия", "доставка", "кофе", "япония"</p>
                </div>
                
                <div class="feature">
                    <h3>🧠 Свободные вопросы → Креативные ответы</h3>
                    <p>Любые другие вопросы получают уникальные, продуманные ответы</p>
                </div>
                
                <p><strong>API endpoint:</strong> <code>POST /api/chat</code></p>
                
                <div style="margin-top: 20px;">
                    <h4>Примеры тестирования:</h4>
                    <ul>
                        <li><code>"меню"</code> → шаблонный ответ</li>
                        <li><code>"расскажи о своем самом необычном напитке"</code> → креативный ответ</li>
                        <li><code>"что сегодня особенного?"</code> → креативный ответ</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Умный AI сервер запущен на порту ${PORT}`);
    console.log(`🎯 Режим: Шаблоны только для быстрых кнопок`);
    console.log(`🔗 API: http://localhost:${PORT}/api/chat`);
    
    console.log('\n📋 Быстрые кнопки (шаблонные ответы):');
    QUICK_BUTTON_PHRASES.forEach(phrase => {
        console.log(`   - "${phrase}"`);
    });
    
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-92766c2ec9ac4cc9934bd3b800661efb') {
        console.log('\n⚠️  Используется креативный fallback режим');
    } else {
        console.log('\n✅ DeepSeek API подключен');
    }
});