// Основной JavaScript файл с улучшениями
class TimeToCoffeeApp {
    constructor() {
        this.init();
    }

    init() {
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initImageLazyLoading();
        this.initUXImprovements();
        this.initVideoHandler();
        this.fixImagePaths();
        this.initFeatureCards();
        this.initAI();
    }

    initAI() {
        // Инициализация AI помощника
        this.initializeAssistant();
    }

    // Плавная прокрутка к якорям
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Анимации при скролле
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const animateElements = document.querySelectorAll('.feature-card, .about-image, .history-image');
        
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    // Ленивая загрузка изображений
    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Обработка видео
    initVideoHandler() {
        const video = document.querySelector('.video-background video');
        const videoHero = document.querySelector('.hero');
        
        if (!video) {
            console.log('Видео не найдено на странице');
            return;
        }

        // Функция для показа фолбэка
        const showFallback = () => {
            if (videoHero) {
                videoHero.classList.add('no-video');
            }
            if (video) {
                video.style.display = 'none';
            }
        };

        // Обработчики событий видео
        video.addEventListener('error', (e) => {
            console.error('Ошибка загрузки видео:', e);
            showFallback();
        });

        // Пытаемся воспроизвести видео
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.log('Автовоспроизведение видео не удалось:', error);
                showFallback();
            });
        }
    }

    // Исправление путей к изображениям
    fixImagePaths() {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
            img.addEventListener('error', function() {
                console.warn('Ошибка загрузки изображения:', this.src);
            });
        });
    }

    // Улучшения UX
    initUXImprovements() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        this.initErrorHandling();
    }

    // Обработка ошибок
    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Произошла ошибка:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанный Promise:', e.reason);
        });
    }

    // Улучшение для feature cards
    initFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            const bgImage = card.getAttribute('data-bg-image');
            if (bgImage) {
                this.preloadImage(`images/features/${bgImage}`);
            }
            
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Функция предзагрузки изображений
    preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    // Инициализация AI помощника
    initializeAssistant() {
        console.log('🚀 Инициализация AI помощника...');
        
        // Находим элементы по правильным ID
        const elements = {
            assistantBtn: document.getElementById('deepseek-assistant-btn'),
            chatWindow: document.getElementById('deepseek-chat-window'),
            closeBtn: document.getElementById('close-chat'),
            messagesContainer: document.getElementById('chat-messages'),
            userInput: document.getElementById('user-input'),
            sendBtn: document.getElementById('send-btn')
        };

        // Проверяем, что все элементы найдены
        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.warn(`⚠️ Элемент не найден: ${name}`);
                return;
            }
        }

        console.log('✅ Все элементы DOM успешно найдены');

        // Состояние чата
        let isChatOpen = false;

        // Обработчики событий
        elements.assistantBtn.addEventListener('click', toggleChat);
        elements.closeBtn.addEventListener('click', closeChat);
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function toggleChat() {
            if (isChatOpen) {
                closeChat();
            } else {
                openChat();
            }
        }

        function openChat() {
            elements.chatWindow.classList.remove('hidden');
            isChatOpen = true;
            setTimeout(() => elements.userInput.focus(), 100);
        }

        function closeChat() {
            elements.chatWindow.classList.add('hidden');
            isChatOpen = false;
        }

        async function sendMessage() {
            const message = elements.userInput.value.trim();
            if (!message) return;

            addMessage('user', message);
            elements.userInput.value = '';
            elements.sendBtn.disabled = true;
            
            showTypingIndicator();

            try {
                const response = await callAPI(message);
                removeTypingIndicator();
                addMessage('assistant', response);
            } catch (error) {
                removeTypingIndicator();
                addMessage('assistant', 'Извините, сервис временно недоступен. Позвоните нам: +7 (495) 123-45-67 ☕');
                console.error('API Error:', error);
            } finally {
                elements.sendBtn.disabled = false;
                elements.userInput.focus();
            }
        }

        // Функция для быстрых вопросов
        window.sendQuickQuestion = function(question) {
            addMessage('user', question);
            elements.sendBtn.disabled = true;
            showTypingIndicator();

            callAPI(question)
                .then(response => {
                    removeTypingIndicator();
                    addMessage('assistant', response);
                })
                .catch(error => {
                    removeTypingIndicator();
                    addMessage('assistant', 'Ошибка соединения. Попробуйте еще раз.');
                })
                .finally(() => {
                    elements.sendBtn.disabled = false;
                });
        }

        async function callAPI(message) {
            // Временная заглушка - в реальном приложении здесь будет вызов API
            return new Promise((resolve) => {
                setTimeout(() => {
                    const responses = {
                        'меню': 'У нас есть разнообразное меню: кофе, чай, десерты и специальные предложения. Рекомендую попробовать наш Японский латте за 350₽ или Матча тирамису за 420₽!',
                        'часы работы': 'Мы работаем: Пн-Пт: 8:00-23:00, Сб-Вс: 9:00-00:00',
                        'адрес': 'Мы находимся по адресу: Трёхсвятская улица, 31, Тверь',
                        'бронирование': 'Для бронирования столика позвоните по номеру +7 (495) 123-45-67 или заполните форму на сайте',
                        'мероприятия': 'Проводим мастер-классы по кофе, гадания на кофейной гуще и косплей-вечера. Расписание на сайте.',
                        'доставка': 'Доставка осуществляется в пределах города. Минимальный заказ - 500₽. Время доставки 30-45 минут.',
                        'кофе': 'Используем отборные зерна арабики. Есть эспрессо, латте, капучино, а также авторские напитки с японскими нотками.',
                        'япония': 'Наша кофейня вдохновлена японской культурой. В интерьере и меню сочетаем кофейные традиции с японской эстетикой.'
                    };

                    const response = responses[message.toLowerCase()] || 
                        'Спасибо за вопрос! Я могу рассказать о нашем меню, часах работы, мероприятиях или помочь с бронированием. Что вас интересует? ☕';
                    
                    resolve(response);
                }, 1000);
            });

            /*
            // Раскомментируйте для использования реального API:
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    userId: 'user-' + Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }

            return data.response;
            */
        }

        function addMessage(role, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}`;
            
            const formattedText = text.replace(/\n/g, '<br>');
            const sender = role === 'user' ? 'Вы' : 'Помощник';
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${formattedText}`;
            
            elements.messagesContainer.appendChild(messageDiv);
            scrollToBottom();
        }

        function showTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.id = 'typingIndicator';
            indicator.textContent = 'Помощник печатает...';
            elements.messagesContainer.appendChild(indicator);
            scrollToBottom();
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.remove();
            }
        }

        function scrollToBottom() {
            elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        }

        // Закрытие по клику вне области
        document.addEventListener('click', function(e) {
            if (isChatOpen && 
                !elements.chatWindow.contains(e.target) && 
                !elements.assistantBtn.contains(e.target)) {
                closeChat();
            }
        });

        console.log('🎉 AI помощник готов к работе!');
    }
}

// Конфигурация - теперь используем наш прокси
const CONFIG = {
    apiUrl: 'http://localhost:3000/api/chat' // URL вашего прокси-сервера
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new TimeToCoffeeApp();
});