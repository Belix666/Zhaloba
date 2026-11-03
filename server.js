const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Простое хранение в памяти (для демонстрации)
// В продакшене используйте базу данных
let reportCount = 0;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Получить количество жалоб
app.get('/api/report', (req, res) => {
    res.json({ count: reportCount });
});

// Отправить жалобу
app.post('/api/report', (req, res) => {
    reportCount++;
    res.json({ count: reportCount });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});