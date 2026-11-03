// Укажите URL вашего бекенда (после деплоя)
const API_URL = 'https://zhaloba.onrender.com/api/report';

document.addEventListener('DOMContentLoaded', () => {
    const reportBtn = document.getElementById('reportBtn');
    const countSpan = document.getElementById('count');
    const messageDiv = document.getElementById('message');

    // Загружаем текущий счетчик
    loadCount();

    reportBtn.addEventListener('click', async () => {
        reportBtn.disabled = true;
        messageDiv.textContent = '';
        messageDiv.className = 'message';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке');
            }

            const data = await response.json();
            countSpan.textContent = data.count;
            messageDiv.textContent = 'Спасибо! Жалоба отправлена.';
            messageDiv.className = 'message';
        } catch (error) {
            messageDiv.textContent = 'Ошибка. Попробуйте позже.';
            messageDiv.className = 'message error';
            console.error('Error:', error);
        } finally {
            reportBtn.disabled = false;
        }
    });

    async function loadCount() {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                countSpan.textContent = data.count;
            }
        } catch (error) {
            console.error('Error loading count:', error);
        }
    }
});
