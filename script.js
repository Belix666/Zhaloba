const API_URL = 'https://zhaloba.onrender.com/api/complaints';
const API_COMPLAINTS_URL = 'https://zhaloba.onrender.com/api/complaints';

document.addEventListener('DOMContentLoaded', () => {
    const reportBtn = document.getElementById('reportBtn');
    const countSpan = document.getElementById('count');
    const messageDiv = document.getElementById('message');
    const complaintsSection = document.getElementById('complaintsSection');
    const complaintsList = document.getElementById('complaintsList');

    // Загружаем текущий счетчик
    loadCount();
    loadComplaints();

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
            
            // Перезагружаем список жалоб
            loadComplaints();
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

    async function loadComplaints() {
        try {
            const response = await fetch(API_COMPLAINTS_URL);
            if (response.ok) {
                const complaints = await response.json();
                displayComplaints(complaints);
            } else {
                complaintsList.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">Ошибка загрузки жалоб</div>';
            }
        } catch (error) {
            complaintsList.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">Ошибка загрузки жалоб</div>';
            console.error('Error loading complaints:', error);
        }
    }

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
            
            // Перезагружаем список жалоб
            loadComplaints();
        } catch (error) {
            messageDiv.textContent = 'Ошибка. Попробуйте позже.';
            messageDiv.className = 'message error';
            console.error('Error:', error);
        } finally {
            reportBtn.disabled = false;
        }
    });

    function displayComplaints(complaints) {
        if (!complaintsList) return;
        
        complaintsList.innerHTML = complaints.map(complaint => `
            <div class="complaint-item">
                <div class="complaint-date">${complaint.timestamp}</div>
                <div class="complaint-text">${complaint.text}</div>
            </div>
        `).join('');
    }
});
