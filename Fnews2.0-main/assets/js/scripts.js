// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('auth-link').style.display = 'none';
        document.getElementById('profile-link').style.display = 'block';
    }

    // Загрузка сохранённых новостей
    loadNews();
});

// Функция для загрузки новостей
function loadNews() {
    const newsContainer = document.querySelector('.news');
    const savedNews = JSON.parse(localStorage.getItem('news')) || [];

    // Очищаем только динамически добавленные новости
    const dynamicArticles = document.querySelectorAll('.article.dynamic');
    dynamicArticles.forEach(article => article.remove());

    // Добавляем сохранённые новости
    savedNews.forEach((news, index) => {
        const article = document.createElement('div');
        article.classList.add('article', 'dynamic'); // Добавляем класс dynamic

        const img = document.createElement('img');
        img.src = news.image;
        img.alt = news.title;

        const h2 = document.createElement('h2');
        h2.textContent = news.title;

        const p = document.createElement('p');
        p.textContent = news.description;

        // Время создания
        const time = document.createElement('p');
        time.textContent = `Создано: ${news.createdAt}`;
        time.style.fontSize = '12px';
        time.style.color = '#666';

        const a = document.createElement('a');
        a.href = '#';
        a.textContent = 'Читать далее';

        // Кнопка удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteNews(index));

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(p);
        article.appendChild(time); // Добавляем время создания
        article.appendChild(a);
        article.appendChild(deleteButton);

        newsContainer.appendChild(article);
    });
}

// Функция для удаления новости
function deleteNews(index) {
    const savedNews = JSON.parse(localStorage.getItem('news')) || [];
    savedNews.splice(index, 1); // Удаляем новость по индексу
    localStorage.setItem('news', JSON.stringify(savedNews));
    loadNews(); // Перезагружаем новости
}

// Поиск новостей
document.querySelector('.search button').addEventListener('click', function() {
    let searchQuery = document.querySelector('.search input').value.toLowerCase();
    let articles = document.querySelectorAll('.article');

    articles.forEach(article => {
        let title = article.querySelector('h2').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
});

// Функция для добавления новостей
document.getElementById('news-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    if (title && description && imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newsItem = {
                title,
                description,
                image: e.target.result,
                createdAt: new Date().toLocaleString() // Добавляем время создания
            };

            // Сохраняем новость в localStorage
            const savedNews = JSON.parse(localStorage.getItem('news')) || [];
            savedNews.push(newsItem);
            localStorage.setItem('news', JSON.stringify(savedNews));

            // Очищаем форму
            document.getElementById('news-form').reset();

            // Перезагружаем только динамические новости
            loadNews();
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Пожалуйста, заполните все поля!');
    }
});

// Развертывание новостей
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const expandedContent = this.closest('.article').querySelector('.news-expanded');
        expandedContent.style.display = expandedContent.style.display === 'none' ? 'block' : 'none';
    });
});

// Лайки
document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function() {
        const likeCount = this.querySelector('.like-count');
        let count = parseInt(likeCount.textContent);
        likeCount.textContent = count + 1;

        // Сохраняем лайк в localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const savedLikes = JSON.parse(localStorage.getItem('likes')) || [];
            savedLikes.push({ author: currentUser.email });
            localStorage.setItem('likes', JSON.stringify(savedLikes));
        }
    });
});

// Комментарии
document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentText = this.querySelector('textarea').value;
        if (commentText.trim()) {
            const commentList = this.previousElementSibling;
            const commentItem = document.createElement('div');
            commentItem.textContent = commentText;
            commentList.appendChild(commentItem);
            this.querySelector('textarea').value = ''; // Очищаем поле ввода

            // Сохраняем комментарий в localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
                savedComments.push({ author: currentUser.email, text: commentText });
                localStorage.setItem('comments', JSON.stringify(savedComments));
            }
        }
    });
});