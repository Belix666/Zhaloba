const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Путь к файлу с жалобами
const complaintsPath = path.join(__dirname, 'complaints.json');

// Загрузка жалоб при запуске сервера
let complaints = [];
try {
    const data = fs.readFileSync(complaintsPath, 'utf8');
    complaints = JSON.parse(data);
} catch (error) {
    console.error('Error loading complaints:', error);
}

// Сохранение жалоб в файл
function saveComplaints() {
    fs.writeFileSync(complaintsPath, JSON.stringify(complaints, null, 2), 'utf8');
}

// Получить последние 15 жалоб
app.get('/api/complaints', (req, res) => {
    const last15 = complaints.slice(-15).reverse(); // последние 15, новые сверху
    res.json(last15);
});

// Отправить жалобу
app.post('/api/report', (req, res) => {
    const newComplaint = {
        id: Date.now(),
        text: req.body.text || 'Без текста',
        timestamp: new Date().toLocaleString('ru-RU')
    };
    
    complaints.push(newComplaint);
    saveComplaints();
    
    res.json({ count: complaints.length });
});

// Статические файлы
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});