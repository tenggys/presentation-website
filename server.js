require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Настройка отправки писем через яндекс
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
        user: 'levgood21@yandex.ru',
        pass: 'hvroihhpsqkrnfbj'
    }
});

app.post('/send', async (req, res) => {
    const { name, phone, email, comment } = req.body;
    
    // Валидация
    if (!name || !phone || !email || !comment) {
        return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }
    
    try {
        // Письмо владельцу
        await transporter.sendMail({
            from: '"Форма обратной связи" <levgood21@yandex.ru>',
            to: 'levgood21@yandex.ru',
            subject: `Новое сообщение от ${name}`,
            text: `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}\nСообщение: ${comment}`
        });
        
        console.log('Письмо владельцу отправлено');
        
        // Копия пользователю
        await transporter.sendMail({
            from: '"Юрий Гуляев" <levgood21@yandex.ru>',
            to: email,
            subject: 'Копия вашего сообщения',
            text: `Здравствуйте, ${name}!\n\nМы получили ваше сообщение:\n${comment}\n\nС уважением,\nЮрий Гуляев`
        });
        
        console.log('Копия пользователю отправлена на:', email);
        res.json({ message: 'OK' });
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ message: 'Ошибка сервера: ' + error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});