// AI Brain - Самообучающаяся нейросеть для кофейни
class CoffeeAI {
    constructor() {
        // Инициализируем свойства
        this.learningRate = 0.1;
        this.unknownQuestions = [];
        this.conversationHistory = [];
        
        // Инициализируем базовые знания
        this.knowledgeBase = this.initKnowledgeBase();
        
        // Начальные веса для категорий
        this.categoryWeights = {
            'меню': 1.0,
            'мероприятия': 1.0,
            'бронирование': 1.0,
            'цены': 1.0,
            'время работы': 1.0,
            'локация': 1.0,
            'кофе': 1.0,
            'десерты': 1.0,
            'история': 1.0,
            'философия': 1.0,
            'услуги': 1.0,
            'контакты': 1.0,
            'доставка': 1.0,
            'веган': 1.0
        };

        // Загружаем сохраненные данные
        this.loadSavedData();
    }

    // Инициализация базовых знаний
    initKnowledgeBase() {
        return {
            'меню': {
                patterns: ['меню', 'что есть', 'напитки', 'еда', 'кухня', 'ассортимент', 'предложения', 'что попробовать'],
                responses: [
                    `У нас разнообразное меню с японским акцентом! 🍵

☕ **Кофе:**
• Японский латте - 350₽
• Эспрессо Сакура - 280₽
• Матча латте - 380₽
• Киотский капучино - 320₽

🍵 **Чай:**
• Чай Цветение Сакуры - 290₽
• Имбирный чай с медом - 270₽

🍰 **Десерты:**
• Матча тирамису - 420₽
• Дораяки - 380₽
• Веган моти - 340₽

🎯 **Специальные предложения:**
• Кофейный сет - 890₽
• Японский завтрак - 650₽

Полное меню смотрите на отдельной странице!`
                ],
                confidence: 0.9,
                learnedCount: 0
            },

            'мероприятия': {
                patterns: ['мероприятия', 'события', 'вечеринк', 'встреч', 'мастер-класс', 'гадани', 'косплей', 'аниме', 'ивент'],
                responses: [
                    `Мы регулярно проводим интересные события! 🎭

📅 **Регулярные мероприятия:**
• **Мастер-классы по кофе** - каждую субботу
• **Гадания на кофейной гуще** - пятница и суббота
• **Косплей-вечера** - каждые 2 недели
• **Аниме-показы** - по воскресеньям

🎟️ **Бронирование:** через приложение или по телефону +7 (495) 123-45-67`
                ],
                confidence: 0.85,
                learnedCount: 0
            },

            'бронирование': {
                patterns: ['бронь', 'забронировать', 'столик', 'резерв', 'заказ стол', 'записаться'],
                responses: [
                    `Забронировать столик можно несколькими способами: 📅

1. **Через наше приложение** - самый быстрый способ
2. **По телефону** - +7 (495) 123-45-67
3. **Через форму на сайте** - в разделе "Бронирование"

🎁 **При бронировании через приложение - скидка 5%!**`
                ],
                confidence: 0.88,
                learnedCount: 0
            },

            'цены': {
                patterns: ['цена', 'стоимость', 'сколько стоит', 'ценник', 'дорог', 'дешев', 'прайс'],
                responses: [
                    `У нас демократичные цены за качественный кофе! 💰

☕ **Кофе:** 280-380₽
🍵 **Чай:** 270-330₽  
🍰 **Десерты:** 340-450₽
🎯 **Сеты:** 450-1200₽

💳 **Бонусная программа:**
• 1 напиток = 1 штамп
• 8 штампов = бесплатный напиток!`
                ],
                confidence: 0.82,
                learnedCount: 0
            },

            'время работы': {
                patterns: ['время работы', 'открыт', 'закрыт', 'работаете', 'график', 'часы', 'когда открываетесь'],
                responses: [
                    `Мы работаем для вас: 🕐

**Понедельник - Четверг:** 8:00 - 23:00
**Пятница:** 8:00 - 00:00  
**Суббота:** 9:00 - 00:00
**Воскресенье:** 9:00 - 22:00

📍 **Адрес:** Трёхсвятская улица, 31, Тверь`
                ],
                confidence: 0.9,
                learnedCount: 0
            },

            'кофе': {
                patterns: ['кофе', 'латте', 'эспрессо', 'капучино', 'американо', 'матча', 'раф', 'напиток'],
                responses: [
                    `У нас отличный кофе! ☕

**Популярные напитки:**
• Японский латте - 350₽ (матча + ваниль + сакура)
• Эспрессо Сакура - 280₽ (цветочные ноты)
• Матча латте - 380₽ (настоящий японский матча)
• Киотский капучино - 320₽ (на миндальном молоке)

🎯 **Рекомендую попробовать японский латте - это наша визитная карточка!**`
                ],
                confidence: 0.87,
                learnedCount: 0
            },

            'десерты': {
                patterns: ['десерт', 'сладкое', 'торт', 'пирожное', 'тирамису', 'моти', 'дораяки', 'чизкейк'],
                responses: [
                    `Наши десерты - это объедение! 🍰

**Японские сладости:**
• Дораяки - 380₽ (блинчики с бобовой пастой)
• Веган моти - 340₽ (рисовые пирожные)
• Матча тирамису - 420₽ (зеленый чай вместо кофе)

🎨 **Все десерты красиво оформлены - идеально для фото!`
                ],
                confidence: 0.83,
                learnedCount: 0
            },

            'история': {
                patterns: ['история', 'основатели', 'создан', 'открылся', 'мария', 'такеши', 'основание'],
                responses: [
                    `Наша история началась с мечты! 📖

**2018 год** - Мария и Такеши путешествовали по Японии и вдохновились гармонией чайных церемоний.

**2019 год** - Открытие первой кофейни.

**2022 год** - Создание мобильного приложения.

🎯 **Философия:** "Кофе - это искусство, которое объединяет людей"

Основатели: Мария (российская бариста) и Такеши (японский кофейный мастер)`
                ],
                confidence: 0.8,
                learnedCount: 0
            },

            'философия': {
                patterns: ['философия', 'концепция', 'идея', 'миссия', 'гармония', 'японск', 'культура'],
                responses: [
                    `Наша философия - гармония традиций и инноваций 🎎

🌸 **Японская эстетика:**
• Минимализм и простота
• Уважение к материалам
• Внимание к деталям

☕ **Кофейное искусство:**
• Современные методы приготовления
• Качественные зерна
• Профессиональные бариста

💫 **Наша миссия:** создавать пространство, где каждый может найти вдохновение.`
                ],
                confidence: 0.75,
                learnedCount: 0
            },

            'услуги': {
                patterns: ['услуги', 'предлагаете', 'можно ли', 'есть ли', 'wi-fi', 'интернет', 'работать', 'встреча'],
                responses: [
                    `Мы предлагаем разнообразные услуги для вашего комфорта: 🛎️

💻 **Для работы и учебы:**
• Быстрый Wi-Fi
• Удобные розетки
• Тихые зоны

🎉 **Для мероприятий:**
• Бронирование столов
• Организация праздников
• Пространство для воркшопов

☕ **Кофейные услуги:**
• Предзаказ через приложение
• Кофе с собой
• Подарочные сертификаты`
                ],
                confidence: 0.8,
                learnedCount: 0
            },

            'контакты': {
                patterns: ['контакты', 'телефон', 'адрес', 'email', 'связаться', 'написать', 'позвонить'],
                responses: [
                    `Свяжитесь с нами - будем рады общению! 📞

📍 **Адрес:** Трёхсвятская улица, 31, Тверь

📞 **Телефон:** +7 (495) 123-45-67

📧 **Email:** TimeToCoffe@yandex.ru

⏰ **Время работы:**
Пн-Чт: 8:00-23:00, Пт: 8:00-00:00
Сб: 9:00-00:00, Вс: 9:00-22:00`
                ],
                confidence: 0.9,
                learnedCount: 0
            },

            'доставка': {
                patterns: ['доставк', 'привезти', 'заказ на дом', 'доставя', 'курьер'],
                responses: [
                    `К сожалению, доставку мы пока не осуществляем 😔

Но у нас есть отличные альтернативы:

🚶 **Самовывоз:**
• Заказывайте через приложение
• Забирайте без очереди
• Готовим за 10-15 минут

📦 **Скоро запустим доставку! Следите за обновлениями.`
                ],
                confidence: 0.85,
                learnedCount: 0
            },

            'веган': {
                patterns: ['веган', 'вегетарианск', 'растительн', 'без молок', 'без яиц', 'без глютен'],
                responses: [
                    `У нас много опций для разных предпочтений! 🌱

🍵 **Веганские напитки:**
• Все чаи и матча
• Кофе на растительном молоке
• Соевое, миндальное, овсяное молоко

🍰 **Веганские десерты:**
• Веган моти - 340₽
• Растительный чизкейк - 420₽
• Безглютеновое печенье - 280₽

💚 **Все веганские позиции отмечены специальным значком в меню!`
                ],
                confidence: 0.8,
                learnedCount: 0
            }
        };
    }

    // Загрузка сохраненных данных
    loadSavedData() {
        try {
            const savedKnowledge = this.loadFromLocalStorage('coffeeAI_knowledge');
            const savedWeights = this.loadFromLocalStorage('coffeeAI_weights');
            const savedUnknown = this.loadFromLocalStorage('coffeeAI_unknown');

            if (savedKnowledge) {
                // Объединяем с базовыми знаниями
                Object.keys(savedKnowledge).forEach(category => {
                    if (this.knowledgeBase[category]) {
                        // Объединяем паттерны и ответы
                        this.knowledgeBase[category].patterns = [
                            ...new Set([...this.knowledgeBase[category].patterns, ...savedKnowledge[category].patterns])
                        ];
                        this.knowledgeBase[category].responses = [
                            ...new Set([...this.knowledgeBase[category].responses, ...savedKnowledge[category].responses])
                        ];
                        this.knowledgeBase[category].confidence = savedKnowledge[category].confidence;
                        this.knowledgeBase[category].learnedCount = savedKnowledge[category].learnedCount;
                    } else {
                        this.knowledgeBase[category] = savedKnowledge[category];
                    }
                });
            }
            
            if (savedWeights) {
                this.categoryWeights = { ...this.categoryWeights, ...savedWeights };
            }
            
            if (savedUnknown) {
                this.unknownQuestions = savedUnknown;
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных AI:', error);
        }
    }

    // Анализ вопроса и поиск лучшего ответа
    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        // Поиск по категориям
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            const score = this.calculateMatchScore(lowerQuestion, data.patterns);
            const weightedScore = score * (this.categoryWeights[category] || 1.0) * data.confidence;
            
            if (weightedScore > highestScore) {
                highestScore = weightedScore;
                bestMatch = {
                    category: category,
                    score: weightedScore,
                    response: this.getRandomResponse(data.responses),
                    data: data
                };
            }
        }

        // Если совпадение слабое, сохраняем для обучения
        if (highestScore < 0.3) {
            this.saveUnknownQuestion(question);
            return {
                category: 'unknown',
                response: this.getDefaultResponse(),
                score: highestScore,
                needsLearning: true
            };
        }

        return bestMatch;
    }

    // Расчет степени совпадения
    calculateMatchScore(question, patterns) {
        let score = 0;
        patterns.forEach(pattern => {
            if (question.includes(pattern)) {
                score += 1 / (1 + Math.abs(question.length - pattern.length));
            }
        });
        return Math.min(score, 1);
    }

    // Обучение на основе фидбека
    learnFromFeedback(question, category, wasHelpful) {
        if (!this.knowledgeBase[category]) return;

        const data = this.knowledgeBase[category];
        
        if (wasHelpful) {
            // Увеличиваем уверенность и добавляем паттерн
            data.confidence = Math.min(data.confidence + this.learningRate, 1.0);
            this.categoryWeights[category] = (this.categoryWeights[category] || 1.0) + 0.05;
            
            // Добавляем новые ключевые слова из вопроса
            const words = question.toLowerCase().split(' ').filter(word => word.length > 3);
            words.forEach(word => {
                if (!data.patterns.includes(word)) {
                    data.patterns.push(word);
                }
            });
        } else {
            // Уменьшаем уверенность
            data.confidence = Math.max(data.confidence - this.learningRate, 0.1);
        }

        data.learnedCount++;
        this.saveKnowledge();
    }

    // Добавление нового знания
    addNewKnowledge(question, answer, category = 'general') {
        if (!this.knowledgeBase[category]) {
            this.knowledgeBase[category] = {
                patterns: [],
                responses: [],
                confidence: 0.7,
                learnedCount: 0
            };
        }

        const words = question.toLowerCase().split(' ').filter(word => word.length > 3);
        words.forEach(word => {
            if (!this.knowledgeBase[category].patterns.includes(word)) {
                this.knowledgeBase[category].patterns.push(word);
            }
        });

        if (!this.knowledgeBase[category].responses.includes(answer)) {
            this.knowledgeBase[category].responses.push(answer);
        }

        this.saveKnowledge();
    }

    // Сохранение неизвестных вопросов
    saveUnknownQuestion(question) {
        if (!this.unknownQuestions.includes(question)) {
            this.unknownQuestions.push(question);
            this.saveToLocalStorage('coffeeAI_unknown', this.unknownQuestions);
        }
    }

    // Случайный ответ из доступных
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Ответ по умолчанию для неизвестных вопросов
    getDefaultResponse() {
        const defaults = [
            "Интересный вопрос! Я еще учусь. Можете уточнить вопрос о меню, мероприятиях или бронировании?",
            "Пока не уверен в ответе. Попробуйте спросить о нашем кофе или мероприятиях!",
            "Хм, это выходит за рамки моих текущих знаний. Наши сотрудники точно помогут - позвоните +7 (495) 123-45-67",
            "Я еще расту и не все знаю 😊 Спросите лучше о японском латте или косплей-вечерах!",
            "Отличный вопрос! Пока я не могу на него ответить, но наши бариста точно помогут - приходите в кофейну!"
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    // Сохранение знаний в localStorage
    saveKnowledge() {
        this.saveToLocalStorage('coffeeAI_knowledge', this.knowledgeBase);
        this.saveToLocalStorage('coffeeAI_weights', this.categoryWeights);
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.log('Не удалось сохранить в localStorage:', e);
        }
    }

    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.log('Не удалось загрузить из localStorage:', e);
            return null;
        }
    }

    // Статистика обучения
    getLearningStats() {
        const stats = {
            totalCategories: Object.keys(this.knowledgeBase).length,
            totalLearned: 0,
            unknownQuestions: this.unknownQuestions.length,
            mostConfident: '',
            leastConfident: ''
        };

        let maxConfidence = 0;
        let minConfidence = 1;

        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            stats.totalLearned += data.learnedCount;
            if (data.confidence > maxConfidence) {
                maxConfidence = data.confidence;
                stats.mostConfident = category;
            }
            if (data.confidence < minConfidence) {
                minConfidence = data.confidence;
                stats.leastConfident = category;
            }
        }

        return stats;
    }

    // Очистка знаний (для тестирования)
    clearKnowledge() {
        localStorage.removeItem('coffeeAI_knowledge');
        localStorage.removeItem('coffeeAI_weights');
        localStorage.removeItem('coffeeAI_unknown');
        this.knowledgeBase = this.initKnowledgeBase();
        this.categoryWeights = {
            'меню': 1.0, 'мероприятия': 1.0, 'бронирование': 1.0, 'цены': 1.0,
            'время работы': 1.0, 'локация': 1.0, 'кофе': 1.0, 'десерты': 1.0,
            'история': 1.0, 'философия': 1.0, 'услуги': 1.0, 'контакты': 1.0
        };
        this.unknownQuestions = [];
    }
}

// Создаем глобальный экземпляр для доступа из консоли
window.CoffeeAI = CoffeeAI;