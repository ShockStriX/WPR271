document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate login (replace with actual authentication in production)
            console.log('Login attempted with:', email);
            
            // Redirect to dashboard
            window.location.href = 'main.html';
        });
    }
});