// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const cartFloatingBtn = document.getElementById('cart-floating-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');

    // Корзина
    let cart = JSON.parse(localStorage.getItem('timeToCoffeeCart')) || [];

    // Инициализация
    initMenu();

    function initMenu() {
        initCategoryFilter();
        initCart();
        updateCartDisplay();
        initAI();
    }

    function initAI() {
        const assistantBtn = document.getElementById('deepseek-assistant-btn');
        const chatWindow = document.getElementById('deepseek-chat-window');
        const closeChat = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');

        if (assistantBtn && chatWindow) {
            assistantBtn.addEventListener('click', () => {
                chatWindow.classList.toggle('hidden');
            });

            if (closeChat) {
                closeChat.addEventListener('click', () => {
                    chatWindow.classList.add('hidden');
                });
            }

            if (sendBtn && userInput) {
                sendBtn.addEventListener('click', sendMessage);
                userInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            }
        }
    }

    function sendMessage() {
        const userInput = document.getElementById('user-input');
        const chatMessages = document.getElementById('chat-messages');
        const message = userInput.value.trim();
        
        if (!message) return;

        // Добавляем сообщение пользователя
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<strong>Вы:</strong> ${message}`;
        chatMessages.appendChild(userMessage);

        userInput.value = '';

        // Показываем индикатор набора
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.textContent = 'Помощник печатает...';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Имитируем ответ (в реальном приложении здесь будет API вызов)
        setTimeout(() => {
            typingIndicator.remove();
            
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

            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'message assistant';
            assistantMessage.innerHTML = `<strong>Помощник:</strong> ${response}`;
            chatMessages.appendChild(assistantMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }

    window.sendQuickQuestion = function(question) {
        const userInput = document.getElementById('user-input');
        userInput.value = question;
        sendMessage();
    };

    // Фильтрация по категориям
    function initCategoryFilter() {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Обновляем активную кнопку
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Фильтруем элементы
                filterMenuItems(category);
            });
        });
    }

    function filterMenuItems(category) {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Функционал корзины
    function initCart() {
        // Открытие/закрытие корзины
        cartFloatingBtn.addEventListener('click', toggleCart);
        cartClose.addEventListener('click', toggleCart);

        // Добавление в корзину
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.getAttribute('data-item');
                const itemPrice = parseInt(this.getAttribute('data-price'));
                
                addToCart(itemName, itemPrice);
                showAddToCartAnimation(this);
            });
        });

        // Оформление заказа
        checkoutBtn.addEventListener('click', checkout);
        
        // Закрытие корзины при клике вне ее области
        document.addEventListener('click', function(e) {
            if (!cartSidebar.contains(e.target) && !cartFloatingBtn.contains(e.target) && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
        });
        
        // Закрытие корзины по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
        });
    }

    function addToCart(itemName, itemPrice) {
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        
        // Обновляем отображение
        updateCartDisplay();
        
        // Показываем анимацию корзины
        showCartAnimation();
        
        // Показываем уведомление
        showToast(`"${itemName}" добавлен в корзину!`, 'success');
    }

    function removeFromCart(itemName) {
        cart = cart.filter(item => item.name !== itemName);
        localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        updateCartDisplay();
        showToast(`"${itemName}" удален из корзины`, 'info');
    }

    function updateCartDisplay() {
        // Обновляем количество в плавающей кнопке
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Обновляем общую сумму
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `${totalPrice}₽`;

        // Обновляем список товаров
        renderCartItems();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Корзина пуста</p>
                    <p>Добавьте товары из меню</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <span class="cart-item-total">${item.price * item.quantity}₽</span>
                    <button class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(cart[index].name);
            });
        });
    }

    function toggleCart() {
        cartSidebar.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    function checkout() {
        if (cart.length === 0) {
            showToast('Корзина пуста!', 'error');
            return;
        }

        // Сохраняем корзину и переходим на страницу оформления
        localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        
        // Рассчитываем общую сумму для передачи
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('orderTotal', total.toString());
        
        // В реальном приложении здесь будет переход на страницу оформления
        showToast('Функция оформления заказа будет реализована в ближайшее время!', 'info');
        
        // Для демо - очищаем корзину
        // cart = [];
        // localStorage.setItem('timeToCoffeeCart', JSON.stringify(cart));
        // updateCartDisplay();
        // toggleCart();
    }

    // Анимация корзины
    function showCartAnimation() {
        cartFloatingBtn.classList.add('added');
        setTimeout(() => {
            cartFloatingBtn.classList.remove('added');
        }, 600);
    }

    function showAddToCartAnimation(button) {
        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        button.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBackground;
        }, 2000);
    }

    // Вспомогательные функции
    function showToast(message, type = 'info') {
        // Создаем элемент тоста
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Добавляем стили
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(toast);

        // Анимация появления
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Автоматическое скрытие
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    function getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle',
            'warning': 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    function getToastColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'info': '#3b82f6',
            'warning': '#f59e0b'
        };
        return colors[type] || '#3b82f6';
    }

    // Анимация появления элементов при скролле
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    // Инициализация анимаций при загрузке
    setTimeout(initScrollAnimations, 100);
});