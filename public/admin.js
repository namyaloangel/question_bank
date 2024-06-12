document.addEventListener('DOMContentLoaded', async function() {
    const token = sessionStorage.getItem('token');

    // Load quizzes
    const quizResponse = await fetch('/quizzes', {
        headers: { 'x-access-token': token }
    });
    const quizzes = await quizResponse.json();
    const quizList = document.getElementById('quizList');
    quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.className = 'quiz-item';
        quizItem.innerHTML = `<h3>${quiz.title}</h3><p>${quiz.description}</p>`;
        quizList.appendChild(quizItem);
    });

    // Load student results
    const resultResponse = await fetch('/results', {
        headers: { 'x-access-token': token }
    });
    const results = await resultResponse.json();
    const resultsTable = document.getElementById('resultsTable');
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${result.username}</td><td>${result.quiz_title}</td><td>${result.score}</td><td>${result.passing_probability}</td><td>${new Date(result.date_taken).toLocaleString()}</td>`;
        resultsTable.appendChild(row);
    });

    document.getElementById('addQuiz').addEventListener('click', function() {
        // Code to open a form for adding a new quiz
    });
});
