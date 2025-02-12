document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/pages/auth.html';
        return;
    }

    // Загрузка данных пользователя
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentUser.email);

    // Обновление информации
    document.getElementById('username').textContent = user.username;
    document.getElementById('user-email').textContent = user.email;
    if (user.avatar) {
        document.getElementById('user-avatar').src = user.avatar;
    } else {
        document.getElementById('user-avatar').src = '/assets/images/default-avatar.png';
    }

    // Смена аватарки
    document.getElementById('avatar-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            document.getElementById('user-avatar').src = event.target.result;
            user.avatar = event.target.result;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        };

        reader.readAsDataURL(file);
    });

    // Обновление профиля
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const newUsername = document.getElementById('edit-username').value;
        const newPassword = document.getElementById('new-password').value;

        if (newUsername) {
            user.username = newUsername;
            document.getElementById('username').textContent = newUsername;
        }

        if (newPassword) {
            user.password = newPassword;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Изменения сохранены!');
    });

    // Выход
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    });

    // Загрузка статистики
    updateStats();
});

// Функция для обновления статистики
function updateStats() {
    const savedNews = JSON.parse(localStorage.getItem('news')) || [];
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
    const savedLikes = JSON.parse(localStorage.getItem('likes')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Количество добавленных новостей
    const newsCount = savedNews.filter(news => news.author === currentUser.email).length;
    document.getElementById('news-count').textContent = newsCount;

    // Количество комментариев
    const commentsCount = savedComments.filter(comment => comment.author === currentUser.email).length;
    document.getElementById('comments-count').textContent = commentsCount;

    // Количество лайков
    const likesCount = savedLikes.filter(like => like.author === currentUser.email).length;
    document.getElementById('likes-count').textContent = likesCount;
}