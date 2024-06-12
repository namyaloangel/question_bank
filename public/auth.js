document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    fetch('/verify-token', {
        headers: { 'x-access-token': token }
    })
    .then(response => {
        if (!response.ok) throw new Error('Token verification failed');
    })
    .catch(error => {
        console.error(error);
        sessionStorage.clear();
        window.location.href = '/';
    });
});
