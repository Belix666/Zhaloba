const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware должны стоять ДО маршрутов
app.use(cors());
app.use(express.json());

const complaintsPath = path.join(__dirname, 'complaints.json');

let complaints = [];
try {
    complaints = JSON.parse(fs.readFileSync(complaintsPath, 'utf8'));
} catch (error) {
    console.error('Error loading complaints:', error);
}

function saveComplaints() {
    fs.writeFileSync(complaintsPath, JSON.stringify(complaints, null, 2), 'utf8');
}

// Текущий счётчик
app.get('/api/report', (req, res) => {
    res.json({ count: complaints.length });
});

// Отправить жалобу
app.post('/api/report', (req, res) => {
    const newComplaint = {
        id: Date.now(),
        text: (req.body && req.body.text) || 'Без текста',
        timestamp: new Date().toLocaleString('ru-RU')
    };
    complaints.push(newComplaint);
    saveComplaints();
    res.json({ count: complaints.length });
});

// Последние 15 жалоб, новые сверху
app.get('/api/complaints', (req, res) => {
    res.json(complaints.slice(-15).reverse());
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
