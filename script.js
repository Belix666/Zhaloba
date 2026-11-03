const API_URL = 'https://zhaloba.onrender.com/api/report';
const API_COMPLAINTS_URL = 'https://zhaloba.onrender.com/api/complaints';

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

document.addEventListener('DOMContentLoaded', () => {
    const reportBtn = document.getElementById('reportBtn');
    const complaintText = document.getElementById('complaintText');
    const countSpan = document.getElementById('count');
    const messageDiv = document.getElementById('message');
    const complaintsList = document.getElementById('complaintsList');

    loadCount();
    loadComplaints();

    reportBtn.addEventListener('click', async () => {
        const text = complaintText.value.trim();

        if (!text) {
            messageDiv.textContent = 'Напиши текст жалобы.';
            messageDiv.className = 'message error';
            return;
        }

        reportBtn.disabled = true;
        messageDiv.textContent = '';
        messageDiv.className = 'message';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке');
            }

            const data = await response.json();
            countSpan.textContent = data.count;
            messageDiv.textContent = 'Спасибо! Жалоба отправлена.';
            messageDiv.className = 'message';
            complaintText.value = '';

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

    function displayComplaints(complaints) {
        if (!complaintsList) return;

        complaintsList.innerHTML = complaints.map(complaint => `
            <div class="complaint-item">
                <div class="complaint-date">${escapeHtml(complaint.timestamp)}</div>
                <div class="complaint-text">${escapeHtml(complaint.text)}</div>
            </div>
        `).join('');
    }
});
