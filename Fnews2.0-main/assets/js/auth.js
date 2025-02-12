// Локальное хранилище для пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];

// Переключение между формами регистрации и входа
document.getElementById('show-login').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем действие по умолчанию (переход по ссылке)
    document.getElementById('register-section').style.display = 'none'; // Скрываем форму регистрации
    document.getElementById('login-section').style.display = 'block'; // Показываем форму входа
});

document.getElementById('show-register').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем действие по умолчанию (переход по ссылке)
    document.getElementById('login-section').style.display = 'none'; // Скрываем форму входа
    document.getElementById('register-section').style.display = 'block'; // Показываем форму регистрации
});
// Регистрация
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('reg-username').value;
    let email = document.getElementById('reg-email').value;
    let password = document.getElementById('reg-password').value;

    // Проверка, существует ли пользователь
    let userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('Пользователь с таким email уже существует!');
        return;
    }

    // Добавление нового пользователя
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь войдите в систему.');

    // Перенаправление на страницу входа
    window.location.href = 'auth.html'; // Остаёмся на той же странице, но переключаемся на форму входа
});

// Вход
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    // Поиск пользователя
    let user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Вход выполнен!');
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Перенаправление на главную страницу или профиль
        window.location.href = '../index.html'; // Или 'profile.html', если хотите перенаправить в профиль
    } else {
        alert('Неверный email или пароль!');
    }
});
