// ai-module.js - единый модуль для AI
class CoffeeAIModule {
    constructor() {
        this.ai = null;
        this.isInitialized = false;
        this.currentConversation = [];
    }

    init() {
        if (this.isInitialized) return;
        
        if (typeof CoffeeAI !== 'undefined') {
            this.ai = new CoffeeAI();
            this.isInitialized = true;
            console.log('AI модуль инициализирован');
        } else {
            console.error('CoffeeAI class not found');
        }
    }

    getAI() {
        if (!this.isInitialized) this.init();
        return this.ai;
    }

    // Единая функция для инициализации чата
    initChat() {
        const aiSupportBtn = document.getElementById('ai-support-btn');
        const aiChatModal = document.getElementById('ai-chat-modal');
        
        if (!aiSupportBtn || !aiChatModal) {
            console.log('AI чат элементы не найдены на этой странице');
            return;
        }

        this.init(); // Инициализируем AI

        const ai = this.getAI();
        if (!ai) {
            console.error('Не удалось инициализировать AI');
            return;
        }

        // Остальной код инициализации чата...
        this.setupChatEventListeners(ai);
    }

    setupChatEventListeners(ai) {
        const aiSupportBtn = document.getElementById('ai-support-btn');
        const aiChatModal = document.getElementById('ai-chat-modal');
        const aiCloseBtn = document.getElementById('ai-close-btn');
        const aiChatInput = document.getElementById('ai-chat-input');
        const aiSendBtn = document.getElementById('ai-send-btn');
        const aiChatMessages = document.getElementById('ai-chat-messages');
        const aiTyping = document.getElementById('ai-typing');

        // Event listeners для чата
        aiSupportBtn.addEventListener('click', () => {
            aiChatModal.classList.add('active');
            setTimeout(() => {
                if (aiChatInput) aiChatInput.focus();
            }, 300);
        });

        aiCloseBtn.addEventListener('click', () => {
            aiChatModal.classList.remove('active');
        });

        // Закрытие по клику вне модального окна
        document.addEventListener('click', (e) => {
            if (!aiChatModal.contains(e.target) && 
                !aiSupportBtn.contains(e.target) && 
                aiChatModal.classList.contains('active')) {
                aiChatModal.classList.remove('active');
            }
        });

        // Отправка сообщения
        const sendMessage = () => {
            const message = aiChatInput.value.trim();
            if (!message) return;

            this.currentConversation.push(message);
            this.addMessage(message, true);
            aiChatInput.value = '';

            // AI отвечает
            this.showTypingIndicator(aiTyping);
            
            setTimeout(() => {
                this.hideTypingIndicator(aiTyping);
                const analysis = ai.analyzeQuestion(message);
                this.addMessage(analysis.response, false, analysis);
            }, 1000 + Math.random() * 1000);
        };

        aiSendBtn.addEventListener('click', sendMessage);
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Быстрые вопросы
        const quickButtons = document.querySelectorAll('.ai-quick-btn');
        quickButtons.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                aiChatInput.value = question;
                sendMessage();
            });
        });
    }

    addMessage(text, isUser = false, metadata = null) {
        const aiChatMessages = document.getElementById('ai-chat-messages');
        if (!aiChatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = `<i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        content.appendChild(textDiv);
        content.appendChild(timeDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        aiChatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator(aiTyping) {
        if (aiTyping) {
            aiTyping.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator(aiTyping) {
        if (aiTyping) {
            aiTyping.style.display = 'none';
        }
    }

    scrollToBottom() {
        const aiChatMessages = document.getElementById('ai-chat-messages');
        if (aiChatMessages) {
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }
    }
}

// Создаем глобальный экземпляр
window.coffeeAIModule = new CoffeeAIModule();