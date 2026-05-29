//Прокрутка на странице по клику
document.querySelectorAll('[data-target]').forEach(onScroll => {
    onScroll.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);

        target.scrollIntoView( {
            behavior: 'smooth'
        });
    });
});

// Маска телефона с применеием jq
function applyPhoneMask() {
    if (typeof $ !== 'undefined' && $.fn.mask) {
        $('#phone').mask('+7 (000) 000-00-00', {
            placeholder: '+7 (___) ___-__-__',
            clearIfNotMatch: true
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    applyPhoneMask();// Подключаем маску

    const form = document.querySelector('.contacts__form');
    const submitBtn = document.querySelector('.contacts__button');
    const messageParagraph = document.querySelector('.contacts__message');
    
    // Сохраняем оригинальный текст
    const originalMessageText = messageParagraph.textContent;
    
    // Функция показа сообщения
    function showMessage(text) {
        messageParagraph.textContent = text;
        
        // Возвращаем оригинальный текст
        setTimeout(() => {
            messageParagraph.textContent = originalMessageText;
        }, 5000);
    }
    
    // Функция показа ошибки под полем
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let errorDiv = field.parentElement.querySelector('.field-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentElement.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        field.style.borderColor = 'red';
    }
    
    // Функция очистки ошибок
    function clearErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.contacts__field input, .contacts__field textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    // Отправка формы
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Очищаем ошибки
        clearErrors();
        
        // Собираем данные
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            comment: document.getElementById('textarea').value.trim()
        };
        
        // Валидация
        let isValid = true;
        
        if (!formData.name) {
            showFieldError('name', 'Укажите ваше имя');
            isValid = false;
        }
        
        if (!formData.phone) {
            showFieldError('phone', 'Укажите ваш номер телефона');
            isValid = false;
        }
        
        if (!formData.email) {
            showFieldError('email', 'Укажите ваш email');
            isValid = false;
        }
        
        if (!formData.comment) {
            showFieldError('textarea', 'Напишите ваш комментарий');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Блокируем кнопку
        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        try {
            const response = await fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('Сообщение успешно отправлено!');
                form.reset();
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            showMessage('Ошибка: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalButtonText;
        }
    });
});