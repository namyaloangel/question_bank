document.addEventListener('DOMContentLoaded', async function() {
    const token = sessionStorage.getItem('token');

    // Load available exams
    const examResponse = await fetch('/quizzes', {
        headers: { 'x-access-token': token }
    });
    const exams = await examResponse.json();
    const examList = document.getElementById('examList');
    exams.forEach(exam => {
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        examItem.innerHTML = `<h3>${exam.title}</h3><button>Download</button>`;
        examList.appendChild(examItem);
    });

    // Load quizzes
    const quizList = document.getElementById('quizList');
    exams.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.className = 'quiz-item';
        quizItem.innerHTML = `<h3>${quiz.title}</h3><button>Start Quiz</button>`;
        quizList.appendChild(quizItem);
    });

    // Load user results
    const resultResponse = await fetch('/results', {
        headers: { 'x-access-token': token }
    });
    const results = await resultResponse.json();
    const userResultsTable = document.getElementById('userResultsTable');
    results.filter(result => result.username === sessionStorage.getItem('username')).forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${result.quiz_title}</td><td>${result.score}</td><td>${result.passing_probability}</td><td>${new Date(result.date_taken).toLocaleString()}</td>`;
        userResultsTable.appendChild(row);
    });
});
