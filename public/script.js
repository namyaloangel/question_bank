document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        if (data.role === 'admin') {
            window.location.href = '/admin-dashboard';
        } else {
            window.location.href = '/user-page';
        }
    } else {
        alert('Invalid credentials');
    }
});
